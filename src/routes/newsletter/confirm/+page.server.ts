import { fail } from "@sveltejs/kit"
import { dev } from "$app/env"
import { NEWSLETTER_TOKEN_KEY, RESEND_API_KEY, RESEND_SEGMENT_ID } from "$app/env/private"
import { confirmSubscription } from "#lib/server/newsletter-confirm"
import { devTokenKey } from "#lib/server/newsletter-dev"
import { readConfirmToken } from "#lib/server/newsletter-token"
import type { Actions, PageServerLoad } from "./$types"

export const prerender = false

const tokenKey = () => NEWSLETTER_TOKEN_KEY ?? (dev ? devTokenKey() : undefined)

// Opening the link doesn't confirm by itself: the page then POSTs (on its own
// in a browser, or via its button without JavaScript), so mail scanners that
// only fetch links can't subscribe anyone.
export const load: PageServerLoad = async ({ url, setHeaders }) => {
  setHeaders({ "Cache-Control": "no-store" })
  const token = url.searchParams.get("token") ?? ""
  const key = tokenKey()
  const valid = Boolean(key && (await readConfirmToken(token, key)))
  return { token: valid ? token : null }
}

export const actions: Actions = {
  default: async ({ request }) => {
    if (Number(request.headers.get("content-length") ?? 0) > 4_096) return fail(413, { state: "expired" as const })

    const key = tokenKey()
    if (!key || !RESEND_API_KEY || !RESEND_SEGMENT_ID) {
      console.error("[Newsletter] Confirmation is not configured")
      return fail(503, { state: "error" as const })
    }

    const token = String((await request.formData()).get("token") ?? "")
    const email = await readConfirmToken(token, key)
    if (!email) return fail(400, { state: "expired" as const })

    const result = await confirmSubscription(email, {
      resendApiKey: RESEND_API_KEY,
      segmentId: RESEND_SEGMENT_ID,
    })
    return result === "subscribed" ? { state: "subscribed" as const } : fail(502, { state: "error" as const })
  },
}
