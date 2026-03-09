interface Env {
  TILESPRIVACY: R2Bucket;
  GITHUB_REPO: string;
  SYNC_TRIGGER_TOKEN?: string;
  GITHUB_TOKEN?: string;
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  content_type?: string;
  updated_at?: string;
  digest?: string;
}

interface GitHubRelease {
  tag_name: string;
  html_url: string;
  assets: GitHubAsset[];
}

interface MultipartCompleteBody {
  parts: R2UploadedPart[];
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function isAuthorized(request: Request, env: Env): boolean {
  if (!env.SYNC_TRIGGER_TOKEN) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === env.SYNC_TRIGGER_TOKEN;
}

function pickLatestPkgAsset(assets: GitHubAsset[]): GitHubAsset | undefined {
  const pkgAssets = assets.filter((asset) => asset.name.toLowerCase().endsWith(".pkg"));
  if (pkgAssets.length === 0) return undefined;

  return pkgAssets.sort((a, b) => {
    const aTs = a.updated_at ? Date.parse(a.updated_at) : 0;
    const bTs = b.updated_at ? Date.parse(b.updated_at) : 0;
    return bTs - aTs;
  })[0];
}

function extractSha256(asset: GitHubAsset): string | null {
  const digest = asset.digest?.trim();
  if (!digest) return null;
  const lower = digest.toLowerCase();
  if (!lower.startsWith("sha256:")) return null;
  const value = digest.slice("sha256:".length).trim();
  if (!/^[a-fA-F0-9]{64}$/.test(value)) return null;
  return value.toLowerCase();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true });
    }

    if (request.method !== "POST") {
      return json({ error: "Not found" }, 404);
    }

    if (!isAuthorized(request, env)) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (url.pathname === "/sync/latest-pkg") {
      if (!env.GITHUB_REPO) {
        return json({ error: "Missing GITHUB_REPO variable" }, 500);
      }

      const latestReleaseUrl = `https://api.github.com/repos/${env.GITHUB_REPO}/releases/latest`;
      const releaseHeaders = new Headers({
        Accept: "application/vnd.github+json",
        "User-Agent": "tiles-release-sync-worker",
      });

      if (env.GITHUB_TOKEN) {
        releaseHeaders.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      }

      const releaseResponse = await fetch(latestReleaseUrl, { headers: releaseHeaders });
      if (!releaseResponse.ok) {
        return json(
          {
            error: "Failed to fetch latest GitHub release",
            status: releaseResponse.status,
          },
          502,
        );
      }

      const release = (await releaseResponse.json()) as GitHubRelease;
      const asset = pickLatestPkgAsset(release.assets ?? []);

      if (!asset) {
        return json(
          {
            error: "No .pkg assets found in latest release",
            release: release.html_url,
          },
          404,
        );
      }

      const downloadHeaders = new Headers({
        "User-Agent": "tiles-release-sync-worker",
      });
      if (env.GITHUB_TOKEN) {
        downloadHeaders.set("Authorization", `Bearer ${env.GITHUB_TOKEN}`);
      }

      const assetResponse = await fetch(asset.browser_download_url, { headers: downloadHeaders });
      if (!assetResponse.ok || !assetResponse.body) {
        return json(
          {
            error: "Failed to download .pkg asset",
            status: assetResponse.status,
            asset: asset.browser_download_url,
          },
          502,
        );
      }

      // Keep synced GitHub releases at the bucket root.
      const key = asset.name;
      await env.TILESPRIVACY.put(key, assetResponse.body, {
        httpMetadata: {
          contentType: asset.content_type ?? "application/octet-stream",
        },
        customMetadata: {
          github_repo: env.GITHUB_REPO,
          release_tag: release.tag_name,
          release_url: release.html_url,
        },
      });

      const sha256 = extractSha256(asset);
      let checksumKey: string | null = null;
      if (sha256) {
        checksumKey = `checksums/${asset.name}.sha256`;
        const checksumBody = `${sha256}  ${asset.name}\n`;
        await env.TILESPRIVACY.put(checksumKey, checksumBody, {
          httpMetadata: {
            contentType: "text/plain; charset=utf-8",
          },
          customMetadata: {
            github_repo: env.GITHUB_REPO,
            release_tag: release.tag_name,
            checksum_for: asset.name,
          },
        });
      }

      return json({
        ok: true,
        githubRepo: env.GITHUB_REPO,
        releaseTag: release.tag_name,
        uploadedKey: key,
        checksumKey,
        sha256,
        sourceAsset: asset.browser_download_url,
      });
    }

    if (url.pathname === "/sync/upload-file") {
      const key = url.searchParams.get("key");
      if (!key) {
        return json({ error: "Missing required query parameter: key" }, 400);
      }

      if (!request.body) {
        return json({ error: "Request body is required" }, 400);
      }

      const contentType = request.headers.get("content-type") ?? "application/octet-stream";
      await env.TILESPRIVACY.put(key, request.body, {
        httpMetadata: { contentType },
        customMetadata: {
          upload_source: "manual-cli",
        },
      });

      return json({
        ok: true,
        uploadedKey: key,
      });
    }

    if (url.pathname === "/sync/upload-file-multipart/start") {
      const key = url.searchParams.get("key");
      if (!key) {
        return json({ error: "Missing required query parameter: key" }, 400);
      }

      const contentType = url.searchParams.get("contentType") ?? "application/octet-stream";
      const multipart = await env.TILESPRIVACY.createMultipartUpload(key, {
        httpMetadata: { contentType },
      });

      return json({
        ok: true,
        key: multipart.key,
        uploadId: multipart.uploadId,
      });
    }

    if (url.pathname === "/sync/upload-file-multipart/part") {
      const key = url.searchParams.get("key");
      const uploadId = url.searchParams.get("uploadId");
      const partNumberRaw = url.searchParams.get("partNumber");
      const partNumber = partNumberRaw ? Number(partNumberRaw) : NaN;

      if (!key || !uploadId || !partNumberRaw || Number.isNaN(partNumber) || partNumber < 1) {
        return json({ error: "Missing or invalid key, uploadId, or partNumber" }, 400);
      }
      if (!request.body) {
        return json({ error: "Request body is required" }, 400);
      }

      const multipart = env.TILESPRIVACY.resumeMultipartUpload(key, uploadId);
      const part = await multipart.uploadPart(partNumber, request.body);
      return json(part);
    }

    if (url.pathname === "/sync/upload-file-multipart/complete") {
      const key = url.searchParams.get("key");
      const uploadId = url.searchParams.get("uploadId");
      if (!key || !uploadId) {
        return json({ error: "Missing key or uploadId" }, 400);
      }

      const body = (await request.json()) as MultipartCompleteBody;
      if (!body?.parts || !Array.isArray(body.parts) || body.parts.length === 0) {
        return json({ error: "Missing parts array in request body" }, 400);
      }

      const multipart = env.TILESPRIVACY.resumeMultipartUpload(key, uploadId);
      const object = await multipart.complete(body.parts);

      return json({
        ok: true,
        uploadedKey: object.key,
        etag: object.httpEtag,
      });
    }

    if (url.pathname === "/sync/upload-file-multipart/abort") {
      const key = url.searchParams.get("key");
      const uploadId = url.searchParams.get("uploadId");
      if (!key || !uploadId) {
        return json({ error: "Missing key or uploadId" }, 400);
      }

      const multipart = env.TILESPRIVACY.resumeMultipartUpload(key, uploadId);
      await multipart.abort();
      return json({ ok: true });
    }

    return json({ error: "Not found" }, 404);
  },
};
