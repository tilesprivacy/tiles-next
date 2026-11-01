// Where the blog lives on ATproto. Shared by the site and by
// scripts/publish-blog.ts (plain Node), so keep this file import-free.

/** The Tiles account (handle tiles.run). */
export const TILES_DID = "did:plc:mqmcsjuerbjhu65mpmvkcuw2"

/** The PDS hosting that account. Change this if the account moves. */
export const TILES_PDS_URL = "https://eurosky.social"

export const STANDARD_SITE_PUBLICATION_URI = `at://${TILES_DID}/site.standard.publication/3mnmiw6ypye2s`

export const BLOG_DOCUMENT_COLLECTION = "site.standard.document"

/**
 * Our `content` type inside each document: the post's full markdown file,
 * which production builds render. `textContent` stays plain text for other
 * standard.site readers.
 */
export const BLOG_MARKDOWN_TYPE = "run.tiles.blog.markdown"

export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Upper bound for one post's markdown, so a bad record can't stall a build. */
export const MAX_BLOG_SOURCE_BYTES = 512 * 1024
