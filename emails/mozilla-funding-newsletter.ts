export const FUNDING_NEWSLETTER_SUBJECT =
  "Tiles Privacy joins Mozilla Foundation’s Human-Scale AI Incubator";

export const FUNDING_NEWSLETTER_PREHEADER =
  "18 months to build private, user-owned AI. Here’s what comes next.";

export const FUNDING_BLOG_URL =
  "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator";

const INCUBATOR_URL =
  "https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/";
const FONT =
  "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
const BODY_STYLE = `color:#333333; font-family:${FONT}; font-size:16px; line-height:26px; font-weight:400;`;
const HEADING_STYLE = `margin:0; color:#111111; font-family:${FONT}; font-size:22px; line-height:28px; font-weight:600; letter-spacing:0;`;
const LINK_STYLE = "color:#111111; text-decoration:underline;";
const FUNDING_STYLES = `
<style>
  @media (prefers-color-scheme: dark) {
    .funding-logo-light { display: none !important; }
    .funding-logo-dark { display: inline-block !important; max-height: none !important; overflow: visible !important; }
    .funding-apply-cta {
      background-color: #ffffff !important;
      background: #ffffff !important;
      border-color: #ffffff !important;
    }
  }
  [data-ogsc] .funding-apply-cta, [data-ogsb] .funding-apply-cta {
    background-color: #ffffff !important;
    background: #ffffff !important;
    border-color: #ffffff !important;
  }
  [data-ogsc] .funding-logo-light, [data-ogsb] .funding-logo-light { display: none !important; }
  [data-ogsc] .funding-logo-dark, [data-ogsb] .funding-logo-dark { display: inline-block !important; max-height: none !important; overflow: visible !important; }
</style>`;

/**
 * Reuse the welcome email's masthead, layout, and footer, with scoped CTA styles.
 * This is a draft renderer only; it does not create or send a broadcast.
 */
