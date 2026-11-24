import { formatBinarySize } from "#lib/format-binary-size"
import offlineInstallerChecksum from "../../static/tiles-0.5.2-full-signed.pkg.sha256?raw"

export const CANARY_RELEASE_URL = "https://github.com/tilesprivacy/tiles/releases/tag/canary"
export const CANARY_RELEASE_DESCRIPTION = "Nightly builds for developers who want the latest Tiles features. Available for macOS and Linux. Canary can be unstable."

/** Direct Canary installer link, shown whenever live release data is unavailable. */
export const CANARY_FALLBACK_DOWNLOAD = {
  name: "tiles-canary-3.pkg",
  browser_download_url:
    "https://github.com/tilesprivacy/tiles/releases/download/canary/tiles-canary-3.pkg",
} as const

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

const OFFLINE_INSTALLER_SIZE_BYTES = 7_546_829_849
const [offlineInstallerSha256, offlineInstallerFileName] = offlineInstallerChecksum.trim().split(/\s+/)

export const OFFLINE_INSTALLER = {
  version: "0.5.2",
  releaseTitle: "Alpha 25",
  downloadUrl: `https://download.tiles.run/${offlineInstallerFileName}`,
  fileName: offlineInstallerFileName,
  checksumPath: `/${offlineInstallerFileName}.sha256`,
  binarySizeBytes: OFFLINE_INSTALLER_SIZE_BYTES,
  binarySizeLabel: formatBinarySize(OFFLINE_INSTALLER_SIZE_BYTES),
  sha256: offlineInstallerSha256,
} as const

export const LINUX_INSTALL_SCRIPT_URL = "https://tiles.run/install.sh" as const

export const LINUX_INSTALL_COMMAND =
  `curl -LsSf ${LINUX_INSTALL_SCRIPT_URL} | sh` as const

/** Arguments to a piped script go after `sh -s --`, not to `sh` itself. */
export const LINUX_CANARY_INSTALL_COMMAND =
  `curl -LsSf ${LINUX_INSTALL_SCRIPT_URL} | sh -s -- --canary` as const
