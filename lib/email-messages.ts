import {
  EMAIL_BODY_STYLE,
  EMAIL_FONT,
  EMAIL_HEADING_STYLE,
  EMAIL_LINK_STYLE,
  escapeEmailHtml,
  renderEmailTemplate,
} from "@/emails/template"
import {
  LINUX_INSTALL_COMMAND,
  LINUX_INSTALL_SCRIPT_URL,
  LINUX_INSTALL_VERSION,
  LINUX_MODEL_NAME,
  LINUX_MODEL_URL,
  OFFLINE_MODEL_NAME,
  OFFLINE_MODEL_URL,
} from "@/lib/download-page-data"
import {
  DOWNLOAD_PLATFORM_LINUX_REQUIREMENT_LABEL,
  DOWNLOAD_PLATFORM_MACOS_LABEL,
} from "@/lib/product-description"

// Transaction-specific content uses the one shared funding-newsletter design.
// Keep document structure, theme behavior, branding, and footer in emails/template.ts.
const row = (content: string) =>
  `<tr><td style="padding:0 0 24px 0;">${content}</td></tr>`
const paragraph = (html: string) =>
  `<p class="body-copy" style="margin:0 0 12px 0; ${EMAIL_BODY_STYLE}">${html}</p>`
const heading = (text: string) =>
  row(`<h2 class="section-title" style="${EMAIL_HEADING_STYLE}">${escapeEmailHtml(text)}</h2>`)
const link = (url: string, label: string) =>
  `<a href="${escapeEmailHtml(url)}" style="${EMAIL_LINK_STYLE}">${escapeEmailHtml(label)}</a>`
const button = (url: string, label: string) => row(`
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="download-cta-shell" style="width:auto; border-collapse:separate; border-spacing:0;">
    <tr><td bgcolor="#111111" class="download-cta-cell" style="mso-padding-alt:10px 20px; border-radius:6px; background-color:#111111; border:1px solid #111111;">
      <a href="${escapeEmailHtml(url)}" class="download-cta-link" style="display:inline-block; padding:10px 20px; mso-padding-alt:0; color:#ffffff; -webkit-text-fill-color:#ffffff; font-family:${EMAIL_FONT}; font-size:15px; line-height:22px; font-weight:500; text-decoration:none; border-radius:6px;">${escapeEmailHtml(label)}</a>
    </td></tr>
  </table>`)

export function buildSubscriptionEmail(firstName: string, isLinuxWaitlist: boolean) {
  const subject = isLinuxWaitlist ? "Tiles for Linux waitlist" : "Welcome to Tiles Privacy"
  const greeting = paragraph(`Hi <span dir="auto" style="overflow-wrap:anywhere; word-break:break-word;">${escapeEmailHtml(firstName)}</span>,`)
  const content = isLinuxWaitlist
    ? [
        heading("You're on the Linux waitlist"),
        row(greeting +
          paragraph("Thanks for signing up for Tiles for Linux. You're on the waitlist.") +
          paragraph("We're preparing the Linux build and will email you as soon as it is ready to install.") +
          paragraph(`In the meantime, check out our ${link("https://tiles.run/blog", "Blog")} for product updates.`)),
        row(paragraph(`If you’d like to get in touch with the team, either ahead of the release or after, you can always find us on the #tiles channel in ${link("https://discord.gg/PPSjcpZzvt", "User & Agents Discord")}.`) +
          paragraph(`- ${link("https://www.tilesprivacy.org", "Tiles Privacy")}`)),
      ].join("")
    : [
        heading("Welcome to Tiles"),
        row(greeting + paragraph(`You're now subscribed to ${link("https://www.tiles.run", "Tiles")}. Expect product notes, privacy research, release updates, and engineering notes from the team.`)),
        heading("Why Tiles?"),
        row(paragraph(`For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on ${link("https://atproto.com", "AT Protocol")}. Tiles gives you user-owned keys for your digital life with ${link("https://www.w3.org/TR/did-1.1/", "DIDs")} and ${link("https://ucan.xyz", "UCANs")}, so your data and identity truly remain yours.`)),
        heading("Get started"),
        row(paragraph("Install Tiles for macOS or Linux, read the manual, or join the community shaping what comes next.")),
        button("https://www.tiles.run/download", "Download Tiles"),
        row(paragraph(`${link("https://www.tiles.run/book/manual", "Read the manual")} · ${link("https://discord.gg/PPSjcpZzvt", "Join Discord")}`)),
        row(paragraph("Reply anytime with feedback. Your notes help shape what we build next.") +
          paragraph(`- ${link("https://www.tilesprivacy.org", "Tiles Privacy")}`)),
      ].join("")

  return {
    subject,
    html: renderEmailTemplate({
      subject,
      preheader: isLinuxWaitlist
        ? "You have been added to the Tiles for Linux waitlist."
        : "Product notes, privacy research, release updates, and engineering notes from the Tiles team.",
      content,
    }),
  }
}

export interface DownloadLinkEmailVariables extends Record<string, string> {
  CURRENT_BUILD_VERSION: string
  DOWNLOAD_URL: string
  DOWNLOAD_FILE_NAME: string
  DOWNLOAD_VERSION: string
  DOWNLOAD_SIZE: string
  DOWNLOAD_SHA_SHORT: string
  DOWNLOAD_CHECKSUM_URL: string
  NETWORK_VERSION: string
  NETWORK_SIZE: string
  NETWORK_SHA_SHORT: string
  NETWORK_CHECKSUM_URL: string
  OFFLINE_DOWNLOAD_URL: string
  OFFLINE_FILE_NAME: string
  OFFLINE_DOWNLOAD_VERSION: string
  OFFLINE_DOWNLOAD_SIZE: string
  OFFLINE_DOWNLOAD_SHA_SHORT: string
  OFFLINE_DOWNLOAD_CHECKSUM_URL: string
  OFFLINE_VERSION: string
  OFFLINE_SIZE: string
  OFFLINE_SHA_SHORT: string
  OFFLINE_CHECKSUM_URL: string
}

