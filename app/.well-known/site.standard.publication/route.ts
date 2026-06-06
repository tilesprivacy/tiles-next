const STANDARD_SITE_PUBLICATION_URI =
  "at://did:plc:mqmcsjuerbjhu65mpmvkcuw2/site.standard.publication/3mnl4h25how2b"

export function GET() {
  return new Response(STANDARD_SITE_PUBLICATION_URI, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
