import { Resend } from "resend"
import { NextResponse } from "next/server"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Get the from email address from environment variable or use default
// Format: "Display Name <email@domain.com>" or just "email@domain.com"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Tiles Blog <onboarding@resend.dev>"

// Debug endpoint to check configuration (only in development)
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 })
  }
  
  return NextResponse.json({
    hasApiKey: !!process.env.RESEND_API_KEY,
    apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) || "not set",
    fromEmail: FROM_EMAIL,
    nodeEnv: process.env.NODE_ENV,
  })
}

export async function POST(request: Request) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 500 },
      )
    }

    const { email } = await request.json()

    // Validate email input
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Send confirmation email using Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to The Tiles Blog",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000; font-size: 24px; margin-bottom: 16px;">Welcome to The Tiles Blog</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thanks for subscribing! You'll now receive updates about privacy technology and our latest blog posts.
          </p>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br />
            The Tiles Privacy Team
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", JSON.stringify(error, null, 2))
      
      // Provide more specific error messages based on Resend error types
      let errorMessage = "Failed to subscribe. Please try again."
      
      if (error.message) {
        if (error.message.includes("domain") || error.message.includes("not verified")) {
          errorMessage = "Email domain is not verified. Please contact support."
        } else if (error.message.includes("invalid") || error.message.includes("Invalid")) {
          errorMessage = "Invalid email address or configuration."
        } else if (error.message.includes("rate limit") || error.message.includes("limit")) {
          errorMessage = "Too many requests. Please try again later."
        } else {
          // Return the actual error message for debugging (in development)
          if (process.env.NODE_ENV === "development") {
            errorMessage = error.message
          }
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: process.env.NODE_ENV === "development" ? error : undefined
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!", id: data?.id },
      { status: 200 },
    )
  } catch (error) {
    console.error("Subscribe error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { 
        error: "An error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 },
    )
  }
}
