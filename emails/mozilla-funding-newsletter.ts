import {
  renderEmailTemplate,
  EMAIL_FONT as FONT,
  EMAIL_BODY_STYLE as BODY_STYLE,
  EMAIL_HEADING_STYLE as HEADING_STYLE,
  EMAIL_LINK_STYLE as LINK_STYLE,
} from "./template";

export const FUNDING_NEWSLETTER_SUBJECT =
  "Tiles Privacy joins Mozilla Foundation’s Human-Scale AI Incubator";

export const FUNDING_NEWSLETTER_PREHEADER =
  "18 months to build private, user-owned AI. Here’s what comes next.";

export const FUNDING_BLOG_URL =
  "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator";

const INCUBATOR_URL =
  "https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/";
/** Build the funding campaign with the sole shared Tiles email design. */
export function buildFundingNewsletter(): string {
  const content = `<tr>
  <td style="padding:0 0 12px 0;">
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
    <p class="body-copy" style="margin:0; ${BODY_STYLE}">Thank you to Mozilla Foundation, our sponsors, advisors, and everyone in the <a href="https://www.userandagents.org/" style="${LINK_STYLE}">User &amp; Agents</a> community who helped us reach this milestone.</p>
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
</tr>`;

  return renderEmailTemplate({
    subject: FUNDING_NEWSLETTER_SUBJECT,
    preheader: FUNDING_NEWSLETTER_PREHEADER,
    content,
  });
}
