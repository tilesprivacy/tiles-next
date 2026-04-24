import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

export const OFFLINE_INSTALLER = {
  downloadUrl: "https://download.tiles.run/tiles-0.4.7-full-signed.pkg",
  fileName: "tiles-0.4.7-full-signed.pkg",
  binarySizeLabel: "10.31 GB",
  sha256: "e2fa2d5339d356c023fb1c13fba8a6cf099fedad07f684b7b090d59292c91032",
} as const

export async function getDownloadPageNetworkArtifact() {
  return getLatestDownloadArtifact()
}
