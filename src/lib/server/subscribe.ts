import { Resend } from "resend"
import type { createEmailGuard } from "./email-guard"
import { buildSubscriptionEmail } from "./email/messages"
import { toPlainText } from "./email/plain-text"

const SENDER_NAME = "Tiles Privacy"
// Resend's onboarding address, for local dev without a verified domain.
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev"

/** RESEND_FROM_EMAIL may be "Name <address>" or a bare address. */
export function senderAddress(raw: string | undefined): string {
  const value = raw?.trim()
  if (!value) return DEFAULT_FROM_EMAIL
  return value.match(/<([^>]+)>/)?.[1].trim() ?? value
}

export interface SubscribeDeps {
  guard: ReturnType<typeof createEmailGuard>
  resendApiKey: string | undefined
  resendFromEmail: string | undefined
  resendAudienceId: string | undefined
  production: boolean
  /** Adds Resend error details to responses; never on in production. */
  debug: boolean
}

const json = (body: unknown, status = 200) => Response.json(body, { status })

// Same shape as a real success, without senderEmail, so a dropped request
// (honeypot hit, address already emailed recently) is indistinguishable.
const silentSuccess = () => json({ success: true, message: "Successfully subscribed!" })

const RESEND_TIMEOUT_MS = 10_000
const withTimeout = () => ({ signal: AbortSignal.timeout(RESEND_TIMEOUT_MS) })

const genericFailure = () =>
  json(
    { error: "An error occurred while processing your subscription. Please try again." },
    500,
  )

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

type ResendError = { message?: string; statusCode?: number | null; name?: string } | null

function isAlreadyExists(error: ResendError): boolean {
  return error?.statusCode === 409 || /already exist/i.test(error?.message ?? "")
}

// An existing contact is left alone. Flipping it back to subscribed would let
// anyone re-subscribe a person who opted out just by typing their address.
async function storeContact(resend: Resend, audienceId: string, email: string) {
  const created = await resend.contacts.create(
    { audienceId, email, unsubscribed: false },
    withTimeout(),
  )
  if (!created.error || isAlreadyExists(created.error)) return null
  return created.error
}

export async function handleSubscribe(
  request: Request,
  clientIp: string,
  deps: SubscribeDeps,
): Promise<Response> {
  if (!deps.resendApiKey || (deps.production && !deps.resendAudienceId)) {
    console.error("[Subscribe] Resend API key or audience is not configured")
    return json({ error: "Email service is not configured. Please contact support." }, 503)
  }

  const guarded = await deps.guard(request, clientIp, silentSuccess)
  if (!guarded.ok) return guarded.response

  try {
    const resend = new Resend(deps.resendApiKey)
    const fromAddress = senderAddress(deps.resendFromEmail)

    if (deps.resendAudienceId) {
      const error = await storeContact(resend, deps.resendAudienceId, guarded.email)
      if (error) {
        await guarded.release()
        console.error("[Subscribe] Could not store contact:", error)
        return genericFailure()
      }
    } else {
      console.warn("[Subscribe] RESEND_AUDIENCE_ID is not set; signup not stored (dev only)")
    }

    const message = buildSubscriptionEmail()
    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${fromAddress}>`,
      to: guarded.email,
      subject: message.subject,
      html: message.html,
      text: toPlainText(message.html),
    }, withTimeout())

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
      // The form uses it for the "Open in Gmail" sniper link.
      senderEmail: fromAddress,
    })
  } catch (error) {
    await guarded.release()
    console.error("[Subscribe] Unexpected error:", error)
    return genericFailure()
  }
}
