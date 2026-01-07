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
  return process.env.RESEND_FROM_EMAIL || "Tiles Blog <onboarding@resend.dev>"
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
      subject: "Welcome to The Tiles Blog",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; padding: 40px 20px; border-radius: 8px;">
              <h2 style="color: #000000; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                Welcome to The Tiles Blog
              </h2>
              <p style="color: #666666; font-size: 16px; margin: 0 0 24px 0;">
                Thanks for subscribing! You'll now receive updates about privacy technology and our latest blog posts.
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0;">
                Best regards,<br />
                <strong>The Tiles Privacy Team</strong>
              </p>
            </div>
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

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed!",
        id: result.data?.id,
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
