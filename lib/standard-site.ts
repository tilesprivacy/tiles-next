import fs from "node:fs"
import path from "node:path"

import sequoiaConfig from "../sequoia.json"

export const STANDARD_SITE_PUBLICATION_URI = sequoiaConfig.publicationUri
export const STANDARD_SITE_PUBLICATION_URL = sequoiaConfig.siteUrl
export const STANDARD_SITE_PUBLICATION_WELL_KNOWN_PATH = "/.well-known/site.standard.publication"

const SITE_ORIGIN = new URL(sequoiaConfig.siteUrl).origin
const DEFAULT_BLOG_OG_IMAGE_PATH = "/og-image.jpg"

const STANDARD_SITE_CONTENT_DIR = path.join(process.cwd(), "standard-site/blog")

function parseFrontmatterValue(filePath: string, key: string): string | undefined {
  const content = fs.readFileSync(filePath, "utf-8")
  const match = content.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "m"))
  return match?.[1]
}

function parseAtUriFromMarkdown(filePath: string): string | undefined {
  return parseFrontmatterValue(filePath, "atUri")
}

function toAbsoluteSiteUrl(assetPath: string): string {
  return assetPath.startsWith("http") ? assetPath : `${SITE_ORIGIN}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`
}

export function toBlogSocialImageUrl(assetPath?: string): string {
  const normalized = assetPath?.trim() || DEFAULT_BLOG_OG_IMAGE_PATH
  return toAbsoluteSiteUrl(normalized)
}

function loadDocumentUrisBySlug(): Record<string, string> {
  if (!fs.existsSync(STANDARD_SITE_CONTENT_DIR)) {
    return {}
  }

  const uris: Record<string, string> = {}

  for (const fileName of fs.readdirSync(STANDARD_SITE_CONTENT_DIR)) {
    if (!fileName.endsWith(".md")) {
      continue
    }

    const slug = fileName.replace(/\.md$/, "")
    const atUri = parseAtUriFromMarkdown(path.join(STANDARD_SITE_CONTENT_DIR, fileName))

    if (atUri) {
      uris[slug] = atUri
    }
  }

  return uris
}

const documentUrisBySlug = loadDocumentUrisBySlug()

function loadOgImagePathsBySlug(): Record<string, string> {
  if (!fs.existsSync(STANDARD_SITE_CONTENT_DIR)) {
    return {}
  }

  const paths: Record<string, string> = {}

  for (const fileName of fs.readdirSync(STANDARD_SITE_CONTENT_DIR)) {
    if (!fileName.endsWith(".md")) {
      continue
    }

    const slug = fileName.replace(/\.md$/, "")
    const ogImage = parseFrontmatterValue(path.join(STANDARD_SITE_CONTENT_DIR, fileName), "ogImage")

    if (ogImage) {
      paths[slug] = ogImage
    }
  }

  return paths
}

const ogImagePathsBySlug = loadOgImagePathsBySlug()

export function getStandardSiteDocumentUri(slug: string): string | undefined {
  return documentUrisBySlug[slug]
}

export function getBlogPostSocialImageUrl(slug: string, fallbackPath = DEFAULT_BLOG_OG_IMAGE_PATH): string {
  return toBlogSocialImageUrl(ogImagePathsBySlug[slug] ?? fallbackPath)
}

export const BLOG_LISTING_SOCIAL_IMAGE_URL = toBlogSocialImageUrl(DEFAULT_BLOG_OG_IMAGE_PATH)
