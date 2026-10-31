# Tiles email template

The Mozilla funding newsletter is the reference design for all Tiles emails.

- `template.ts` owns the single shared layout, typography, light/dark colors, logo treatment, and footer.
- `mozilla-funding-newsletter.ts` supplies the funding campaign content through `buildFundingNewsletter()`.
- `lib/email-messages.ts` supplies signup, download, and giveaway confirmation content using that same layout. These are message bodies, not separate designs.

Keep new newsletters on this template. Do not copy the HTML into a new standalone layout or restore the retired Resend-hosted template IDs.

The footer uses the black Tiles mark on light backgrounds and the white mark on dark backgrounds. The swap supports `prefers-color-scheme` and Outlook's `data-ogsc`/`data-ogsb` selectors. Clients that strip all theme CSS receive the inline light-mode fallback.

## Preview and export

Run `npm run sync:email-preview` after editing the template or campaign. This regenerates `email-preview.html` from the funding renderer. For continuous regeneration, run `npm run sync:email-preview:watch`.

With the development server running, open `/email-previews` or `/email-previews/mozilla-funding`. The latter accepts `?theme=light`, `?theme=dark`, and `?format=text`. Preview routes are disabled in production.

Use `buildFundingNewsletter()` for sendable HTML, and `toPlainText(html)` from `@react-email/render` for the plain-text alternative. Do not send forced-theme preview HTML. For a Resend broadcast, replace the mailto unsubscribe link with Resend's managed unsubscribe URL placeholder before sending.

The transactional routes send this shared HTML directly, with a matching plain-text alternative. Saved legacy templates in Resend are no longer referenced by the website.
