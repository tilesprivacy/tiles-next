import { STANDARD_SITE_PUBLICATION_URI } from "@/lib/standard-site"

export function GET() {
  return new Response(`${STANDARD_SITE_PUBLICATION_URI}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