export function buildFundingNewsletter(welcomeHtml: string): string {
  const startMarker = "<!-- newsletter-content:start -->";
  const endMarker = "<!-- newsletter-content:end -->";
  const start = welcomeHtml.indexOf(startMarker);
  const end = welcomeHtml.indexOf(endMarker);

  if (start === -1 || end <= start) {
    throw new Error(
      "Welcome email content markers missing. Run npm run sync:email-preview.",
    );
  }

  // Markers sit inside the first content cell and the footer cell respectively.
  // Keep the same table structure and spacing as the welcome email.
  const content = `
    <h2 class="section-title" style="${HEADING_STYLE}">We’re joining Mozilla Foundation’s Human-Scale AI Incubator</h2>
  </td>
</tr>
<tr>
  <td style="padding:8px 0 28px 0;">
    <a href="${FUNDING_BLOG_URL}" style="display:block; text-decoration:none;">
      <img src="https://www.tiles.run/email-mozilla-funding.jpg" width="560" height="294" alt="Tiles and Mozilla Foundation logos beside a hand holding a glowing data center" style="display:block; width:100%; max-width:560px; height:auto; border:0; border-radius:8px;" />
    </a>
  </td>
</tr>
<tr>
  <td style="padding:0 0 24px 0;">
    <p class="body-copy" style="margin:0 0 12px 0; ${BODY_STYLE}">Hi there,</p>
    <p class="body-copy" style="margin:0 0 16px 0; ${BODY_STYLE}">Tiles Privacy has joined Mozilla Foundation’s <a href="${INCUBATOR_URL}" style="${LINK_STYLE}">Human-Scale AI Incubator</a> as one of three anchor projects.</p>
    <p class="body-copy" style="margin:0 0 16px 0; ${BODY_STYLE}">I started Tiles with a simple belief: as AI assistants access more of our lives, the risk of data leaks will make privacy mainstream, and people will demand control of their data and identity.</p>
    <p class="body-copy" style="margin:0 0 16px 0; ${BODY_STYLE}">Mozilla’s support gives us 18 months of runway to build that future without giving up equity or control. We’re focusing on private, user-owned AI and humane software, without ads or addictive mechanics.</p>
    <p class="body-copy" style="margin:0 0 16px 0; ${BODY_STYLE}">We’ll work with nonprofits and educational institutions on pilots serving charitable and public-interest goals, and open-source a governance and safeguarding framework that other organizations can adapt.</p>
    <p class="body-copy" style="margin:0; ${BODY_STYLE}">Thank you to Mozilla Foundation, our sponsors, advisors, and everyone in the User &amp; Agents community who helped us reach this milestone.</p>
  </td>
</tr>
<tr>
  <td style="padding:0 0 24px 0;">
    <p class="body-copy" style="margin:0; ${BODY_STYLE}"><a href="${FUNDING_BLOG_URL}" style="${LINK_STYLE}">Read the full post</a></p>
  </td>
</tr>
<tr>
  <td style="padding:0 0 28px 0;">
    <p class="body-copy" style="margin:0; ${BODY_STYLE}">Ankesh Bharti<br>Founder &amp; CEO, Tiles Privacy</p>
  </td>
</tr>
<tr>
  <td class="email-divider" style="padding:28px 0 12px 0; border-top:1px solid #e5e5e5;">
    <h2 class="section-title" style="${HEADING_STYLE}">Come build with us</h2>
  </td>
</tr>
<tr>
  <td style="padding:0 0 24px 0;">
    <p class="body-copy" style="margin:0 0 12px 0; ${BODY_STYLE}">Seven more spots are open now with up to $500k per project over two years in non-dilutive funding.</p>
    <p class="body-copy" style="margin:0; ${BODY_STYLE}">If you’re building AI for a language, place, or need that mainstream systems overlook, apply to join the cohort by November 20, 2026.</p>
  </td>
</tr>
<tr>
  <td style="padding:0 0 28px 0;">
    <table role="presentation" align="left" cellpadding="0" cellspacing="0" border="0" class="download-cta-shell" style="width:auto; border-collapse:separate; border-spacing:0; color-scheme:light dark; supported-color-schemes:light dark;">
      <tr>
        <td bgcolor="#111111" class="download-cta-cell funding-apply-cta" style="mso-padding-alt:10px 20px; border-radius:6px; background-color:#111111; border:1px solid #111111;">
          <a href="${INCUBATOR_URL}" class="download-cta-link" style="display:inline-block; padding:10px 20px; mso-padding-alt:0; box-sizing:border-box; text-align:center; white-space:nowrap; color:#ffffff; -webkit-text-fill-color:#ffffff; font-family:${FONT}; font-size:15px; line-height:22px; font-weight:500; text-decoration:none; border-radius:6px;"><span style="display:inline-block; vertical-align:middle; line-height:22px;">Apply to join</span><span aria-hidden="true" data-skip-in-text="true" style="display:inline-block; padding-left:8px; vertical-align:middle; font-family:Arial,sans-serif; font-size:18px; line-height:22px;">&#8594;</span></a>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td class="email-divider" style="padding:28px 0 0 0; border-top:1px solid #e5e5e5;">
    <p style="margin:0 0 20px 0; text-align:center;">
      <a href="https://www.tiles.run" style="display:inline-block; color:#111111; font-family:${FONT}; font-size:20px; line-height:32px; font-weight:600; letter-spacing:-0.5px; text-decoration:none; white-space:nowrap;"><img class="funding-logo-light" src="https://www.tiles.run/lighticon.png" width="32" height="32" alt="" style="display:inline-block; width:32px; height:32px; margin-right:8px; vertical-align:middle; border:0;" /><!--[if !mso]><!--><span class="funding-logo-dark" style="display:none; max-height:0; overflow:hidden; mso-hide:all; vertical-align:middle;"><img src="https://www.tiles.run/grey.png" width="32" height="32" alt="" style="display:block; width:32px; height:32px; margin-right:8px; border:0;" /></span><!--<![endif]--><span style="vertical-align:middle;">Tiles Privacy</span></a>
    </p>
`;

  return (
    welcomeHtml.slice(0, start) +
    content +
    welcomeHtml.slice(end + endMarker.length)
  )
    .replace("</head>", `${FUNDING_STYLES}\n</head>`)
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${FUNDING_NEWSLETTER_SUBJECT}</title>`,
    )
    .replace(
      /(<div\b[^>]*class="preheader"[^>]*>)[\s\S]*?(<\/div>)/,
      `$1${FUNDING_NEWSLETTER_PREHEADER}$2`,
    );
}
