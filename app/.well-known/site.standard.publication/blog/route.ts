import { standardSitePublicationWellKnownResponse } from "@/lib/standard-site-publication-well-known"

export function GET() {
  return standardSitePublicationWellKnownResponse()
}
