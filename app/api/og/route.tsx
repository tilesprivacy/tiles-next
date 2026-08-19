import { ImageResponse } from "next/og"
import { TilesOgLogo } from "@/components/tiles-og-logo"
import { TILES_PRODUCT_DESCRIPTION_CORE } from "@/lib/product-description"

// Helpful hints for Next / Vercel:
// - `size` / `contentType` exports let tooling know image dimensions and mime type.
// - Pages point at this route through `lib/social-image.ts`, which is also where
//   the `title` below comes from. Called bare, it renders the site-wide card.
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

/** Longer titles start wrapping past the card, so they are cut here. */
const MAX_TITLE_LENGTH = 90

/*
 * On fonts: this card deliberately ships none, and renders in the face bundled
 * with Satori.
 *
 * It used to pull Geist from Google Fonts, which laid the tagline out with
 * visibly uneven word gaps: roughly every other space came back double width.
 * That was chased down and is Geist itself under Satori, not the loader. It
 * reproduces with the full face as well as Google's `&text=` subset, at weight
 * 400 and 600 alike, and survives both `display: block` and `white-space:
 * nowrap`. The bundled face spaces the same string evenly.
 *
 * `app/api/og/pricing` already renders without a custom font for the same
 * reason, so the two cards now match. Re-adding a webfont here means checking
 * a full line of body copy in the output, not just a short title.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawTitle = searchParams.get("title")?.trim()
  const title = rawTitle ? rawTitle.slice(0, MAX_TITLE_LENGTH) : null
  const tagline = TILES_PRODUCT_DESCRIPTION_CORE

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#f2f2f4",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "0 90px",
          }}
        >
          <TilesOgLogo size={title ? 132 : 200} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
              textAlign: "center",
            }}
          >
            {title ? (
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#FAFAFA",
                  maxWidth: 960,
                }}
              >
                {title}
              </div>
            ) : null}
            <div
              style={{
                fontSize: title ? 28 : 32,
                fontWeight: 400,
                lineHeight: 1.25,
                marginTop: title ? 20 : 0,
                color: "rgba(231,231,237,0.9)",
                maxWidth: 900,
              }}
            >
              {tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
