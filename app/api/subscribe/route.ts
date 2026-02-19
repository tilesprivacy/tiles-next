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

// Get the sender email address from environment variable
// Format: "Display Name <email@domain.com>" or "email@domain.com"
const getFromEmail = (): string => {
  return process.env.RESEND_FROM_EMAIL || "Blog <onboarding@resend.dev>"
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
    let body: { email?: string }
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      )
    }

    const { email } = body

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

    // Send welcome email
    const result = await resend.emails.send({
      from: fromEmail,
      to: trimmedEmail,
      subject: "Welcome to Tiles Privacy",
      html: `
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
                          Tiles is a private and secure AI assistant for everyday use. Born from the <a href="https://userandagents.com" class="email-body-link" style="color: #000000; text-decoration: underline;">User &amp; Agents</a> community, Tiles is built for people who want intelligence without renting their memory to centralized providers.
                        </p>
                        
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 32px 0; line-height: 1.6;">
                          Developers can extend Tiles using our Modelfile-based SDK to customize models and agent experiences securely.
                        </p>
                        
                        <h2 class="email-heading" style="color: #000000; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.02em;">
                          Current status
                        </h2>
                        
                        <p class="email-body" style="color: #666666; font-size: 17px; margin: 0 0 32px 0; line-height: 1.6;">
                          Tiles is currently in alpha. We are focused on making the assistant faster, more reliable, and genuinely useful in daily workflows. Alongside improving the core experience, we are steadily expanding its capabilities and exposing more control through the Modelfile SDK so developers can shape and extend what Tiles can do. Expect rapid iteration with security and correctness as the baseline.
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
                              <a href="https://www.tiles.run/download" class="email-card email-card-dark" style="display: block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-size: 17px; font-weight: 500; -webkit-text-size-adjust: 100%;">
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
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
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
