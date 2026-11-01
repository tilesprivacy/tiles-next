# tiles.run

The Tiles website: SvelteKit on Cloudflare Workers. Pages are prerendered to
static HTML; a small Worker serves the few dynamic routes (newsletter signup,
live release and status data, Polar checkout).

## Run

Requires Node 22.17 or later.

```sh
npm ci
cp .env.example .env   # optional; every variable has a dev fallback
npm run dev            # http://localhost:5173
```

`npm run check` type-checks the project. CI runs it and a full build on every
push and pull request.

## Build and deploy

```sh
npm run build    # OG images, then vite build
npm run preview  # the built Worker under wrangler, with secrets from .dev.vars
npm run deploy   # build, then wrangler deploy
```

`scripts/og-images.ts` draws the Open Graph cards into `static/og/generated/`
(gitignored) before the Vite build. Redirects live in `_redirects`, security
headers in `_headers` and `src/hooks.server.ts`.

To deploy from GitHub instead, connect the repository in Cloudflare Workers
Builds (build command `npm run build`, deploy command `npx wrangler deploy`),
or add a deploy job that runs `npm run deploy` with a `CLOUDFLARE_API_TOKEN`
secret.

## Environment

Every variable is declared in `src/env.ts` and listed with a comment in
`.env.example`. `vite dev` reads `.env`; `wrangler dev` reads the server-only
ones from `.dev.vars` (see `.dev.vars.example`). In production set secrets
with `wrangler secret put NAME`.

| Variable | Needed for |
| --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Bot check on the newsletter form (required in production) |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_AUDIENCE_ID` | Storing signups and sending the welcome email |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Signup rate limits (required in production) |
| `POLAR_*` | Checkout and webhooks on `/pricing` |
| `GITHUB_TOKEN` | Optional, raises the GitHub API rate limit for release data |
| `PUBLIC_SITE_URL` | Canonical origin |

Without the production secrets the newsletter endpoint answers 503 rather than
sending unchecked email.

## Add a blog post

1. Add `content/blog/<slug>.md` with frontmatter like the existing posts
   (`title`, `description`, `publishDate`, `author`, images). Put images in
   `static/`.
2. Set `draft: true` to keep it visible only in `npm run dev`.
3. Merge to `main`. The `Publish blog` workflow publishes the post to the
   Tiles PDS with [Sequoia](https://tangled.org/stevedylan.dev/sequoia)
   (`sequoia.json`) and commits the record's `atUri` back into the
   frontmatter. It needs the `ATP_IDENTIFIER`, `ATP_APP_PASSWORD` and `PDS_URL`
   repository secrets. `npm run blog:dry-run` previews what it would publish.

The post then appears on `/blog`, in the RSS feed, the sitemap and `/llms.txt`.
