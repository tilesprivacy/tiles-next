import {
  getStandardSiteDocumentUri,
  STANDARD_SITE_PUBLICATION_URI,
} from "@/lib/standard-site"

type StandardSiteLinkTagsProps = {
  documentSlug?: string
  includePublication?: boolean
}

export function StandardSiteLinkTags({
  documentSlug,
  includePublication = true,
}: StandardSiteLinkTagsProps) {
  const documentUri = documentSlug ? getStandardSiteDocumentUri(documentSlug) : undefined

  return (
    <>
      {includePublication ? (
        <link rel="site.standard.publication" href={STANDARD_SITE_PUBLICATION_URI} />
      ) : null}
      {documentUri ? <link rel="site.standard.document" href={documentUri} /> : null}
    </>
  )
}
