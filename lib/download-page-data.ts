import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

export const OFFLINE_MODEL_URL = "https://huggingface.co/mlx-community/gpt-oss-20b-MXFP4-Q4" as const

export const LINUX_MODEL_NAME = "gpt-oss-20b-GGUF-Q4_K_M"

export const LINUX_MODEL_URL = "https://huggingface.co/unsloth/gpt-oss-20b-GGUF" as const

export const OFFLINE_INSTALLER = {
  version: "0.4.17",
  downloadUrl: "https://download.tiles.run/tiles-0.4.17-full-signed.pkg",
  fileName: "tiles-0.4.17-full-signed.pkg",
  binarySizeBytes: 7_536_225_216,
  binarySizeLabel: "7.02 GB",
  sha256: "bdf9dc950ed40695ef5434776d7a757cff902d9fc5c6961ee301eadf004ce7e9",
} as const

/** Keep in sync with `VERSION` in `public/install.sh`. */
export const LINUX_INSTALL_VERSION = "0.4.16" as const

export const LINUX_INSTALL_SCRIPT_URL = "https://www.tiles.run/install.sh" as const

export const LINUX_INSTALL_COMMAND =
  `curl -LsSf ${LINUX_INSTALL_SCRIPT_URL} | sh` as const

export async function getDownloadPageNetworkArtifact() {
  return getLatestDownloadArtifact()
}
