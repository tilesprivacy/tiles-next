// Shared bits for the two newsletter steps (signup and confirmation).
import { Resend } from "resend"
import { toPlainText } from "./email/plain-text"

const SENDER_NAME = "Tiles Privacy"
// Resend's onboarding address, for local dev without a verified domain.
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev"
const RESEND_TIMEOUT_MS = 10_000

export type ResendError = { message?: string; statusCode?: number | null; name?: string } | null

/** RESEND_FROM_EMAIL may be "Name <address>" or a bare address. */
export function senderAddress(raw: string | undefined): string {
  const value = raw?.trim()
  if (!value) return DEFAULT_FROM_EMAIL
  return value.match(/<([^>]+)>/)?.[1].trim() ?? value
}

export const withTimeout = () => ({ signal: AbortSignal.timeout(RESEND_TIMEOUT_MS) })

export function isAlreadyExists(error: ResendError): boolean {
  return error?.statusCode === 409 || /already exist/i.test(error?.message ?? "")
}

export function sendEmail(
  resend: Resend,
  fromEmail: string | undefined,
  to: string,
  message: { subject: string; html: string },
) {
  return resend.emails.send(
    {
      from: `${SENDER_NAME} <${senderAddress(fromEmail)}>`,
      to,
      subject: message.subject,
      html: message.html,
      text: toPlainText(message.html),
    },
    withTimeout(),
  )
}
