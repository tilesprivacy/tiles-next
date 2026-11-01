import sequoiaConfig from "../sequoia.json"

export function standardSitePublicationWellKnownResponse() {
  return new Response(`${sequoiaConfig.publicationUri}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
