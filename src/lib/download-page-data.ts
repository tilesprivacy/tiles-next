export const CANARY_RELEASE_URL = "https://github.com/tilesprivacy/tiles/releases/tag/canary"
export const CANARY_RELEASE_DESCRIPTION = "Nightly builds for developers who want the latest Tiles features. Available for macOS and Linux. Canary can be unstable."

/** Direct Canary installer link, shown whenever live release data is unavailable. */
export const CANARY_FALLBACK_DOWNLOAD = {
  name: "tiles-canary-3.pkg",
  browser_download_url:
    "https://github.com/tilesprivacy/tiles/releases/download/canary/tiles-canary-3.pkg",
} as const

export const OFFLINE_MODEL_NAME = "gpt-oss-20b-MXFP4-Q4"

export const OFFLINE_INSTALLER = {
  version: "0.5.1",
  releaseTitle: "Alpha 24",
  downloadUrl: "https://download.tiles.run/tiles-0.5.1-full-signed.pkg",
  fileName: "tiles-0.5.1-full-signed.pkg",
  binarySizeBytes: 7_539_555_979,
  binarySizeLabel: "7.02 GB",
  sha256: "be1082adf335a45349f326e63d51dee79a4773d796e53e18fa62fb86593d0d2a",
} as const

export const LINUX_INSTALL_SCRIPT_URL = "https://tiles.run/install.sh" as const

export const LINUX_INSTALL_COMMAND =
  `curl -LsSf ${LINUX_INSTALL_SCRIPT_URL} | sh` as const

/** Arguments to a piped script go after `sh -s --`, not to `sh` itself. */
export const LINUX_CANARY_INSTALL_COMMAND =
  `curl -LsSf ${LINUX_INSTALL_SCRIPT_URL} | sh -s -- --canary` as const
