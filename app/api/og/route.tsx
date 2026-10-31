import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { TilesOgLogo } from "@/components/tiles-og-logo"
import { TILES_PRODUCT_DESCRIPTION_CORE } from "@/lib/product-description"

// Helpful hints for Next / Vercel:
// - `size` / `contentType` exports let tooling know image dimensions and mime type.
// - General site pages point at this route through `lib/social-image.ts` so
//   their social previews share one visually consistent Tiles card.
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const tilesWordmarkFont = readFile(
  join(process.cwd(), "public/fonts/geist-tiles-bold.ttf"),
).then((font) => Uint8Array.from(font).buffer)

const tilesBodyFont = readFile(
  join(process.cwd(), "public/fonts/geist-og-regular.ttf"),
).then((font) => Uint8Array.from(font).buffer)

/*
 * Use explicit bundled faces for both lines. Satori's fallback font can select
 * glyphs with visibly different stroke weights within the same sentence. The
 * small bold subset keeps the Tiles wordmark aligned with the website header,
 * while the full regular face gives the tagline one consistent glyph source.
 */

export async function GET() {
  const tagline = TILES_PRODUCT_DESCRIPTION_CORE
  const [wordmarkFontData, bodyFontData] = await Promise.all([
    tilesWordmarkFont,
    tilesBodyFont,
  ])

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
          fontFamily: "Tiles Body",
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
          <TilesOgLogo size={132} />
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
            <div
              style={{
                fontFamily: "Tiles Wordmark",
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: 0,
                color: "#FAFAFA",
                maxWidth: 960,
              }}
            >
              Tiles
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.25,
                marginTop: 20,
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
      fonts: [
        {
          name: "Tiles Wordmark",
          data: wordmarkFontData,
          style: "normal",
          weight: 700,
        },
        {
          name: "Tiles Body",
          data: bodyFontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  )
}
