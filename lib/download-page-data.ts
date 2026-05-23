import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

export const OFFLINE_INSTALLER = {
  downloadUrl: "https://download.tiles.run/tiles-0.4.9-full-signed.pkg",
  fileName: "tiles-0.4.9-full-signed.pkg",
  binarySizeLabel: "10.31 GB",
  sha256: "fc2bbaf0408a3355d3079bf3435a2eba145c63bea48c35d3d14bb4a518a9a748",
} as const

export async function getDownloadPageNetworkArtifact() {
  return getLatestDownloadArtifact()
}
