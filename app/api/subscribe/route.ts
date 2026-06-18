import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

// Initialize Resend client with API key from environment
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(apiKey)
}

const SENDER_NAME = "Tiles Privacy"
const LINUX_WAITLIST_TEMPLATE_ID = "c7599926-3195-4ca5-840b-b3248a6b9524"

// Default email when RESEND_FROM_EMAIL is not set (Resend onboarding address)
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev"

// Get the sender email address (no display name) from environment variable.
// RESEND_FROM_EMAIL can be "Display Name <email@domain.com>" or "email@domain.com".
const getFromEmailAddress = (): string => {
  const raw = process.env.RESEND_FROM_EMAIL
  if (!raw?.trim()) return DEFAULT_FROM_EMAIL
  const match = raw.trim().match(/<([^>]+)>/)
  if (match) return match[1].trim()
  return raw.trim()
}

// Build the Resend "from" value: always "Tiles Privacy <email@domain.com>"
// per https://resend.com/docs/api-reference/emails/send-email
const getFromEmail = (): string => {
  return `${SENDER_NAME} <${getFromEmailAddress()}>`
}

// Extract email address from fromEmail string
// Handles formats like "Display Name <email@domain.com>" or "email@domain.com"
const extractEmailFromFromEmail = (fromEmail: string): string => {
  const match = fromEmail.match(/<([^>]+)>/)
  if (match) {
    return match[1]
  }
  return fromEmail.trim()
}

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

type LinuxWaitlistContactPayload = {
  email: string
  firstName: string
  lastName: string
  linuxDistributions: string[]
}

const LINUX_WAITLIST_CONTACT_PROPERTIES = [
  { key: "tiles_queue", fallbackValue: "linux" },
  { key: "tiles_linux_waitlist", fallbackValue: "true" },
  { key: "tiles_waitlist_source", fallbackValue: "form" },
  { key: "tiles_linux_distributions", fallbackValue: "" },
  { key: "tiles_form_first_name", fallbackValue: "" },
  { key: "tiles_form_last_name", fallbackValue: "" },
] as const

const getLinuxWaitlistContactData = (payload: LinuxWaitlistContactPayload) => ({
  email: payload.email,
  firstName: payload.firstName || undefined,
  lastName: payload.lastName || undefined,
  unsubscribed: false,
  properties: {
    tiles_queue: "linux",
    tiles_linux_waitlist: "true",
    tiles_waitlist_source: "form",
    tiles_linux_distributions: payload.linuxDistributions.join(", "),
    tiles_form_first_name: payload.firstName || "",
    tiles_form_last_name: payload.lastName || "",
  },
})

const isMissingPropertiesErrorMessage = (message: string) => {
  const normalized = message.toLowerCase()
  return (
    normalized.includes("properties do not exist") ||
    normalized.includes("one or more properties do not exist")
  )
}

const ensureLinuxWaitlistContactProperties = async (resend: Resend) => {
  for (const property of LINUX_WAITLIST_CONTACT_PROPERTIES) {
    const result = await resend.contactProperties.create({
      key: property.key,
      type: "string",
      fallbackValue: property.fallbackValue,
    })

    if (!result.error) continue

    const message = result.error.message?.toLowerCase() || ""
    const isAlreadyExists =
      message.includes("already exists") ||
      message.includes("already a contact property with this key") ||
      message.includes("already been taken") ||
      message.includes("duplicate") ||
      message.includes("409")

    if (!isAlreadyExists) {
      throw new Error(result.error.message || `Could not create contact property: ${property.key}`)
    }
  }
}

const upsertLinuxWaitlistContact = async (
  resend: Resend,
  payload: LinuxWaitlistContactPayload,
) => {
  const contactData = getLinuxWaitlistContactData(payload)

  const tryCreateOrUpdate = async () => {
    const createResult = await resend.contacts.create(contactData)
    if (!createResult.error) return

    const createErrorMessage = createResult.error.message?.toLowerCase() || ""
    const isAlreadyExistsError =
      createErrorMessage.includes("already") ||
      createErrorMessage.includes("exists") ||
      createErrorMessage.includes("duplicate") ||
      createErrorMessage.includes("409")

    if (!isAlreadyExistsError) {
      throw new Error(createResult.error.message || "Could not create waitlist contact.")
    }

    const updateResult = await resend.contacts.update({
      email: payload.email,
      firstName: payload.firstName || undefined,
      lastName: payload.lastName || undefined,
      unsubscribed: false,
      properties: contactData.properties,
    })

    if (updateResult.error) {
      throw new Error(updateResult.error.message || "Could not update waitlist contact.")
    }
  }

  try {
    await tryCreateOrUpdate()
    return
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (!isMissingPropertiesErrorMessage(message)) {
      throw error
    }
  }

  // Create missing contact properties once, then retry contact upsert.
  await ensureLinuxWaitlistContactProperties(resend)
  await tryCreateOrUpdate()
}

