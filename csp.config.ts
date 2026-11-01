// Content Security Policy for every page. Add an origin here only when a
// feature really needs it, and say which feature in a comment.
export const cspDirectives = {
  "default-src": ["self"],
  "script-src": [
    "self",
    "https://challenges.cloudflare.com", // Turnstile on the newsletter form
    "https://sniperl.ink", // "Open in Gmail" button after subscribing
    "https://static.cloudflareinsights.com", // Web Analytics, only after consent
  ],
  "style-src": ["self", "unsafe-inline"],
  "img-src": ["self", "data:", "blob:", "https:"],
  "media-src": ["self"],
  "font-src": ["self"],
  "connect-src": [
    "self",
    "https://cloudflareinsights.com", // Web Analytics beacon
  ],
  "frame-src": [
    "https://challenges.cloudflare.com", // Turnstile
    "https://polar.sh", // embedded checkout on /pricing
    "https://buy.polar.sh",
    "https://sandbox.polar.sh",
  ],
  "object-src": ["none"],
  "base-uri": ["self"],
  "form-action": ["self"],
  "upgrade-insecure-requests": true,
} as const
