export const TILES_PRODUCT_DESCRIPTION =
  "Tiles is a local-first AI assistant that runs models on your device, syncs privately across devices, and lets you share chats through ATProto." as const

/** Homepage metadata and default Open Graph image tagline. */
export const TILES_HOMEPAGE_DESCRIPTION =
  "Local-first private AI assistant for everyday use" as const

/** Short blurb for blog and research article footers. */
export const TILES_PRODUCT_DESCRIPTION_SHORT =
  "Tiles is a local-first private AI assistant for everyday use." as const

/** Browser tab and Open Graph titles (hero headline). */
export const TILES_SITE_TITLE = "Tiles: Own your AI" as const

export const AT_PROTO_LABEL = "ATProto" as const

export function productDescriptionBeforeAtProtoLink() {
  const index = TILES_PRODUCT_DESCRIPTION.indexOf(AT_PROTO_LABEL)
  return TILES_PRODUCT_DESCRIPTION.slice(0, index)
}

export function productDescriptionAfterAtProtoLink() {
  const index = TILES_PRODUCT_DESCRIPTION.indexOf(AT_PROTO_LABEL)
  return TILES_PRODUCT_DESCRIPTION.slice(index + AT_PROTO_LABEL.length)
}
