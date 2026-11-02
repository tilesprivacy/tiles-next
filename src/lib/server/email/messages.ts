import {
  EMAIL_BODY_STYLE,
  EMAIL_FONT,
  EMAIL_HEADING_STYLE,
  EMAIL_LINK_STYLE,
  escapeEmailHtml,
  renderEmailTemplate,
} from "./template"

// Message bodies only; the layout, theme and footer live in template.ts.
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

// The only variable is a link the server built itself (canonical origin plus
// an encrypted token); never interpolate request input into outbound mail.
export function buildConfirmationEmail(confirmUrl: string, linkTtlDays: number) {
  const subject = "Confirm your subscription to Tiles"
  const content = [
    heading("Confirm your subscription"),
    row(
      paragraph("Hi there,") +
        paragraph("Someone, hopefully you, asked for the Tiles newsletter to be sent to this address. Confirm below to start getting product notes, privacy research, release updates, and engineering notes from the team."),
    ),
    button(confirmUrl, "Confirm subscription"),
    row(
      paragraph(`If this wasn't you, ignore this email. You won't be subscribed, and this link stops working in ${linkTtlDays} days.`) +
        paragraph(`- ${link("https://www.tilesprivacy.org", "Tiles Privacy")}`),
    ),
  ].join("")

  return {
    subject,
    html: renderEmailTemplate({
      subject,
      preheader: "One click to confirm your subscription to the Tiles newsletter.",
      content,
    }),
  }
}

// Takes no arguments on purpose: never interpolate request input into outbound
// mail, or anyone can use the endpoint to send their own text from this domain.
export function buildSubscriptionEmail() {
  const subject = "Welcome to Tiles Privacy"
  const greeting = paragraph("Hi there,")
  const content = [
    heading("Welcome to Tiles"),
    row(greeting + paragraph(`You're now subscribed to ${link("https://tiles.run", "Tiles")}. Expect product notes, privacy research, release updates, and engineering notes from the team.`)),
    heading("Why Tiles?"),
    row(paragraph(`For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on ${link("https://atproto.com", "AT Protocol")}. Tiles gives you user-owned keys for your digital life with ${link("https://www.w3.org/TR/did-1.1/", "DIDs")} and ${link("https://ucan.xyz", "UCANs")}, so your data and identity truly remain yours.`)),
    heading("Get started"),
    row(paragraph("Install Tiles for macOS or Linux, read the manual, or join the community shaping what comes next.")),
    button("https://tiles.run/download", "Download Tiles"),
    row(paragraph(`${link("https://tiles.run/book/manual", "Read the manual")} · ${link("https://discord.gg/PPSjcpZzvt", "Join Discord")}`)),
    row(paragraph("Reply anytime with feedback. Your notes help shape what we build next.") +
      paragraph(`- ${link("https://www.tilesprivacy.org", "Tiles Privacy")}`)),
  ].join("")

  return {
    subject,
    html: renderEmailTemplate({
      subject,
      preheader: "Product notes, privacy research, release updates, and engineering notes from the Tiles team.",
      content,
    }),
  }
}
