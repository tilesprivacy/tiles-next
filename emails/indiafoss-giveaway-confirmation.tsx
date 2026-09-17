import type { CSSProperties } from "react"

export type IndiaFossGiveawayConfirmationEmailProps = {
  fullName: string
  trackLabel: string
  responseItems: Array<{ label: string; value: string }>
  siteUrl?: string
}

const fontFamily = "Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const displayFontFamily = "'Geist Email', Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const socialLinks = [
  { label: "X", href: "https://x.com/tilesprivacy", icon: "x" },
  { label: "Bluesky", href: "https://bsky.app/profile/tiles.run", icon: "bluesky" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tilesprivacy/", icon: "linkedin" },
  { label: "Discord", href: "https://go.tiles.run/discord", icon: "discord" },
  { label: "GitHub", href: "https://github.com/tilesprivacy", icon: "github" },
  { label: "Tangled", href: "https://tangled.org/tiles.run", icon: "tangled" },
  { label: "Hugging Face", href: "https://huggingface.co/tilesprivacy", icon: "huggingface" },
]

export function IndiaFossGiveawayConfirmationEmail({
  fullName,
  trackLabel,
  responseItems,
  siteUrl = "https://www.tiles.run",
}: IndiaFossGiveawayConfirmationEmailProps) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "")

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <title>We received your IndiaFOSS 2026 giveaway entry</title>
        <style>{`@font-face{font-family:'Geist Email';font-style:normal;font-weight:600 700;src:url('${normalizedSiteUrl}/fonts/geist-tiles-bold.ttf') format('truetype');}`}</style>
      </head>
      <body style={styles.body}>
        <div style={styles.preview}>Your IndiaFOSS 2026 giveaway entry has been received.</div>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={styles.outerTable}>
          <tbody>
            <tr>
              <td align="center" style={styles.outerCell}>
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={styles.container}>
                  <tbody>
                    <tr>
                      <td style={styles.header}>
                        <table role="presentation" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={styles.logoCell}>
                                <img src={`${normalizedSiteUrl}/lighticon.png`} width="34" height="34" alt="Tiles Privacy" style={styles.logo} />
                              </td>
                              <td style={styles.wordmark}>Tiles Privacy</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.content}>
                        <p style={styles.kicker}>IndiaFOSS 2026 giveaway</p>
                        <h1 style={styles.heading}>We received your entry</h1>
                        <p style={styles.paragraph}>Hi {fullName},</p>
                        <p style={styles.paragraph}>Your IndiaFOSS 2026 giveaway entry has been received.</p>
                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={styles.statusCard}>
                          <tbody>
                            <tr>
                              <td style={styles.statusCell}>
                                <p style={styles.statusLabel}>Application track</p>
                                <p style={styles.statusValue}>{trackLabel}</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p style={styles.paragraph}>Submitting an entry does not guarantee selection. We will contact selected applicants at this email address.</p>
                        <p style={styles.paragraph}>If selected, your conference ticket code and, for travel-grant recipients, flight ticket will follow by email shortly, within a couple of days.</p>
                        <h2 style={styles.responseHeading}>Your submitted response</h2>
                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={styles.responseTable}>
                          <tbody>
                            {responseItems.map((item) => (
                              <tr key={item.label}>
                                <td style={styles.responseLabel}>{item.label}</td>
                                <td style={styles.responseValue}>{item.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p style={styles.supportNote}>If you have any questions, you can reach us anytime using the contact details in the footer below.</p>
                        <p style={styles.signoff}>Ankesh Bharti</p>
                        <p style={styles.signoffTitle}>Founder and CEO, Tiles Privacy</p>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.footer}>
                        <p style={styles.footerStrong}>Tiles Privacy Technologies Pvt. Ltd.</p>
                        <p style={styles.footerText}>WeWork Prestige Atlanta, 80 Feet Rd, Koramangala<br />Bengaluru, IN 560034</p>
                        <table role="presentation" cellPadding="0" cellSpacing="0" style={styles.socialTable}>
                          <tbody>
                            <tr>
                              {socialLinks.map((social) => (
                                <td key={social.label} style={styles.socialCell}>
                                  <a href={social.href} title={social.label} style={styles.socialLink}>
                                    <img
                                      src={`${normalizedSiteUrl}/email-social-${social.icon}.png`}
                                      width="18"
                                      height="18"
                                      alt={`${social.label} profile`}
                                      style={styles.socialIcon}
                                    />
                                  </a>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                        <p style={styles.footerText}>
                          <a href="mailto:hello@tiles.run" style={styles.footerLink}>hello@tiles.run</a>
                          <span> · </span>
                          <a href="tel:+917338014129" style={styles.footerLink}>+91 7338014129</a>
                          <span> · </span>
                          <a href={normalizedSiteUrl} style={styles.footerLink}>tiles.run</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "#fbfbfb",
    color: "#1d1d1f",
    fontFamily,
    colorScheme: "light",
  },
  preview: {
    display: "none",
    maxHeight: 0,
    overflow: "hidden",
    opacity: 0,
  },
  outerTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fbfbfb",
  },
  outerCell: {
    padding: "32px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    border: "1px solid #d2d2d7",
    borderRadius: "14px",
  },
  header: {
    padding: "24px 32px",
    borderBottom: "1px solid #d2d2d7",
  },
  logoCell: {
    width: "44px",
    verticalAlign: "middle",
  },
  logo: {
    display: "block",
    width: "34px",
    height: "34px",
    objectFit: "contain",
  },
  wordmark: {
    verticalAlign: "middle",
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  content: {
    padding: "40px 32px 36px",
  },
  kicker: {
    margin: "0 0 12px",
    color: "#6e6e73",
    fontSize: "13px",
    fontWeight: 600,
  },
  heading: {
    margin: "0 0 28px",
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: 1.12,
    letterSpacing: "-0.045em",
  },
  paragraph: {
    margin: "0 0 18px",
    color: "#6e6e73",
    fontSize: "16px",
    lineHeight: 1.65,
  },
  statusCard: {
    margin: "26px 0",
    borderCollapse: "separate",
    borderSpacing: 0,
    backgroundColor: "#f7ff61",
    border: "1px solid #d9df48",
    borderRadius: "14px",
  },
  statusCell: {
    padding: "18px 20px",
  },
  statusLabel: {
    margin: "0 0 6px",
    color: "#5a5e14",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  statusValue: {
    margin: 0,
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: 1.45,
  },
  responseHeading: {
    margin: "30px 0 14px",
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "20px",
    lineHeight: 1.3,
    letterSpacing: "-0.025em",
  },
  responseTable: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #d2d2d7",
  },
  responseLabel: {
    width: "38%",
    padding: "11px 12px",
    verticalAlign: "top",
    backgroundColor: "#f5f5f7",
    borderBottom: "1px solid #d2d2d7",
    color: "#6e6e73",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  responseValue: {
    padding: "11px 12px",
    verticalAlign: "top",
    borderBottom: "1px solid #d2d2d7",
    color: "#1d1d1f",
    fontSize: "13px",
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  supportNote: {
    margin: "24px 0 18px",
    color: "#6e6e73",
    fontSize: "16px",
    lineHeight: 1.65,
  },
  signoff: {
    margin: "28px 0 0",
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "16px",
    fontWeight: 600,
  },
  signoffTitle: {
    margin: "4px 0 0",
    color: "#6e6e73",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  footer: {
    padding: "24px 32px 28px",
    backgroundColor: "#f5f5f7",
    borderTop: "1px solid #d2d2d7",
  },
  footerStrong: {
    margin: "0 0 8px",
    color: "#1d1d1f",
    fontFamily: displayFontFamily,
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.6,
  },
  footerText: {
    margin: "0 0 7px",
    color: "#6e6e73",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  socialTable: {
    margin: "16px 0 14px",
    borderCollapse: "collapse",
  },
  socialCell: {
    padding: "0 12px 0 0",
    lineHeight: 0,
  },
  socialLink: {
    display: "inline-block",
    textDecoration: "none",
  },
  socialIcon: {
    display: "block",
    width: "18px",
    height: "18px",
    border: 0,
  },
  footerLink: {
    color: "#1d1d1f",
    textDecoration: "underline",
  },
}

export default IndiaFossGiveawayConfirmationEmail
