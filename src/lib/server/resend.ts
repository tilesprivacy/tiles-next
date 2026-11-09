// Shared bits for the two newsletter steps (signup and confirmation).
import { Resend } from "resend"
import { toPlainText } from "./email/plain-text"

const SENDER_NAME = "Tiles Privacy"
export const SENDER_EMAIL = "hello@tiles.run"
const RESEND_TIMEOUT_MS = 10_000

export type ResendError = { message?: string; statusCode?: number | null; name?: string } | null

export const withTimeout = () => ({ signal: AbortSignal.timeout(RESEND_TIMEOUT_MS) })

export function isAlreadyExists(error: ResendError): boolean {
  return error?.statusCode === 409 || /already exist/i.test(error?.message ?? "")
}

export function sendEmail(
  resend: Resend,
  to: string,
  message: { subject: string; html: string },
) {
  return resend.emails.send(
    {
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to,
      subject: message.subject,
      html: message.html,
      text: toPlainText(message.html),
    },
    withTimeout(),
  )
}
