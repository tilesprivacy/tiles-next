import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { toPlainText } from "@react-email/render";

// Initialize Resend client with API key from environment
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
};

const SENDER_NAME = "Tiles Privacy";
const LINUX_WAITLIST_TEMPLATE_ID = "c7599926-3195-4ca5-840b-b3248a6b9524";

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
    const escapedFirstName = safeFirstName
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

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

    const welcomeHtml = isLinuxWaitlist
      ? undefined
      : `
        <!doctype html>
        <html lang="en" dir="ltr" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <title>Welcome to Tiles Privacy</title>
            <!--[if mso]>
            <xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
            <style>body, table, td, p, a, h1, h2 { font-family: Arial, sans-serif !important; }</style>
            <![endif]-->
            <style type="text/css">
              :root { color-scheme: light dark; supported-color-schemes: light dark; }
              body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              table { border-collapse: separate; border-spacing: 0; }
              img { -ms-interpolation-mode: bicubic; border: 0; display: block; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background: #fbfbfb !important; }
              a { color: inherit; }
              a[x-apple-data-detectors] { color: inherit !important; font: inherit !important; text-decoration: none !important; }
              .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; mso-hide: all; }
              .download-cta-cell {
                background-color: #111111 !important;
                background: #111111 !important;
                border: 1px solid #111111 !important;
              }
              .download-cta-link {
                color: #ffffff !important;
                -webkit-text-fill-color: #ffffff !important;
              }
              .secondary-cta-cell {
                background-color: #ffffff !important;
                background: #ffffff !important;
                border: 1px solid #d5d5d5 !important;
              }
              .secondary-cta-link {
                color: #111111 !important;
                -webkit-text-fill-color: #111111 !important;
              }
              @media (prefers-color-scheme: dark) {
                body, .email-bg { background-color: #1f1f1f !important; background: #1f1f1f !important; }
                .container h1, .container h2, .container a, .container .email-strong { color: #f5f5f5 !important; -webkit-text-fill-color: #f5f5f5 !important; }
                .container p { color: #d4d4d4 !important; }
                .container .email-muted { color: #b8b8b8 !important; -webkit-text-fill-color: #b8b8b8 !important; }
                .email-divider { border-top-color: #444444 !important; }
                .download-cta-cell {
                  background-color: #f2f2f2 !important;
                  background: #f2f2f2 !important;
                  border-color: #f2f2f2 !important;
                }
                .container .download-cta-link, .container .download-cta-link span {
                  color: #111111 !important;
                  -webkit-text-fill-color: #111111 !important;
                }
                .secondary-cta-cell {
                  background-color: #292929 !important;
                  background: #292929 !important;
                  border-color: #888888 !important;
                }
                .container .secondary-cta-link {
                  color: #f5f5f5 !important;
                  -webkit-text-fill-color: #f5f5f5 !important;
                }
              }
              [data-ogsc] .email-bg, [data-ogsb] .email-bg { background-color: #1f1f1f !important; }
              [data-ogsc] .container h1, [data-ogsb] .container h1, [data-ogsc] .container h2, [data-ogsb] .container h2, [data-ogsc] .container a, [data-ogsb] .container a, [data-ogsc] .container .email-strong, [data-ogsb] .container .email-strong { color: #f5f5f5 !important; -webkit-text-fill-color: #f5f5f5 !important; }
              [data-ogsc] .container p, [data-ogsb] .container p { color: #d4d4d4 !important; }
              [data-ogsc] .container .email-muted, [data-ogsb] .container .email-muted { color: #b8b8b8 !important; -webkit-text-fill-color: #b8b8b8 !important; }
              [data-ogsc] .email-divider, [data-ogsb] .email-divider { border-top-color: #444444 !important; }
              [data-ogsc] .download-cta-cell, [data-ogsb] .download-cta-cell { background-color: #f2f2f2 !important; background: #f2f2f2 !important; border-color: #f2f2f2 !important; }
              [data-ogsc] .container .download-cta-link, [data-ogsb] .container .download-cta-link, [data-ogsc] .container .download-cta-link span, [data-ogsb] .container .download-cta-link span { color: #111111 !important; -webkit-text-fill-color: #111111 !important; }
              [data-ogsc] .secondary-cta-cell, [data-ogsb] .secondary-cta-cell { background-color: #292929 !important; background: #292929 !important; border-color: #888888 !important; }
              [data-ogsc] .container .secondary-cta-link, [data-ogsb] .container .secondary-cta-link { color: #f5f5f5 !important; -webkit-text-fill-color: #f5f5f5 !important; }
              @media only screen and (max-width: 600px) {
                .page-pad { padding: 28px 20px 40px 20px !important; }
                .container { width: 100% !important; max-width: 100% !important; }
                .body-copy { font-size: 16px !important; line-height: 26px !important; }
                .section-title { font-size: 22px !important; line-height: 28px !important; }
              }
            </style>
          </head>
          <body class="email-bg" style="margin:0; padding:0; width:100%; min-width:100%; background-color:#fbfbfb;">
            <div lang="en" dir="ltr" class="preheader" data-skip-in-text="true" aria-hidden="true" style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; max-height:0; max-width:0; overflow:hidden; mso-hide:all;">You're subscribed to Tiles updates.</div>
            <table lang="en" dir="ltr" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbfbfb" class="email-bg" style="width:100%; background-color:#fbfbfb;">
              <tr>
                <td align="center" class="page-pad" style="padding:40px 20px 48px 20px;">
                  <!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="container" style="width:100%; max-width:560px; table-layout:fixed;">
                    <tr>
                      <td style="padding:0 0 28px 0;">
                        <h1 style="margin:0; color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:32px; line-height:38px; font-weight:600; letter-spacing:-1px;">
                          <a href="https://www.tiles.run" aria-label="Tiles Privacy" style="color:#111111; text-decoration:none;">Tiles Privacy</a>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 12px 0;">
                        <!-- newsletter-content:start -->
                        <h2 class="section-title" style="margin:0; color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:28px; font-weight:600; letter-spacing:0;">Welcome to Tiles</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 28px 0;">
                        <p class="body-copy" style="margin:0 0 12px 0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          Hi <span dir="auto" style="overflow-wrap:anywhere; word-wrap:break-word; word-break:break-word;">${escapedFirstName}</span>,
                        </p>
                        <p class="body-copy" style="margin:0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          You're now subscribed to <a href="https://www.tiles.run" style="color:#111111; text-decoration:underline; text-decoration-color:#737373;">Tiles</a>. Expect product notes, privacy research, release updates, and engineering notes from the team.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="email-divider" style="padding:28px 0 12px 0; border-top:1px solid #e5e5e5;">
                        <h2 class="section-title" style="margin:0; color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:28px; font-weight:600; letter-spacing:0;">
                          Why Tiles?
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 28px 0;">
                        <p class="body-copy" style="margin:0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on <a href="https://atproto.com" style="color:#111111; text-decoration:underline; text-decoration-color:#737373;">AT Protocol</a>. Tiles gives you user-owned keys for your digital life with <a href="https://www.w3.org/TR/did-1.1/" style="color:#111111; text-decoration:underline; text-decoration-color:#737373;">DIDs</a> and <a href="https://ucan.xyz" style="color:#111111; text-decoration:underline; text-decoration-color:#737373;">UCANs</a>, so your data and identity truly remain yours.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="email-divider" style="padding:28px 0 12px 0; border-top:1px solid #e5e5e5;">
                        <h2 class="section-title" style="margin:0; color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:28px; font-weight:600; letter-spacing:0;">
                          Get started
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 20px 0;">
                        <p class="body-copy" style="margin:0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          Install Tiles for macOS or Linux, read the manual, or join the community shaping what comes next.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 28px 0;">
                        <!--[if mso]><table role="presentation" width="200" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%; max-width:200px; table-layout:fixed;">
                          <tr>
                            <td style="padding:0 0 8px 0;">
                              <div class="download-cta-shell" style="color-scheme:light dark; supported-color-schemes:light dark;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button" style="width:100%; border-collapse:separate; border-spacing:0;">
                                  <tr>
                                    <td bgcolor="#111111" class="download-cta-cell" style="mso-padding-alt:10px 16px; border-radius:6px; background-color:#111111; border:1px solid #111111;">
                                      <a href="https://tiles.run/download" class="download-cta-link" style="display:block; padding:10px 16px; mso-padding-alt:0; box-sizing:border-box; text-align:left; color:#ffffff; -webkit-text-fill-color:#ffffff; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:22px; font-weight:500; text-decoration:none; border-radius:6px;">
                                        <img src="https://www.tiles.run/email-icon-download.png" width="18" height="18" alt="" aria-hidden="true" style="display:inline-block; width:18px; height:18px; margin-right:8px; vertical-align:-3px; border:0;" />
                                        Download Tiles
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 8px 0;">
                              <div class="download-cta-shell" style="color-scheme:light dark; supported-color-schemes:light dark;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button" style="width:100%; border-collapse:separate; border-spacing:0;">
                                  <tr>
                                    <td bgcolor="#ffffff" class="secondary-cta-cell" style="mso-padding-alt:10px 16px; border-radius:6px; background-color:#ffffff; border:1px solid #d5d5d5;">
                                      <a href="https://tiles.run/book/manual" class="secondary-cta-link" style="display:block; padding:10px 16px; mso-padding-alt:0; box-sizing:border-box; text-align:left; color:#111111; -webkit-text-fill-color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:22px; font-weight:500; text-decoration:none; border-radius:6px;">
                                        <img src="https://www.tiles.run/email-icon-manual.png" width="18" height="18" alt="" aria-hidden="true" style="display:inline-block; width:18px; height:18px; margin-right:8px; vertical-align:-3px; border:0;" />
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
                              <div class="download-cta-shell" style="color-scheme:light dark; supported-color-schemes:light dark;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="button" style="width:100%; border-collapse:separate; border-spacing:0;">
                                  <tr>
                                    <td bgcolor="#ffffff" class="secondary-cta-cell" style="mso-padding-alt:10px 16px; border-radius:6px; background-color:#ffffff; border:1px solid #d5d5d5;">
                                      <a href="https://discord.gg/PPSjcpZzvt" class="secondary-cta-link" style="display:block; padding:10px 16px; mso-padding-alt:0; box-sizing:border-box; text-align:left; color:#111111; -webkit-text-fill-color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:22px; font-weight:500; text-decoration:none; border-radius:6px;">
                                        <img src="https://www.tiles.run/email-icon-discord-cta.png" width="18" height="18" alt="" aria-hidden="true" style="display:inline-block; width:18px; height:18px; margin-right:8px; vertical-align:-3px; border:0;" />
                                        Join Discord
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 28px 0;">
                        <p class="body-copy" style="margin:0 0 12px 0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          Reply anytime with feedback. Your notes help shape what we build next.
                        </p>
                        <p class="body-copy" style="margin:0; color:#333333; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:16px; line-height:26px; font-weight:400;">
                          - <a href="https://www.tilesprivacy.org" style="color:#111111; text-decoration:underline; text-decoration-color:#737373;">Tiles Privacy</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="email-divider" style="padding:28px 0 0 0; border-top:1px solid #e5e5e5;">
                        <!-- newsletter-content:end -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
                          <tr>
                            <td align="center" style="padding:0 0 8px 0;">
                              <p class="email-strong" style="margin:0; color:#111111; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:13px; line-height:20px; font-weight:600;">
                                Tiles Privacy Technologies Pvt. Ltd.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 16px 0;">
                              <p class="email-muted" style="margin:0; color:#555555; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:13px; line-height:20px; font-weight:400;">
                                WeWork Prestige Atlanta, 80 Feet Rd, Koramangala<br>
                                Bengaluru, IN 560034
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 14px 0;">
                              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto; border-collapse:collapse;">
                                <tr>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://x.com/tilesprivacy" title="X" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-x.png" width="20" height="20" alt="X profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://bsky.app/profile/tiles.run" title="Bluesky" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-bluesky.png" width="20" height="20" alt="Bluesky profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://www.linkedin.com/company/tilesprivacy/" title="LinkedIn" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-linkedin.png" width="20" height="20" alt="LinkedIn profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://discord.gg/PPSjcpZzvt" title="Discord" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-discord.png" width="20" height="20" alt="Discord community" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://github.com/tilesprivacy" title="GitHub" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-github.png" width="20" height="20" alt="GitHub profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://tangled.org/tiles.run" title="Tangled" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-tangled.png" width="20" height="20" alt="Tangled profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                  <td align="center" valign="middle" style="padding:0; mso-padding-alt:6px; font-size:0; line-height:0;">
                                    <a href="https://huggingface.co/tilesprivacy" title="Hugging Face" style="display:inline-block; padding:6px; text-decoration:none;">
                                      <img src="https://www.tiles.run/email-icon-huggingface.png" width="20" height="20" alt="Hugging Face profile" style="display:block; width:20px; height:20px; border:0;">
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 8px 0;">
                              <p class="email-muted" style="margin:0; color:#555555; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:13px; line-height:20px; font-weight:400;">
                                <a href="mailto:hello@tiles.run" style="color:#111111; text-decoration:underline; text-underline-offset:3px; display:inline-block;">hello@tiles.run</a>
                                <span> · </span>
                                <a href="tel:+917338014129" style="color:#111111; text-decoration:underline; text-underline-offset:3px; display:inline-block;">+91 7338014129</a>
                                <span> · </span>
                                <a href="https://www.tiles.run" style="color:#111111; text-decoration:underline; text-underline-offset:3px; display:inline-block;">tiles.run</a>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:0 0 4px 0;">
                              <a href="mailto:hello@tiles.run?subject=Unsubscribe%20from%20Tiles%20emails" class="email-muted" style="color:#555555; text-decoration:underline; text-underline-offset:4px; font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:13px; line-height:20px;">
                                Unsubscribe
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <!--[if mso]></td></tr></table><![endif]-->
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

    // Generate both formats from the same content to keep fallback readers in sync.
    const result = await resend.emails.send({
      from: fromEmail,
      to: trimmedEmail,
      subject: isLinuxWaitlist
        ? "Tiles for Linux waitlist"
        : "Welcome to Tiles Privacy",
      html: welcomeHtml,
      text: welcomeHtml ? toPlainText(welcomeHtml) : undefined,
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
