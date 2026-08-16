import { ImageResponse } from "next/og"
import { TilesOgLogo } from "@/components/tiles-og-logo"
import { TILES_PRODUCT_DESCRIPTION_CORE } from "@/lib/product-description"

// Helpful hints for Next / Vercel:
// - `size` / `contentType` exports let tooling know image dimensions and mime type.
// - This route is used as `/api/og` from the root `metadata` in `app/layout.tsx`.
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@400;600;700&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (!resource) {
    throw new Error(`Failed to load ${font} font CSS`)
  }

  const response = await fetch(resource[1])
  if (!response.ok) {
    throw new Error(`Failed to load ${font} font file`)
  }

  return response.arrayBuffer()
}

export async function GET() {
  const tagline = TILES_PRODUCT_DESCRIPTION_CORE
  const fontText = tagline

  // Fetch the font opportunistically; never fail the OG image if unavailable.
  let geistFontData: ArrayBuffer | null = null
  try {
    geistFontData = await loadGoogleFont("Geist", fontText)
  } catch {
    geistFontData = null
  }

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
        {/* Centered logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <TilesOgLogo size={200} />
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
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.25,
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
      ...(geistFontData
        ? {
            fonts: [
              {
                name: "Geist",
                data: geistFontData,
                style: "normal" as const,
                weight: 400 as const,
              },
            ],
          }
        : {}),
    },
  )
}
