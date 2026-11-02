import { loadShare, sharePageData } from "#lib/server/chat/share"

export async function load({ params, url, setHeaders }) {
  const share = await loadShare(params.token)
  setHeaders({ "Cache-Control": "no-cache" })
  return sharePageData(share, url, params.token)
}
