import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const VERIFIED_EMAIL = "hey@ankeshbharti.com"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (email !== VERIFIED_EMAIL) {
      return Response.json(
        {
          error: `During testing, only ${VERIFIED_EMAIL} can receive emails. A domain will be verified soon!`,
          isTestingMode: true,
        },
        { status: 400 },
      )
    }

    // Send confirmation email using Resend
    const response = await resend.emails.send({
      from: "Tiles Blog <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to The Tiles Blog",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
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

    if (response.error) {
      console.error("Resend error:", response.error)
      return Response.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
    }

    return Response.json({ success: true, message: "Successfully subscribed!" }, { status: 200 })
  } catch (error) {
    console.error("Subscribe error:", error)
    return Response.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
