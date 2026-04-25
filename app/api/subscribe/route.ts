import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"

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
  await ensureLinuxWaitlistContactProperties(resend)

  const contactData = {
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
  }

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
    properties: {
      tiles_queue: "linux",
      tiles_linux_waitlist: "true",
      tiles_waitlist_source: "form",
      tiles_linux_distributions: payload.linuxDistributions.join(", "),
      tiles_form_first_name: payload.firstName || "",
      tiles_form_last_name: payload.lastName || "",
    },
  })

  if (updateResult.error) {
    throw new Error(updateResult.error.message || "Could not update waitlist contact.")
  }
}

const verifyLinuxWaitlistContactProperties = async (
  resend: Resend,
  payload: LinuxWaitlistContactPayload,
) => {
  const expectedProperties: Record<string, string> = {
    tiles_queue: "linux",
    tiles_linux_waitlist: "true",
    tiles_waitlist_source: "form",
    tiles_linux_distributions: payload.linuxDistributions.join(", "),
    tiles_form_first_name: payload.firstName || "",
    tiles_form_last_name: payload.lastName || "",
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  const attempts = 3
  const delayMs = 350

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const getResult = await resend.contacts.get({ email: payload.email })
    if (!getResult.error && getResult.data) {
      const savedProperties =
        (getResult.data as { properties?: Record<string, unknown> }).properties || {}

      let allMatched = true
      for (const [key, expectedValue] of Object.entries(expectedProperties)) {
        if (String(savedProperties[key] ?? "") !== expectedValue) {
          allMatched = false
          break
        }
      }

      if (allMatched) return true
    }

    if (attempt < attempts) {
      await wait(delayMs)
    }
  }

  // Do not block a successful submission if verification lags eventual consistency.
  console.warn("[Subscribe] Linux waitlist properties verification did not fully match yet", {
    email: payload.email,
  })
  return false
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
    const artifact = isLinuxWaitlist ? null : await getLatestDownloadArtifact()
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
      await verifyLinuxWaitlistContactProperties(resend, linuxPayload)
    }

    // Send welcome email
    const result = await resend.emails.send({
      from: fromEmail,
      to: trimmedEmail,
      subject: isLinuxWaitlist ? "Tiles for Linux waitlist" : "Welcome to Tiles Privacy",
      html: isLinuxWaitlist
        ? undefined
        : `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style type="text/css">
              body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; }
              table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; }
              a { text-decoration: none; }
              .dark-icon { display: none; }
              @media (prefers-color-scheme: dark) {
                body { background-color: #121212 !important; color: #E6E6E6 !important; }
                table[role="presentation"] { background-color: #121212 !important; }
                .email-wrapper { background-color: #121212 !important; }
                .email-container { background-color: #121212 !important; }
                .email-title { color: #E6E6E6 !important; }
                .email-heading { color: #E6E6E6 !important; }
                .email-body { color: #B3B3B3 !important; }
                .email-body-link { color: #E6E6E6 !important; }
                .email-card-light { background-color: rgba(255, 255, 255, 0.05) !important; color: #E6E6E6 !important; }
                .email-card-dark { background-color: #E6E6E6 !important; color: #121212 !important; }
                .email-border { border-color: #2a2a2a !important; }
                .light-icon { display: none !important; }
                .dark-icon { display: block !important; }
              }
              @media only screen and (max-width: 600px) {
                .email-wrapper { padding: 24px 16px !important; }
                .email-container { width: 100% !important; max-width: 100% !important; }
                .email-title { font-size: 28px !important; line-height: 1.15 !important; }
                .email-heading { font-size: 20px !important; }
                .email-body { font-size: 16px !important; }
                .email-padding-sm { padding-bottom: 24px !important; }
                .email-padding-md { padding-bottom: 32px !important; }
                .email-padding-lg { padding-bottom: 40px !important; }
                .email-card { padding: 14px 16px !important; border-radius: 12px !important; font-size: 15px !important; }
                .email-section-gap { padding-bottom: 32px !important; }
              }
            </style>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #000000; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; -webkit-text-size-adjust: 100%;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
              <tr>
                <td class="email-wrapper" style="padding: 60px 24px;">
                  <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 560px; margin: 0 auto; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                      <td style="padding-bottom: 32px; text-align: center;">
                        <img src="https://www.tiles.run/lighticon.png" alt="Tiles" width="48" height="48" class="light-icon" style="display: block; margin: 0 auto 20px auto; width: 48px; height: 48px;" />
                        <img src="https://www.tiles.run/grey.png" alt="Tiles" width="48" height="48" class="dark-icon" style="display: none; margin: 0 auto 20px auto; width: 48px; height: 48px;" />
                        <h1 class="email-title" style="color: #000000; font-size: 36px; font-weight: 600; margin: 0; line-height: 1.1; letter-spacing: -0.03em;">
                          Welcome to Tiles Privacy
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Intro -->
                    <tr>
                      <td class="email-section-gap" style="padding-bottom: 40px;">
                        <p class="email-body" style="color: #000000; font-size: 17px; margin: 0 0 32px 0; line-height: 1.6;">
                          You're now subscribed to <a href="https://www.tiles.run" class="email-body-link" style="color: #000000; text-decoration: underline;">Tiles</a>. Expect updates on product releases, privacy research, and engineering.
                        </p>
                        
                        <h2 class="email-heading" style="color: #000000; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.02em;">
                          What is Tiles?
                        </h2>
                        
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 16px 0; line-height: 1.6;">
                          Local-first private AI for everyday use. Born from the <a href="https://userandagents.com" class="email-body-link" style="color: #000000; text-decoration: underline;">User &amp; Agents</a> community, Tiles is built for people who want intelligence without renting their memory to centralized providers.
                        </p>
                        
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 32px 0; line-height: 1.6;">
                          Developers can extend Tiles using our Tilekit SDK to customize models and agent experiences securely.
                        </p>
                        
                        <h2 class="email-heading" style="color: #000000; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.02em;">
                          Current status
                        </h2>
                        
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 32px 0; line-height: 1.6;">
                          Tiles is currently in alpha. We are focused on making the assistant faster, more reliable, and genuinely useful in daily workflows. Alongside improving the core experience, we are steadily expanding its capabilities and exposing more control through the Tilekit SDK so developers can shape and extend what Tiles can do. Expect rapid iteration with security and correctness as the baseline.
                        </p>
                        
                        <h2 class="email-heading" style="color: #000000; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.02em;">
                          What's next
                        </h2>
                        
                        <ul class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 20px 0; line-height: 1.6; padding-left: 20px;">
                          <li style="margin-bottom: 6px;">ATProto-based identity</li>
                          <li style="margin-bottom: 6px;">Peer-to-peer encrypted sync</li>
                          <li style="margin-bottom: 6px;">MCP and Skills support optimized for on-device use</li>
                          <li style="margin-bottom: 6px;">MLS-based group chats</li>
                        </ul>
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 16px 0; line-height: 1.6;">
                          If you would like to influence how we implement this roadmap, join the discussion in our RFCs.
                        </p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                          <tr>
                            <td>
                              <a href="https://github.com/orgs/tilesprivacy/discussions" class="email-card email-card-light" style="display: block; background-color: #f5f5f5; background-color: rgba(0, 0, 0, 0.03); color: #000000; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 16px; font-weight: 500; -webkit-text-size-adjust: 100%;">
                                View the RFCs
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 16px 0; line-height: 1.6;">
                          If you want to track progress in detail, review our release notes and milestones.
                        </p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                          <tr>
                            <td>
                              <a href="https://tiles.run/changelog" class="email-card email-card-light" style="display: block; background-color: #f5f5f5; background-color: rgba(0, 0, 0, 0.03); color: #000000; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 16px; font-weight: 500; -webkit-text-size-adjust: 100%;">
                                View the Changelog
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Get started -->
                    <tr>
                      <td style="padding-bottom: 48px;">
                        <h2 class="email-heading" style="color: #000000; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.02em;">
                          Get started
                        </h2>
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 20px 0; line-height: 1.6;">
                          Install Tiles, read the docs, or join the community shaping its future.
                        </p>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <a href="${artifact?.downloadUrl ?? "https://tiles.run/download"}" class="email-card email-card-dark" style="display: block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 17px; font-weight: 500; -webkit-text-size-adjust: 100%;">
                                Download Tiles for macOS
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <a href="https://tiles.run/book/manual" class="email-card email-card-light" style="display: block; background-color: #f5f5f5; background-color: rgba(0, 0, 0, 0.03); color: #000000; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 16px; font-weight: 500; -webkit-text-size-adjust: 100%;">
                                Read the Technical Manual
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a href="https://go.tiles.run/discord" class="email-card email-card-light" style="display: block; background-color: #f5f5f5; background-color: rgba(0, 0, 0, 0.03); color: #000000; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 16px; font-weight: 500; -webkit-text-size-adjust: 100%;">
                                Join the Community
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding-top: 40px;">
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 20px 0; line-height: 1.6;">
                          Don't hesitate to reply to this email anytime if you have feedback. Your feedback shapes what we build next.
                        </p>
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 20px 0; line-height: 1.6;">
                          Thanks for being an early user. More soon.
                        </p>
                        <p class="email-body" style="color: #666666; font-size: 15px; margin: 0 0 6px 0; line-height: 1.5;">
                          Best regards,
                        </p>
                        <p class="email-body" style="color: #000000; font-size: 15px; margin: 0; font-weight: 500; line-height: 1.5;">
                          Tiles Privacy & Contributors
                        </p>
                        <p style="margin: 18px 0 0 0; line-height: 1;">
                          <a href="https://tangled.org/tiles.run/tiles/" aria-label="Tangled" style="display: inline-block; text-decoration: none;">
                            <img src="https://tiles.run/icon-tangled-9ca3af.svg" width="16" height="16" alt="Tangled" style="display: block; width: 16px; height: 16px;" />
                          </a>
                        </p>
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
