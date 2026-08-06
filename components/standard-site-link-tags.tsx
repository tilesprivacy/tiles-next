import { getPersonById } from "@/lib/people"
import {
  getStandardSiteDocumentUri,
  STANDARD_SITE_DID,
  STANDARD_SITE_PUBLICATION_URI,
} from "@/lib/standard-site"

type StandardSiteLinkTagsProps = {
  documentSlug?: string
  includePublication?: boolean
  /** Person ID from `lib/people.ts`; emits an `at:author` meta tag when they have a DID. */
  authorId?: string
}

/**
 * Tags connecting a page to its AT Protocol records: Standard's
 * `site.standard.*` link tags plus the community `at:*` meta tags
 * (https://tangled.org/chrisshank.com/at-tags/), which let atproto apps
 * resolve blog URLs into rich record embeds.
 */
export function StandardSiteLinkTags({
  documentSlug,
  includePublication = true,
  authorId,
}: StandardSiteLinkTagsProps) {
  const documentUri = documentSlug ? getStandardSiteDocumentUri(documentSlug) : undefined
  const authorDid = authorId ? getPersonById(authorId)?.did : undefined

  return (
    <>
      {includePublication ? (
        <>
          <link rel="site.standard.publication" href={STANDARD_SITE_PUBLICATION_URI} />
          <meta name="at:alternate" content={STANDARD_SITE_PUBLICATION_URI} />
          <meta name="at:me" content={`at://${STANDARD_SITE_DID}`} />
        </>
      ) : null}
      {documentUri ? (
        <>
          <link rel="site.standard.document" href={documentUri} />
          <meta name="at:canonical" content={documentUri} />
        </>
      ) : null}
      {authorDid ? <meta name="at:author" content={`at://${authorDid}`} /> : null}
    </>
  )
}
