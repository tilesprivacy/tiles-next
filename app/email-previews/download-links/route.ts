import { renderDownloadLinkEmailHtml } from "@/lib/download-link-email";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const html = renderDownloadLinkEmailHtml({
    CURRENT_BUILD_VERSION: "0.8.0",
    DOWNLOAD_URL: "https://download.tiles.run/tiles-0.8.0.pkg",
    DOWNLOAD_FILE_NAME: "tiles-0.8.0.pkg",
    DOWNLOAD_VERSION: "0.8.0",
    DOWNLOAD_SIZE: "184 MB",
    DOWNLOAD_SHA_SHORT: "2ad4f10c7e12...8a11be934f6d",
    DOWNLOAD_CHECKSUM_URL:
      "https://download.tiles.run/checksums/tiles-0.8.0.pkg.sha256",
    NETWORK_VERSION: "0.8.0",
    NETWORK_SIZE: "184 MB",
    NETWORK_SHA_SHORT: "2ad4f10c7e12...8a11be934f6d",
    NETWORK_CHECKSUM_URL:
      "https://download.tiles.run/checksums/tiles-0.8.0.pkg.sha256",
    OFFLINE_DOWNLOAD_URL: "https://download.tiles.run/tiles-0.8.0-offline.pkg",
    OFFLINE_FILE_NAME: "tiles-0.8.0-offline.pkg",
    OFFLINE_DOWNLOAD_VERSION: "0.8.0",
    OFFLINE_DOWNLOAD_SIZE: "5.4 GB",
    OFFLINE_DOWNLOAD_SHA_SHORT: "f78a34d091ce...1256ab04fd21",
    OFFLINE_DOWNLOAD_CHECKSUM_URL:
      "https://download.tiles.run/checksums/tiles-0.8.0-offline.pkg.sha256",
    OFFLINE_VERSION: "0.8.0",
    OFFLINE_SIZE: "5.4 GB",
    OFFLINE_SHA_SHORT: "f78a34d091ce...1256ab04fd21",
    OFFLINE_CHECKSUM_URL:
      "https://download.tiles.run/checksums/tiles-0.8.0-offline.pkg.sha256",
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
