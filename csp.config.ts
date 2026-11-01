// Content Security Policy for every page. Add an origin here only when a
// feature really needs it, and say which feature in a comment.
export const cspDirectives = {
  "default-src": ["self"],
  "script-src": [
    "self",
    "https://challenges.cloudflare.com", // Turnstile on the newsletter form
    "https://sniperl.ink", // "Open in Gmail" button after subscribing
    "wasm-unsafe-eval", // site search: Pagefind runs its index lookups in WebAssembly
  ],
  "style-src": ["self", "unsafe-inline"],
  "img-src": ["self", "data:", "blob:", "https:"],
  "media-src": ["self"],
  "font-src": ["self"],
  "connect-src": [
    "self",
    "https://public.api.bsky.app", // blog post discussion (Bluesky replies) and author avatars
  ],
  "frame-src": [
    "https://challenges.cloudflare.com", // Turnstile
    "https://polar.sh", // embedded checkout on /pricing
    "https://buy.polar.sh",
    "https://sandbox.polar.sh",
    "https://www.youtube-nocookie.com", // talk recording on /blog/own-your-ai and /tiles-at-india-foss
  ],
  "object-src": ["none"],
  "base-uri": ["self"],
  "form-action": ["self"],
  "upgrade-insecure-requests": true,
} as const