// GET handler for development debugging
export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 }
    )
  }

  const hasApiKey = !!process.env.RESEND_API_KEY
  const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 7) || "not set"
  const fromEmail = getFromEmail()

  return NextResponse.json({
    configured: hasApiKey,
    apiKeyPrefix: hasApiKey ? `${apiKeyPrefix}...` : "not set",
    fromEmail,
    environment: process.env.NODE_ENV,
  })
}

// POST handler for newsletter subscription
export async function POST(request: NextRequest) {
  try {
    // Validate Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Subscribe] RESEND_API_KEY is not configured")
      return NextResponse.json(
        {
          error: "Email service is not configured. Please contact support.",
        },
        { status: 503 }
      )
    }

    // Parse and validate request body
    let body: {
      firstName?: string
      lastName?: string
      email?: string
      linuxDistributions?: string[]
      source?: string
    }
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, linuxDistributions, source } = body

    // Validate email is provided
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const trimmedEmail = email.trim()
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      )
    }

    // Initialize Resend client
    const resend = getResendClient()
    const fromEmail = getFromEmail()
    const isLinuxWaitlist = source === "linux-notify-form"
    const safeFirstName =
      typeof firstName === "string" && firstName.trim().length > 0
        ? firstName.trim()
        : "there"

    if (isLinuxWaitlist) {
      if (!Array.isArray(linuxDistributions) || linuxDistributions.length === 0) {
        return NextResponse.json(
          { error: "At least one Linux distribution is required." },
          { status: 400 }
        )
      }

      const linuxPayload = {
        email: trimmedEmail,
        firstName: typeof firstName === "string" ? firstName.trim() : "",
        lastName: typeof lastName === "string" ? lastName.trim() : "",
        linuxDistributions: linuxDistributions
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      }

      await upsertLinuxWaitlistContact(resend, linuxPayload)
    }

    // Send welcome email
    const result = await resend.emails.send({
      from: fromEmail,
      to: trimmedEmail,
      subject: isLinuxWaitlist ? "Tiles for Linux waitlist" : "Welcome to Tiles Privacy",
      html: isLinuxWaitlist
        ? undefined
        : `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="color-scheme" content="dark light">
            <meta name="supported-color-schemes" content="dark light">
            <title>Welcome to Tiles</title>
            <style type="text/css">
              body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              table { border-collapse: collapse !important; }
              img { -ms-interpolation-mode: bicubic; border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background: #000000 !important; }
              a { color: inherit; }
              .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; mso-hide: all; }
              .download-cta-shell { color-scheme: light only; supported-color-schemes: light; }
              .download-cta-cell {
                background-color: #f5f5f7 !important;
                background: #f5f5f7 !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
              }
              .download-cta-link {
                color: #1f1f1f !important;
                -webkit-text-fill-color: #1f1f1f !important;
              }
              @media (prefers-color-scheme: dark) {
                .download-cta-cell {
                  background-color: #f5f5f7 !important;
                  background: #f5f5f7 !important;
                  border-color: rgba(255,255,255,0.1) !important;
                }
                .download-cta-link {
                  color: #1f1f1f !important;
                  -webkit-text-fill-color: #1f1f1f !important;
                }
              }
              @media only screen and (max-width: 600px) {
                .page-pad { padding: 22px 24px 52px 24px !important; }
                .container { width: 100% !important; max-width: 100% !important; }
                .body-copy { font-size: 16px !important; line-height: 1.65 !important; }
                .section-title { font-size: 21px !important; line-height: 1.3 !important; }
              }
            </style>
          </head>
          <body style="margin:0; padding:0; width:100%; min-width:100%; background-color:#000000;">
            <div class="preheader">You're subscribed to Tiles updates.</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background-color:#000000;">
              <tr>
                <td align="center" class="page-pad" style="padding:20px 24px 72px 24px;">
                  <table role="presentation" width="560" cellpadding="0" cellspacing="0" class="container" style="width:560px; max-width:560px;">
                    <tr>
                      <td style="padding:0 0 56px 0;">
                        <a href="https://www.tiles.run" aria-label="Tiles" style="display:inline-block; text-decoration:none;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td valign="middle" style="padding:0 10px 0 0; line-height:0;">
                                <img src="https://www.tiles.run/grey.png" width="36" height="36" alt="" aria-hidden="true" style="display:block; width:36px; height:36px;" />
                              </td>
                              <td valign="middle">
                                <span style="color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:20px; line-height:1; font-weight:600; letter-spacing:-0.02em;">Tiles</span>
                              </td>
                            </tr>
                          </table>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 24px 0;">
                        <p class="body-copy" style="margin:0 0 12px 0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          Hi ${safeFirstName},
                        </p>
                        <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          You're now subscribed to <a href="https://www.tiles.run" style="color:#f5f5f5; text-decoration:underline; text-decoration-color:#737373;">Tiles</a>. Expect product notes, privacy research, release updates, and engineering notes from the team.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 23px 0; border-bottom:1px solid #262626;"></td>
                    </tr>
                    <tr>
                      <td style="padding:23px 0 12px 0;">
                        <h2 class="section-title" style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:500; letter-spacing:0;">
                          What is Tiles?
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 34px 0;">
                        <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          Tiles is a local-first private AI assistant for everyday use. Powered by on-device models and AT Protocol, Tiles is built for people who want intelligence without renting their memory to centralized providers. Born from the User &amp; Agents community, our mission is to empower people by designing and building software that provides agency, control, and choice in our digital lives.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 0 12px 0; border-top:1px solid #262626;">
                        <h2 class="section-title" style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:500; letter-spacing:0;">
                          What&#8217;s coming next
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 34px 0;">
                        <ul class="body-copy" style="margin:0; padding-left:20px; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          <li style="margin:0 0 8px 0;"><strong style="font-weight:500; color:#f5f5f5;">Web UI</strong> for browser access</li>
                          <li style="margin:0 0 8px 0;"><strong style="font-weight:500; color:#f5f5f5;">Remote Links</strong> to reach your assistant across devices.</li>
                          <li style="margin:0 0 8px 0;"><strong style="font-weight:500; color:#f5f5f5;">Mini Apps</strong> for sharing tools and workflows</li>
                          <li style="margin:0;"><strong style="font-weight:500; color:#f5f5f5;">Group Chats</strong> for collaborative conversations with people and AI together.</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:24px 0 13px 0; border-top:1px solid #262626;">
                        <h2 class="section-title" style="margin:0; color:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:500; letter-spacing:0;">
                          Get started
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 32px 0;">
                        <p class="body-copy" style="margin:0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          Install Tiles for macOS or Linux, read the manual, or join the community shaping what comes next.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 36px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="240" style="width:240px;">
                          <tr>
                            <td style="padding:0 0 10px 0;">
                              <div class="download-cta-shell" style="color-scheme:light only; supported-color-schemes:light;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button download-cta" style="width:100%;">
                                  <tr>
                                    <td bgcolor="#f5f5f7" class="download-cta-cell" style="border-radius:10px; background-color:#f5f5f7 !important; border:1px solid rgba(255,255,255,0.1) !important;">
                                      <a href="https://tiles.run/download" class="download-cta-link" style="display:block; padding:10px 20px; color:#1f1f1f !important; -webkit-text-fill-color:#1f1f1f !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:20px; font-weight:500; text-decoration:none; border-radius:10px;">
                                        <img src="https://tiles.run/icon-download-111111.svg" width="16" height="16" alt="" aria-hidden="true" style="display:inline-block; width:16px; height:16px; margin-right:8px; vertical-align:-3px; border:0;" />
                                        Download Tiles Alpha
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 10px 0;">
                              <div class="download-cta-shell" style="color-scheme:light only; supported-color-schemes:light;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button download-cta" style="width:100%;">
                                  <tr>
                                    <td bgcolor="#f5f5f7" class="download-cta-cell" style="border-radius:10px; background-color:#f5f5f7 !important; border:1px solid rgba(255,255,255,0.1) !important;">
                                      <a href="https://tiles.run/book/manual" class="download-cta-link" style="display:block; padding:10px 20px; color:#1f1f1f !important; -webkit-text-fill-color:#1f1f1f !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:20px; font-weight:500; text-decoration:none; border-radius:10px;">
                                        <img src="https://tiles.run/icon-manual-111111.svg" width="16" height="16" alt="" aria-hidden="true" style="display:inline-block; width:16px; height:16px; margin-right:8px; vertical-align:-3px; border:0;" />
                                        Read the Manual
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0;">
                              <div class="download-cta-shell" style="color-scheme:light only; supported-color-schemes:light;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button download-cta" style="width:100%;">
                                  <tr>
                                    <td bgcolor="#f5f5f7" class="download-cta-cell" style="border-radius:10px; background-color:#f5f5f7 !important; border:1px solid rgba(255,255,255,0.1) !important;">
                                      <a href="https://go.tiles.run/discord" class="download-cta-link" style="display:block; padding:10px 20px; color:#1f1f1f !important; -webkit-text-fill-color:#1f1f1f !important; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:20px; font-weight:500; text-decoration:none; border-radius:10px;">
                                        <img src="https://tiles.run/icon-discord-111111.svg" width="16" height="16" alt="" aria-hidden="true" style="display:inline-block; width:16px; height:16px; margin-right:8px; vertical-align:-3px; border:0;" />
                                        Join Discord
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 40px 0;">
                        <p class="body-copy" style="margin:0 0 12px 0; color:#e5e5e5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:1.68; font-weight:400;">
                          Reply anytime with feedback. Your notes help shape what we build next.
                        </p>
                        <p style="margin:0; color:#d4d4d8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:1.45; font-weight:500;">
                          - Tiles Privacy &amp; Contributors
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px 0 0 0; border-top:1px solid #262626;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; margin-top:14px;">
                          <tr>
                            <td align="center" style="padding:0 0 14px 0; line-height:0;">
                              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                                <tr>
                                  <td align="center" style="line-height:0;">
                                    <a href="https://www.tiles.run" style="text-decoration:none;">
                                      <img src="https://www.tiles.run/grey.png" width="28" height="28" alt="Tiles" style="display:block; width:28px; max-width:28px; height:28px; border:0;">
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 18px 0;">
                              <p style="margin:0; color:#d4d4d8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:14px; line-height:1.45; font-weight:400;">
                                Tiles is a local-first private AI assistant for everyday use.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 18px 0;">
                              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                                <tr>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://x.com/tilesprivacy" aria-label="X (Twitter)" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-x-9ca3af.svg" width="16" height="16" alt="X" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://bsky.app/profile/tiles.run" aria-label="Bluesky" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-bluesky-9ca3af.svg" width="16" height="16" alt="Bluesky" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://go.tiles.run/discord" aria-label="Discord" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-discord-9ca3af.svg" width="16" height="16" alt="Discord" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://github.com/tilesprivacy" aria-label="GitHub" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-github-9ca3af.svg" width="16" height="16" alt="GitHub" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://tangled.org/tiles.run" aria-label="Tangled" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-tangled-9ca3af.svg" width="16" height="16" alt="Tangled" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0 6px; line-height:0;">
                                    <a href="https://huggingface.co/tilesprivacy" aria-label="Hugging Face" style="text-decoration:none;">
                                      <img src="https://tiles.run/icon-huggingface-9ca3af.svg" width="16" height="16" alt="Hugging Face" style="display:block; width:16px; height:16px; border:0;">
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 4px 0;">
                              <a href="mailto:hello@tiles.run?subject=Unsubscribe%20from%20Tiles%20emails" style="color:#e5e5e5; text-decoration:underline; text-underline-offset:4px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6;">
                                Unsubscribe
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      template: isLinuxWaitlist
        ? {
            id: LINUX_WAITLIST_TEMPLATE_ID,
            variables: {
              FIRST_NAME: safeFirstName,
              LAST_NAME: typeof lastName === "string" ? lastName.trim() : "",
              EMAIL: trimmedEmail,
              LINUX_DISTRIBUTIONS: Array.isArray(linuxDistributions)
                ? linuxDistributions.join(", ")
                : "",
            },
          }
        : undefined,
    })

    // Handle Resend API errors
    if (result.error) {
      console.error("[Subscribe] Resend API error:", JSON.stringify(result.error, null, 2))

      // Map Resend errors to user-friendly messages
      let errorMessage = "Failed to send confirmation email. Please try again later."
      const error = result.error

      if (error.message) {
        const message = error.message.toLowerCase()
        if (message.includes("domain") || message.includes("not verified")) {
          errorMessage = "Email domain is not verified. Please contact support."
        } else if (message.includes("invalid") || message.includes("malformed")) {
          errorMessage = "Invalid email address or configuration."
        } else if (message.includes("rate limit") || message.includes("too many")) {
          errorMessage = "Too many requests. Please try again later."
        } else if (message.includes("unauthorized") || message.includes("api key")) {
          errorMessage = "Email service configuration error. Please contact support."
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          // Include error details in development for debugging
          ...(process.env.NODE_ENV === "development" && {
            details: result.error,
          }),
        },
        { status: 500 }
      )
    }

    // Extract sender email for Sniper Link
    const senderEmail = extractEmailFromFromEmail(fromEmail)

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed!",
        id: result.data?.id,
        senderEmail, // Include sender email for Sniper Link
      },
      { status: 200 }
    )
  } catch (error) {
    // Handle unexpected errors
    console.error("[Subscribe] Unexpected error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred"

    return NextResponse.json(
      {
        error: "An error occurred while processing your subscription. Please try again.",
        // Include error details in development
        ...(process.env.NODE_ENV === "development" && {
          details: errorMessage,
        }),
      },
      { status: 500 }
    )
  }
}
