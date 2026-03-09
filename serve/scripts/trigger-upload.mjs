import "dotenv/config";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const workerUrl = process.env.TILES_SYNC_WORKER_URL;
const triggerToken = process.env.TILES_SYNC_TRIGGER_TOKEN;
const workerUploadLimitBytes = 95 * 1024 * 1024;
const multipartPartSizeBytes = 8 * 1024 * 1024;

const command = process.argv[2] ?? "latest-pkg";

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".pkg": "application/octet-stream",
    ".zip": "application/zip",
    ".json": "application/json",
    ".txt": "text/plain; charset=utf-8",
    ".pdf": "application/pdf",
    ".dmg": "application/x-apple-diskimage",
  };
  return map[ext] ?? "application/octet-stream";
}

async function sendRequest(endpoint, init) {
  const response = await fetch(endpoint, init);

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    const text = await response.text().catch(() => "");
    payload = { error: "Worker returned non-JSON response", body: text };
  }

  if (!response.ok) {
    throw new Error(JSON.stringify(payload, null, 2));
  }

  return payload;
}

function requireWorkerAuth() {
  if (!workerUrl || !triggerToken) {
    console.error(
      [
        "Missing required environment variables.",
        "Set TILES_SYNC_WORKER_URL and TILES_SYNC_TRIGGER_TOKEN in serve/.env.",
      ].join("\n"),
    );
    process.exit(1);
  }
}

if (command === "latest-pkg") {
  requireWorkerAuth();

  const endpoint = new URL("/sync/latest-pkg", workerUrl).toString();
  try {
    const payload = await sendRequest(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${triggerToken}`,
      },
    });
    console.log(JSON.stringify(payload, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(String(error instanceof Error ? error.message : error));
    process.exit(1);
  }
}

if (command === "upload-file") {
  const localFilePath = process.argv[3];
  const customKey = process.argv[4];

  if (!localFilePath) {
    console.error(
      [
        "Missing file path.",
        "Usage: npm run upload:file -- <local-file-path> [bucket-key]",
      ].join("\n"),
    );
    process.exit(1);
  }

  const details = await stat(localFilePath);
  const key = customKey ?? `manual/${path.basename(localFilePath)}`;

  requireWorkerAuth();

  try {
    if (details.size <= workerUploadLimitBytes) {
      const endpoint = new URL("/sync/upload-file", workerUrl);
      endpoint.searchParams.set("key", key);

      const stream = createReadStream(localFilePath);
      const payload = await sendRequest(endpoint.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${triggerToken}`,
          "Content-Type": guessContentType(localFilePath),
        },
        body: stream,
        duplex: "half",
      });
      console.log(JSON.stringify(payload, null, 2));
      process.exit(0);
    }

    // Large files are uploaded via multipart requests through the Worker.
    const startUrl = new URL("/sync/upload-file-multipart/start", workerUrl);
    startUrl.searchParams.set("key", key);
    startUrl.searchParams.set("contentType", guessContentType(localFilePath));
    const started = await sendRequest(startUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${triggerToken}`,
      },
    });

    const uploadId = started.uploadId;
    if (!uploadId) {
      throw new Error("Missing uploadId from multipart start response");
    }

    const parts = [];
    const totalParts = Math.ceil(details.size / multipartPartSizeBytes);

    for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
      const start = (partNumber - 1) * multipartPartSizeBytes;
      const endExclusive = Math.min(start + multipartPartSizeBytes, details.size);
      const stream = createReadStream(localFilePath, { start, end: endExclusive - 1 });

      const partUrl = new URL("/sync/upload-file-multipart/part", workerUrl);
      partUrl.searchParams.set("key", key);
      partUrl.searchParams.set("uploadId", uploadId);
      partUrl.searchParams.set("partNumber", String(partNumber));

      const part = await sendRequest(partUrl.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${triggerToken}`,
          "Content-Type": "application/octet-stream",
        },
        body: stream,
        duplex: "half",
      });
      parts.push(part);
      console.log(`Uploaded part ${partNumber}/${totalParts}`);
    }

    const completeUrl = new URL("/sync/upload-file-multipart/complete", workerUrl);
    completeUrl.searchParams.set("key", key);
    completeUrl.searchParams.set("uploadId", uploadId);

    const completed = await sendRequest(completeUrl.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${triggerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parts }),
    });

    console.log(
      JSON.stringify(
        {
          ...completed,
          method: "worker-multipart-upload",
          bytes: details.size,
          partSizeBytes: multipartPartSizeBytes,
          totalParts,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  } catch (error) {
    console.error(String(error instanceof Error ? error.message : error));
    process.exit(1);
  }
}

console.error(
  [
    `Unknown command: ${command}`,
    "Supported commands:",
    "- latest-pkg",
    "- upload-file <local-file-path> [bucket-key]",
  ].join("\n"),
);
process.exit(1);
