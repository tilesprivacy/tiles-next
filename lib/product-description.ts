export const TILES_PRODUCT_DESCRIPTION_CORE =
  "A private, collaborative AI assistant that works for you." as const

export const TILES_PRODUCT_TECHNOLOGY_LINE =
  "Built with local models and AT Protocol." as const

export const TILES_PRODUCT_DESCRIPTION =
  `${TILES_PRODUCT_DESCRIPTION_CORE} ${TILES_PRODUCT_TECHNOLOGY_LINE}` as const

/** Homepage metadata and default Open Graph image tagline. */
export const TILES_HOMEPAGE_DESCRIPTION =
  TILES_PRODUCT_DESCRIPTION

/** Short blurb for blog and research article footers. */
export const TILES_PRODUCT_DESCRIPTION_SHORT =
  TILES_PRODUCT_DESCRIPTION

/** Browser tab and Open Graph titles (hero headline). */
export const TILES_SITE_TITLE =
  `Tiles: ${TILES_PRODUCT_DESCRIPTION_CORE}` as const

/** Primary Download Tiles CTA label on homepage hero and footer. */
export const DOWNLOAD_TILES_CTA_LABEL = "Download Tiles" as const

/** Compact platform line under primary Download Tiles CTAs (plain text for indexes). */
export const DOWNLOAD_PLATFORM_MACOS_LABEL = "Apple Silicon (M1+)" as const

export const DOWNLOAD_PLATFORM_LINUX_LABEL = "Linux (NVIDIA)" as const

/** Linux requirement line under section headings on /download and in download emails. */
export const DOWNLOAD_PLATFORM_LINUX_REQUIREMENT_LABEL = "NVIDIA" as const

export const DOWNLOAD_PLATFORM_SUBTEXT =
  `${DOWNLOAD_PLATFORM_MACOS_LABEL} · ${DOWNLOAD_PLATFORM_LINUX_LABEL}` as const
