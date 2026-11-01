import { defineEnvVars } from "@sveltejs/kit/env"

// Every environment variable the site reads. Private ones come from
// `$app/env/private` (server only), public ones from `$app/env/public`.
// All are optional so local dev works without secrets; code that needs one
// checks for it and fails closed in production.

const optional = (value: string | undefined) => value?.trim() || undefined

export const variables = defineEnvVars({
  // Public, inlined at build time
  PUBLIC_SITE_URL: {
    public: true,
    static: true,
    schema: optional,
    description: "Canonical origin. Defaults to https://www.tiles.run; set to http://localhost:5173 in dev.",
  },
  PUBLIC_TURNSTILE_SITE_KEY: { public: true, static: true, schema: optional, description: "Cloudflare Turnstile site key" },

  // Newsletter
  RESEND_API_KEY: { schema: optional },
  RESEND_FROM_EMAIL: { schema: optional, description: 'Sender, e.g. "newsletter@tiles.run"' },
  RESEND_AUDIENCE_ID: { schema: optional, description: "Resend audience that newsletter signups are added to" },
  TURNSTILE_SECRET_KEY: { schema: optional },
  UPSTASH_REDIS_REST_URL: { schema: optional },
  UPSTASH_REDIS_REST_TOKEN: { schema: optional },

  // Polar billing
  POLAR_ACCESS_TOKEN: { schema: optional },
  POLAR_WEBHOOK_SECRET: { schema: optional },
  POLAR_SERVER: { schema: optional, description: '"production" (default) or "sandbox"' },
  POLAR_PRO_CHECKOUT_LINK: { schema: optional },
  POLAR_PLUS_CHECKOUT_LINK: { schema: optional },
  POLAR_PRO_PRODUCT_ID: { schema: optional },
  POLAR_PLUS_PRODUCT_ID: { schema: optional },

  // GitHub API (releases, stars). Optional, raises the rate limit.
  GITHUB_TOKEN: { schema: optional },
})
