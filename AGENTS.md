# Agent Instructions

## Layout Preferences

### Mobile View
- **No scrolling**: The mobile view should never scroll. All content must fit within a single viewport (`100dvh`).
- Use `h-[100dvh]` with `overflow-hidden` to enforce this constraint.
- Content should be vertically centered and adjust flexibly to fit the screen.

## Footer Consistency

### Footer Links
- All footers across pages (home, about, etc.) must remain consistent.
- The developer link should always be:
  - **Text**: "Book"
  - **URL**: `https://tiles.run/book`

## llms.txt Endpoint Maintenance

### Automatic Content Synchronization
- The `/llms.txt` endpoint is **dynamically generated** from all website content via `app/api/llms/route.ts`.
- The endpoint automatically includes:
  - Homepage content
  - Mission page (including contributors and sponsors)
  - Download page
  - Blog listing and all blog posts
  - All book pages (from `content/*.mdx` files)
- **No manual updates needed**: The endpoint automatically reflects all content changes.

### When Content is Updated
Whenever you update any of the following, the `/llms.txt` endpoint will automatically reflect those changes:
- **Page content**: Any changes to `app/*/page.tsx` files (home, mission, download, blog)
- **Blog posts**: Updates to `lib/blog-posts.ts` or blog post content
- **Book pages**: Changes to any `content/*.mdx` files
- **Contributors/Sponsors**: Updates to the mission page contributors or sponsors sections

### Verification
- After making content changes, verify the `/llms.txt` endpoint reflects the updates by:
  1. Starting the development server: `npm run dev` (or equivalent)
  2. Visiting `http://localhost:3000/llms.txt` to see the generated content
  3. Checking that all updated content appears correctly in the text output

### Static File (if present)
- If a static `public/llms.txt` file exists, it should be **removed** or **ignored** in favor of the dynamic endpoint.
- The dynamic endpoint at `/llms.txt` (via rewrite from `/api/llms`) is the source of truth.

## Hero Wireframe Image (Next.js Image)

### Implementation
- The hero MacBook wireframe is served as **WebP** (`public/wireframe.webp`) for fast first load. The source asset is the large SVG at `public/wireframe.svg` (embedded PNG); `wireframe.webp` is generated from it.
- The hero uses **Next.js `<Image>`** with `src="/wireframe.webp"`, `priority` (for LCP), and fixed dimensions (800×600) for layout stability.

### Regenerating the WebP
- If you change `public/wireframe.svg`, run: `npm run generate:wireframe`
- This overwrites `public/wireframe.webp`.

## Cursor Cloud specific instructions

### Service overview
- **Single service**: Next.js 16 website (Tiles Privacy marketing/docs site). No database, no Docker.
- Dev server: `pnpm dev` → `http://localhost:3000`
- Build: `pnpm build` (runs `next build` + Pagefind indexing)
- Lint: `pnpm lint` (note: ESLint is referenced but not installed as a dependency and no config file exists; this command will fail)

### Gotchas
- **pnpm build scripts**: `@tailwindcss/oxide` and `sharp` require build-script approval. The `pnpm.onlyBuiltDependencies` field in `package.json` handles this non-interactively. If you see "Ignored build scripts" warnings after `pnpm install`, ensure that field is present.
- **TypeScript version**: The lockfile pins TypeScript 5.0.2, which triggers peer-dependency warnings from `nextra`/`@shikijs/twoslash` (wants >=5.5). Build still succeeds because `ignoreBuildErrors: true` is set in `next.config.mjs`.
- **No external services needed**: The Resend email API (`RESEND_API_KEY`) is optional and only used by the `/api/subscribe` newsletter endpoint. The site works fully without it.
- **Pagefind search**: Only available after a full `pnpm build`; not active during `pnpm dev`.
