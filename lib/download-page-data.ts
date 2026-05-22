import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

export const OFFLINE_INSTALLER = {
  downloadUrl: "https://download.tiles.run/tiles-0.4.8-full-signed.pkg",
  fileName: "tiles-0.4.8-full-signed.pkg",
  binarySizeLabel: "10.31 GB",
  sha256: "63acf5ca1673ad4631bea42454a5ecc45d2efd6cc3863a0e8b0e8a0f90549d49",
} as const

export async function getDownloadPageNetworkArtifact() {
  return getLatestDownloadArtifact()
}
