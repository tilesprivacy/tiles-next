// Step two of the double opt-in: the person clicked the link in their own
// inbox, so this is real consent. Add them to the newsletter segment
// (subscribing them again if they had opted out) and welcome new subscribers.
import { Resend } from "resend"
import { buildSubscriptionEmail } from "./email/messages"
import { isAlreadyExists, sendEmail, withTimeout } from "./resend"

export interface ConfirmDeps {
  resendApiKey: string
  resendFromEmail: string | undefined
  segmentId: string
}

export type ConfirmResult = "subscribed" | "error"

export async function confirmSubscription(email: string, deps: ConfirmDeps): Promise<ConfirmResult> {
  const resend = new Resend(deps.resendApiKey)
  try {
    const created = await resend.contacts.create(
      { email, unsubscribed: false, segments: [{ id: deps.segmentId }] },
      withTimeout(),
    )

    if (!created.error) {
      // A failed welcome email doesn't undo the subscription.
      const welcome = await sendEmail(resend, deps.resendFromEmail, email, buildSubscriptionEmail())
      if (welcome.error) console.error("[Newsletter] Welcome email failed:", JSON.stringify(welcome.error))
      return "subscribed"
    }
    if (!isAlreadyExists(created.error)) {
      console.error("[Newsletter] Could not create contact:", JSON.stringify(created.error))
      return "error"
    }

    // Already a contact: make sure they're subscribed and in the segment.
    const updated = await resend.contacts.update({ email, unsubscribed: false }, withTimeout())
    const added = await resend.contacts.segments.add({ email, segmentId: deps.segmentId }, withTimeout())
    const error = updated.error ?? (added.error && !isAlreadyExists(added.error) ? added.error : null)
    if (error) {
      console.error("[Newsletter] Could not update contact:", JSON.stringify(error))
      return "error"
    }
    return "subscribed"
  } catch (error) {
    console.error("[Newsletter] Unexpected error:", error)
    return "error"
  }
}
