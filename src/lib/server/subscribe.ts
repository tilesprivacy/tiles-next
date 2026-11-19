// Step one of the newsletter's double opt-in: after the abuse checks, email
// the address a confirmation link. Nothing is stored until it's confirmed
// (see newsletter-confirm.ts), so a typo or a stranger's address never ends
// up on the list.
import { Resend } from "resend"
import type { createEmailGuard } from "./email-guard"
import { buildConfirmationEmail } from "./email/messages"
import { CONFIRM_LINK_TTL_DAYS, createConfirmToken } from "./newsletter-token"
import { sendEmail, SENDER_EMAIL } from "./resend"

export interface SubscribeDeps {
  guard: ReturnType<typeof createEmailGuard>
  resendApiKey: string | undefined
  /** Encrypts the address into the confirmation link. */
  tokenKey: string | undefined
  /** Origin the confirmation link points at: the canonical site in production. */
  siteOrigin: string
  /** Adds Resend error details to responses; never on in production. */
  debug: boolean
}

const json = (body: unknown, status = 200) => Response.json(body, { status })

// Same shape as a real success, without senderEmail, so a dropped request
// (honeypot hit, address already emailed recently) is indistinguishable.
const silentSuccess = () => json({ success: true, message: "Successfully subscribed!" })

const genericFailure = () =>
  json({ error: "An error occurred while processing your subscription. Please try again." }, 500)

function friendlySendError(message: string | undefined): string {
  const text = message?.toLowerCase() ?? ""
  if (text.includes("domain") || text.includes("not verified")) {
    return "Email domain is not verified. Please contact support."
  }
  if (text.includes("invalid") || text.includes("malformed")) {
    return "Invalid email address or configuration."
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Too many requests. Please try again later."
  }
  if (text.includes("unauthorized") || text.includes("api key")) {
    return "Email service configuration error. Please contact support."
  }
  return "Failed to send confirmation email. Please try again later."
}

export async function handleSubscribe(request: Request, clientIp: string, deps: SubscribeDeps): Promise<Response> {
  if (!deps.resendApiKey || !deps.tokenKey) {
    console.error("[Subscribe] Resend API key or newsletter token key is not configured")
    return json({ error: "Email service is not configured. Please contact support." }, 503)
  }

  const guarded = await deps.guard(request, clientIp, silentSuccess)
  if (!guarded.ok) return guarded.response

  try {
    const token = await createConfirmToken(guarded.email, deps.tokenKey)
    const confirmUrl = `${deps.siteOrigin}/newsletter/confirm?token=${token}`
    const result = await sendEmail(
      new Resend(deps.resendApiKey),
      guarded.email,
      buildConfirmationEmail(confirmUrl, CONFIRM_LINK_TTL_DAYS),
    )

    if (result.error) {
      await guarded.release()
      console.error("[Subscribe] Resend API error:", JSON.stringify(result.error))
      return json(
        {
          error: friendlySendError(result.error.message),
          ...(deps.debug && { details: result.error }),
        },
        500,
      )
    }

    return json({
      success: true,
      message: "Successfully subscribed!",
      id: result.data?.id,
      // The form uses it for the "Open in Gmail" button, to find the confirmation email.
      senderEmail: SENDER_EMAIL,
    })
  } catch (error) {
    await guarded.release()
    console.error("[Subscribe] Unexpected error:", error)
    return genericFailure()
  }
}
