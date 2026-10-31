import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { toPlainText } from "@react-email/render";
import { buildSubscriptionEmail } from "@/lib/email-messages";
import { guardEmailRequest } from "@/lib/email-request-guard";

// Initialize Resend client with API key from environment
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

const SENDER_NAME = "Tiles Privacy";

// Default email when RESEND_FROM_EMAIL is not set (Resend onboarding address)
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

// Get the sender email address (no display name) from environment variable.
// RESEND_FROM_EMAIL can be "Display Name <email@domain.com>" or "email@domain.com".
const getFromEmailAddress = (): string => {
  const raw = process.env.RESEND_FROM_EMAIL;
  if (!raw?.trim()) return DEFAULT_FROM_EMAIL;
  const match = raw.trim().match(/<([^>]+)>/);
  if (match) return match[1].trim();
  return raw.trim();
};

// Build the Resend "from" value: always "Tiles Privacy <email@domain.com>"
// per https://resend.com/docs/api-reference/emails/send-email
const getFromEmail = (): string => {
  return `${SENDER_NAME} <${getFromEmailAddress()}>`;
};

// Extract email address from fromEmail string
// Handles formats like "Display Name <email@domain.com>" or "email@domain.com"
const extractEmailFromFromEmail = (fromEmail: string): string => {
  const match = fromEmail.match(/<([^>]+)>/);
  if (match) {
    return match[1];
  }
  return fromEmail.trim();
};

// GET handler for development debugging
export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );
  }

  const hasApiKey = !!process.env.RESEND_API_KEY;
  const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 7) || "not set";
  const fromEmail = getFromEmail();

  return NextResponse.json({
    configured: hasApiKey,
    apiKeyPrefix: hasApiKey ? `${apiKeyPrefix}...` : "not set",
    fromEmail,
    environment: process.env.NODE_ENV,
  });
}

// POST handler for newsletter subscription
// Same shape as a real success, without senderEmail, so a dropped request
// (honeypot hit, address already emailed recently) is indistinguishable.
const silentSuccess = () =>
  NextResponse.json(
    { success: true, message: "Successfully subscribed!" },
    { status: 200 },
  );

export async function POST(request: NextRequest) {
  let releaseRecipient: (() => Promise<void>) | undefined;
  try {
    // Validate Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[Subscribe] RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Email service is not configured. Please contact support.",
        },
        { status: 503 },
      );
    }

    const guarded = await guardEmailRequest(request, silentSuccess);
    if (!guarded.ok) return guarded.response;
    const trimmedEmail = guarded.email;
    releaseRecipient = guarded.release;

    const resend = getResendClient();
    const fromEmail = getFromEmail();
    const message = buildSubscriptionEmail();

    // All transactional messages use the same design as the funding newsletter.
    const result = await resend.emails.send({
      from: fromEmail,
      to: trimmedEmail,
      subject: message.subject,
      html: message.html,
      text: toPlainText(message.html),
    });

    // Handle Resend API errors
    if (result.error) {
      await releaseRecipient();
      console.error(
        "[Subscribe] Resend API error:",
        JSON.stringify(result.error, null, 2),
      );

      // Map Resend errors to user-friendly messages
      let errorMessage =
        "Failed to send confirmation email. Please try again later.";
      const error = result.error;

      if (error.message) {
        const message = error.message.toLowerCase();
        if (message.includes("domain") || message.includes("not verified")) {
          errorMessage =
            "Email domain is not verified. Please contact support.";
        } else if (
          message.includes("invalid") ||
          message.includes("malformed")
        ) {
          errorMessage = "Invalid email address or configuration.";
        } else if (
          message.includes("rate limit") ||
          message.includes("too many")
        ) {
          errorMessage = "Too many requests. Please try again later.";
        } else if (
          message.includes("unauthorized") ||
          message.includes("api key")
        ) {
          errorMessage =
            "Email service configuration error. Please contact support.";
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
        { status: 500 },
      );
    }

    // Extract sender email for Sniper Link
    const senderEmail = extractEmailFromFromEmail(fromEmail);

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed!",
        id: result.data?.id,
        senderEmail, // Include sender email for Sniper Link
      },
      { status: 200 },
    );
  } catch (error) {
    await releaseRecipient?.();
    // Handle unexpected errors
    console.error("[Subscribe] Unexpected error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error:
          "An error occurred while processing your subscription. Please try again.",
        // Include error details in development
        ...(process.env.NODE_ENV === "development" && {
          details: errorMessage,
        }),
      },
      { status: 500 },
    );
  }
}
