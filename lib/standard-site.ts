import fs from "node:fs"
import path from "node:path"

import sequoiaConfig from "../sequoia.json"

export const STANDARD_SITE_PUBLICATION_URI = sequoiaConfig.publicationUri

const STANDARD_SITE_CONTENT_DIR = path.join(process.cwd(), "standard-site/blog")

function parseAtUriFromMarkdown(filePath: string): string | undefined {
  const content = fs.readFileSync(filePath, "utf-8")
  const match = content.match(/^atUri:\s*"(at:\/\/[^"]+)"/m)
  return match?.[1]
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

export function getStandardSiteDocumentUri(slug: string): string | undefined {
  return documentUrisBySlug[slug]
}