export function buildDownloadLinkEmail(variables: DownloadLinkEmailVariables) {
  const value = (key: keyof DownloadLinkEmailVariables) => escapeEmailHtml(variables[key])
  const metadata = (prefix: "NETWORK" | "OFFLINE") =>
    paragraph(`Release: v${value(`${prefix}_VERSION`)}<br>Size: ${value(`${prefix}_SIZE`)} | SHA256: ${link(variables[`${prefix}_CHECKSUM_URL`], variables[`${prefix}_SHA_SHORT`])}`)
  const subject = "Your Tiles download link"
  const content = [
    heading(subject),
    row(paragraph("You were sent this email because you requested a download link from the Tiles website.") +
      paragraph(`You can also visit ${link("https://www.tiles.run/download", "tiles.run/download")} on desktop.`) +
      paragraph("Public alpha for macOS and Linux. Minimum recommended system requirements: 16 GB of unified memory on Macs, or 16 GB of VRAM on Linux machines.") +
      paragraph(`Current build: v${value("CURRENT_BUILD_VERSION")}`)),
    heading("macOS"),
    row(paragraph(escapeEmailHtml(DOWNLOAD_PLATFORM_MACOS_LABEL)) + paragraph(`Uses ${link(OFFLINE_MODEL_URL, OFFLINE_MODEL_NAME)} as the default model.`)),
    heading("Network installer"),
    row(paragraph("Small package that includes the required runtime. You will be prompted to download the model during onboarding.") + metadata("NETWORK")),
    button(variables.DOWNLOAD_URL, "Download network installer"),
    heading("Offline Installer"),
    row(paragraph("The offline installer includes the default model for air-gapped installation and use.") + metadata("OFFLINE")),
    button(variables.OFFLINE_DOWNLOAD_URL, "Download Offline Installer"),
    row(paragraph("Offline installer builds aren't published for every release. Check the release version above to confirm which build each installer includes.")),
    heading("Linux"),
    row(paragraph(escapeEmailHtml(DOWNLOAD_PLATFORM_LINUX_REQUIREMENT_LABEL)) + paragraph(`Uses ${link(LINUX_MODEL_URL, LINUX_MODEL_NAME)} as the default model.`)),
    heading("Network installer"),
    row(paragraph("A supported GPU is used automatically when available. You will be prompted to download the default model during onboarding.") +
      paragraph(`Release: v${escapeEmailHtml(LINUX_INSTALL_VERSION)}`) +
      paragraph(`<code style="font-family:Consolas,monospace; font-size:14px; overflow-wrap:anywhere; word-break:break-all;">${escapeEmailHtml(LINUX_INSTALL_COMMAND)}</code>`) +
      paragraph(`Paste this in terminal.<br>The install script has a <code>--canary</code> flag to install the canary version.<br>The offline installer for Linux is a work in progress.<br>${link(LINUX_INSTALL_SCRIPT_URL, "View script source")}`)),
    row(`<p class="email-muted" style="margin:0; font-family:${EMAIL_FONT}; font-size:13px; line-height:20px; color:#555555;">By downloading and using Tiles, you agree to the ${link("https://tiles.run/terms", "terms")} and ${link("https://tiles.run/privacy", "privacy statement")}.</p>`),
    heading("Resources"),
    row(paragraph(`Need usage instructions? Check out the ${link("https://tiles.run/book/manual", "Manual")} in the book for step-by-step guidance.`) +
      paragraph(`Chat with the team and other users, get help, and share feedback. Join us in the #tiles channel hosted by the ${link("https://discord.gg/PPSjcpZzvt", "User & Agents community")}.`) +
      paragraph(`Need an older build? Browse the ${link("https://tiles.run/releases#releases", "releases page")} to download previous versions.`)),
  ].join("")

  return { subject, html: renderEmailTemplate({ subject, preheader: "Open this email on desktop to download Tiles Alpha for macOS or Linux.", content }) }
}

export function buildGiveawayConfirmationEmail({ fullName, trackLabel, responseItems }: {
  fullName: string
  trackLabel: string
  responseItems: Array<{ label: string; value: string }>
}) {
  const subject = "We received your IndiaFOSS 2026 giveaway entry"
  const content = [
    heading("We received your entry"),
    row(paragraph(`Hi ${escapeEmailHtml(fullName)},`) +
      paragraph("Your IndiaFOSS 2026 giveaway entry has been received.") +
      paragraph(`Application track: ${escapeEmailHtml(trackLabel)}`) +
      paragraph("Submitting an entry does not guarantee selection. We will contact selected applicants at this email address.") +
      paragraph("If selected, your conference ticket code and, for travel-grant recipients, flight ticket will follow by email shortly, within a couple of days.")),
    heading("Your submitted response"),
    row(responseItems.map(({ label, value }) => paragraph(`<strong>${escapeEmailHtml(label)}</strong><br><span dir="auto" style="overflow-wrap:anywhere; word-break:break-word; white-space:pre-wrap;">${escapeEmailHtml(value)}</span>`)).join("")),
    row(paragraph("If you have any questions, you can reach us anytime using the contact details in the footer below.") +
      paragraph("Ankesh Bharti<br>Founder and CEO, Tiles Privacy")),
  ].join("")
  return { subject, html: renderEmailTemplate({ subject, preheader: "Your IndiaFOSS 2026 giveaway entry has been received.", content }) }
}
