/** Set to true when Remote Link is ready to show in marketing UI again. */
export const SHOW_REMOTE_LINK = false

/**
 * Set to true when Polar billing goes live at the 0.5.0 Private Beta.
 *
 * While false, `/pricing` renders as a placeholder (no checkout link) and the
 * Polar API routes short-circuit before touching the SDK. Flipping this alone
 * is not enough: real Polar credentials also have to replace the spoofed
 * placeholders in `lib/polar.ts`. See "Polar.sh Integration" in AGENTS.md.
 */
export const POLAR_BILLING_ENABLED: boolean = false
