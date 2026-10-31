import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { toPlainText } from "@react-email/render";
import { buildSubscriptionEmail } from "@/lib/email-messages";

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

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

type LinuxWaitlistContactPayload = {
  email: string;
  firstName: string;
  lastName: string;
  linuxDistributions: string[];
};

const LINUX_WAITLIST_CONTACT_PROPERTIES = [
  { key: "tiles_queue", fallbackValue: "linux" },
  { key: "tiles_linux_waitlist", fallbackValue: "true" },
  { key: "tiles_waitlist_source", fallbackValue: "form" },
  { key: "tiles_linux_distributions", fallbackValue: "" },
  { key: "tiles_form_first_name", fallbackValue: "" },
  { key: "tiles_form_last_name", fallbackValue: "" },
] as const;

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
});

const isMissingPropertiesErrorMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("properties do not exist") ||
    normalized.includes("one or more properties do not exist")
  );
};

const ensureLinuxWaitlistContactProperties = async (resend: Resend) => {
  for (const property of LINUX_WAITLIST_CONTACT_PROPERTIES) {
    const result = await resend.contactProperties.create({
      key: property.key,
      type: "string",
      fallbackValue: property.fallbackValue,
    });

    if (!result.error) continue;

    const message = result.error.message?.toLowerCase() || "";
    const isAlreadyExists =
      message.includes("already exists") ||
      message.includes("already a contact property with this key") ||
      message.includes("already been taken") ||
      message.includes("duplicate") ||
      message.includes("409");

    if (!isAlreadyExists) {
      throw new Error(
        result.error.message ||
          `Could not create contact property: ${property.key}`,
      );
    }
  }
};

const upsertLinuxWaitlistContact = async (
  resend: Resend,
  payload: LinuxWaitlistContactPayload,
) => {
  const contactData = getLinuxWaitlistContactData(payload);

  const tryCreateOrUpdate = async () => {
    const createResult = await resend.contacts.create(contactData);
    if (!createResult.error) return;

    const createErrorMessage = createResult.error.message?.toLowerCase() || "";
    const isAlreadyExistsError =
      createErrorMessage.includes("already") ||
      createErrorMessage.includes("exists") ||
      createErrorMessage.includes("duplicate") ||
      createErrorMessage.includes("409");

    if (!isAlreadyExistsError) {
      throw new Error(
        createResult.error.message || "Could not create waitlist contact.",
      );
    }

    const updateResult = await resend.contacts.update({
      email: payload.email,
      firstName: payload.firstName || undefined,
      lastName: payload.lastName || undefined,
      unsubscribed: false,
      properties: contactData.properties,
    });

    if (updateResult.error) {
      throw new Error(
        updateResult.error.message || "Could not update waitlist contact.",
      );
    }
  };

  try {
    await tryCreateOrUpdate();
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!isMissingPropertiesErrorMessage(message)) {
      throw error;
    }
  }

  // Create missing contact properties once, then retry contact upsert.
  await ensureLinuxWaitlistContactProperties(resend);
  await tryCreateOrUpdate();
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
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    let body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      linuxDistributions?: string[];
      source?: string;
    };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, linuxDistributions, source } = body;

    // Validate email is provided
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 },
      );
    }

    // Validate email format
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 },
      );
    }

    // Initialize Resend client
    const resend = getResendClient();
    const fromEmail = getFromEmail();
    const isLinuxWaitlist = source === "linux-notify-form";
    const safeFirstName =
      typeof firstName === "string" && firstName.trim().length > 0
        ? firstName.trim()
        : "there";

    if (isLinuxWaitlist) {
      if (
        !Array.isArray(linuxDistributions) ||
        linuxDistributions.length === 0
      ) {
        return NextResponse.json(
          { error: "At least one Linux distribution is required." },
          { status: 400 },
        );
      }

      const linuxPayload = {
        email: trimmedEmail,
        firstName: typeof firstName === "string" ? firstName.trim() : "",
        lastName: typeof lastName === "string" ? lastName.trim() : "",
        linuxDistributions: linuxDistributions
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await upsertLinuxWaitlistContact(resend, linuxPayload);
    }

    const message = buildSubscriptionEmail(safeFirstName, isLinuxWaitlist);

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
