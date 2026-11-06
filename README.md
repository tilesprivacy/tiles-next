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

Site search (the magnifier in the top bar, `Ctrl K` / `⌘K`) reads a Pagefind
index built from the prerendered pages, so it finds nothing in `npm run dev`
until you run `npm run search:index` once. That does a production build and
writes the index to `static/_pagefind/` (gitignored). Rerun it to pick up
content changes.

## Build and deploy

```sh
npm run build    # OG images, vite build, then the Pagefind search index
npm run preview  # the built Worker under wrangler, with secrets from .dev.vars
npm run deploy   # build, then wrangler deploy
```

`scripts/og-images.ts` draws the Open Graph cards into `static/og/generated/`
(gitignored) before the Vite build. After it, Pagefind indexes the prerendered
pages in `.svelte-kit/cloudflare` into `.svelte-kit/cloudflare/_pagefind/`,
which deploys with the other static assets. Redirects live in `_redirects`, security
headers in `_headers` and `src/hooks.server.ts`.

Production builds read blog posts from the Tiles PDS (see below), so a build
fails if the PDS can't be reached or has no posts yet.

`.github/workflows/deploy.yml` deploys every push to `main`: it publishes blog
posts to the PDS first, then builds and runs `wrangler deploy`. It needs these
GitHub settings:

| Name | Kind | Value |
| --- | --- | --- |
| `ATP_IDENTIFIER` | secret | `tiles.run` |
| `ATP_APP_PASSWORD` | secret | an app password for that account |
| `PDS_URL` | secret | `https://eurosky.social` |
| `CLOUDFLARE_API_TOKEN` | secret | token with Workers edit access |
| `CLOUDFLARE_ACCOUNT_ID` | secret | the Cloudflare account id |
| `PUBLIC_TURNSTILE_SITE_KEY` | variable | Turnstile site key (public) |

Don't also connect Cloudflare Workers Builds: it would deploy before new posts
reach the PDS.

`.github/workflows/preview.yml` builds every pull request and uploads it to a
separate Worker, `tiles-site-preview`, then comments the PR's preview address
(`https://pr-<number>-tiles-site-preview.<subdomain>.workers.dev`). That Worker
has no secrets, database or routes, so previews can't send email or touch
production data. It uses the same two Cloudflare secrets.

## Shared-chat viewer

`chat.tiles.run` is served by this Worker from `src/routes/chat/` (see the
"Shared-chat viewer" section of `AGENTS.md`). In dev open
`http://localhost:5173/chat/<token>`; on any other host a production build
redirects `/chat/*` to chat.tiles.run. To try the real host locally, run
`npx wrangler dev --local-upstream chat.tiles.run` after a build.

It needs, once, in Cloudflare (zone tiles.run):

- DNS: `chat` as a proxied record (for example `AAAA chat 100::`, proxied), in
  place of the old record pointing at Vercel.
- Worker route: `chat.tiles.run/*` to this Worker (add it to `routes` in
  `wrangler.jsonc`).
- Rules > Transform Rules > URL Rewrite: when
  `(http.host eq "chat.tiles.run" and not starts_with(http.request.uri.path, "/_app/") and http.request.uri.path.extension eq "")`,
  rewrite the path dynamically to `concat("/chat", http.request.uri.path)`.

## Environment

Every variable is declared in `src/env.ts` and listed with a comment in
`.env.example`. `vite dev` reads `.env`; `wrangler dev` reads the server-only
ones from `.dev.vars` (see `.dev.vars.example`). In production set secrets
with `wrangler secret put NAME`.

| Variable | Needed for |
| --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Bot check on the newsletter form (required in production) |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_SEGMENT_ID` | Confirmation and welcome emails; storing confirmed subscribers |
| `NEWSLETTER_TOKEN_KEY` | Encrypts newsletter confirmation links (required in production) |
| `POLAR_*` | Checkout and webhooks on `/pricing` |
| `GITHUB_TOKEN` | Optional, raises the GitHub API rate limit for release data |
| `PUBLIC_SITE_URL` | Canonical origin |
| `PUBLIC_DEPLOYMENT` | `preview` in PR preview builds only |

Without the production secrets the newsletter endpoint answers 503 rather than
sending unchecked email.

## Add a blog post

1. Add `content/blog/<slug>.md` with frontmatter like the existing posts
   (`title`, `description`, `publishDate`, `author`, images). Put images in
   `static/`. `content/blog/README.md` has the writing conventions.
2. Check it with `npm run dev`: in dev the site renders the local files.
   `draft: true` keeps a post local only.
3. Push to `main`. The Deploy workflow publishes the post to the Tiles PDS
   (`scripts/publish-blog.ts`), then builds tiles.run from the records on the
   PDS. Posts are matched to records by slug; nothing is committed back.

To publish by hand, or to preview what would change:

```sh
ATP_IDENTIFIER=tiles.run ATP_APP_PASSWORD=... npm run blog:dry-run
ATP_IDENTIFIER=tiles.run ATP_APP_PASSWORD=... npm run blog:publish
```

The post then appears on `/blog`, in the RSS feed, the sitemap and `/llms.txt`.
