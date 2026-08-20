/** Set to true when Remote Link is ready to show in marketing UI again. */
export const SHOW_REMOTE_LINK = false

/** Set to true once the offline installer has been uploaded to the download bucket. */
export const SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE = true

/**
 * Master switch for AI answers in the site search. Off hides the sparkle on
 * the magnifier icon and the whole ask-AI flow (submit arrow, Enter hint,
 * answer panel), and makes `/api/ai-search` return 503. Full-text page
 * search keeps working. Set to true to bring AI answers back.
 */
export const AI_SEARCH_ANSWERS_ENABLED: boolean = false

/**
 * Master switch for Polar billing. On, so `/pricing` offers a real checkout.
 *
 * This alone does not make checkout work: `POLAR_ACCESS_TOKEN` must also be set
 * in the environment, otherwise `isPolarCheckoutConfigured()` in `lib/polar.ts`
 * stays false, the Subscribe action renders disabled, and the route returns
 * 503. Set this to false to take billing down without touching secrets.
 * See "Polar.sh Integration" in AGENTS.md.
 */
export const POLAR_BILLING_ENABLED: boolean = true
