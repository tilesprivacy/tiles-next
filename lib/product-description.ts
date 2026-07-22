export const TILES_PRODUCT_DESCRIPTION =
  "Tiles is a local-first AI assistant that runs models on your device, syncs privately across devices, and lets you share chats through AT Protocol." as const

/** Homepage metadata and default Open Graph image tagline. */
export const TILES_HOMEPAGE_DESCRIPTION =
  "A private AI assistant designed for the Atmosphere." as const

/** Short blurb for blog and research article footers. */
export const TILES_PRODUCT_DESCRIPTION_SHORT =
  "Tiles is a local-first private AI assistant for everyday use." as const

/** Browser tab and Open Graph titles (hero headline). */
export const TILES_SITE_TITLE = "Tiles: Local-first AI for the Atmosphere" as const

export const AT_PROTO_LABEL = "AT Protocol" as const

/** Primary Download Tiles CTA label on homepage hero and footer. */
export const DOWNLOAD_TILES_CTA_LABEL = "Download Tiles" as const

/** Compact platform line under primary Download Tiles CTAs (plain text for indexes). */
export const DOWNLOAD_PLATFORM_MACOS_LABEL = "Apple Silicon (M1+)" as const

export const DOWNLOAD_PLATFORM_LINUX_LABEL = "Linux (NVIDIA)" as const

/** Linux requirement line under section headings on /download and in download emails. */
export const DOWNLOAD_PLATFORM_LINUX_REQUIREMENT_LABEL = "NVIDIA" as const

export const DOWNLOAD_PLATFORM_SUBTEXT =
  `${DOWNLOAD_PLATFORM_MACOS_LABEL} · ${DOWNLOAD_PLATFORM_LINUX_LABEL}` as const

export function productDescriptionBeforeAtProtoLink() {
  const index = TILES_PRODUCT_DESCRIPTION.indexOf(AT_PROTO_LABEL)
  return TILES_PRODUCT_DESCRIPTION.slice(0, index)
}

export function productDescriptionAfterAtProtoLink() {
  const index = TILES_PRODUCT_DESCRIPTION.indexOf(AT_PROTO_LABEL)
  return TILES_PRODUCT_DESCRIPTION.slice(index + AT_PROTO_LABEL.length)
}
