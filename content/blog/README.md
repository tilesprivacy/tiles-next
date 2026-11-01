# Writing a blog post

A post is one markdown file here: `content/blog/<slug>.md` becomes `/blog/<slug>`.
Commit it and you're done. The site lists and renders it at build time, and CI
publishes it to ATproto (standard.site) with sequoia, then commits the record's
`atUri` back into the frontmatter. Don't write `atUri` yourself.

The body is published to ATproto as well, so write plain markdown that reads
well anywhere. The site styles it; the few HTML conventions below cover the rest.

## Frontmatter

```yaml
---
title: "Ship it up"
description: "How we package and ship Tiles"
publishDate: "2026-04-05"          # YYYY-MM-DD; newest posts are listed first
author: "anandu-pavanan"           # person id from src/lib/people.ts
tags:                              # sent to ATproto; also the page keywords
  - Tiles
  - packaging
ogImage: "/shipitup.png"           # social card, PNG/JPEG/WebP (not SVG)
coverImage: "/shipitup.png"        # shown above the post and in the listing
---
```

Optional fields:

| Field | Default | What it does |
| --- | --- | --- |
| `draft` | `false` | `true` keeps the post off the site except in `npm run dev`, and out of ATproto. |
| `updatedAt` | | Last edit date, YYYY-MM-DD. |
| `coverImageDark` | | Cover for dark mode. |
| `coverAlt` | title | Alt text for the cover. |
| `coverWidth` / `coverHeight` | 1200 / 600 | Cover size, so the page doesn't jump while it loads. |
| `showCover` | `true` | `false` uses the cover only for the listing and social cards. |
| `listingImage` / `listingImageDark` | cover | Square-cropped picture in the post list. |
| `listingImagePosition` | `center` | `left` or `right` to choose the crop. |
| `ogImageWidth` / `ogImageHeight` / `ogImageAlt` | 1200 / 630 / cover alt | Social card details. |
| `keywords` | `tags` | Page keywords when they should differ from the ATproto tags. |
| `section` | | Article section, e.g. `Engineering`. |
| `twitterCreator` | | Author's X handle for the card, e.g. `"@madcla.ws"`. |
| `blueskyPostUri` | | `at://…/app.bsky.feed.post/…` of the announcement; its replies become the Discussion section. |
| `toc` | `true` | `false` hides the table of contents. |
| `bodyClass` | | Extra class around the body, for a post with its own rules in `src/app.css`. |

## Writing

- Headings: start at `##`. They make up the table of contents. A leading `# Title` is dropped, since the page shows the title.
- Links to other sites open in a new tab.
- Code blocks: fence them. ` ```rust ` and ` ```json ` are highlighted (JSON gets a Wrap button); anything else is shown as plain monospace.

## Images and video

Put files in `static/` and refer to them from the root, e.g. `/my-post-diagram.png`.

A screenshot (full width, rounded, thin border). Give the size so space is reserved while it loads:

```html
<img src="/installer.jpg" alt="The installer's welcome screen" width="1242" height="882" />
```

`![alt](/installer.jpg)` works too, without the reserved space.

A picture with a caption:

```html
<figure>
  <img src="/team.webp" alt="The team outdoors" width="1600" height="1200" />
  <figcaption>Members of the Tiles Privacy team.</figcaption>
</figure>
```

A diagram with light and dark versions (the site follows its theme switcher; other readers follow their system setting):

```html
<picture>
  <source srcset="/flow-dark.png" media="(prefers-color-scheme: dark)" width="1744" height="902" />
  <img src="/flow.png" alt="Request and response flow" width="1719" height="915" />
</picture>
```

A short silent clip that loops and starts when scrolled to:

```html
<video src="/demo.mp4" poster="/demo-poster.webp" autoplay loop muted playsinline aria-label="What the clip shows"></video>
```

Leave out `autoplay` (and add `controls`) for a video with sound that readers start themselves.

Each of these goes on its own lines with a blank line before and after. If you give
an element a `class`, it's left exactly as written.
