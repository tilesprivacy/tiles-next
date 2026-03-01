import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const tagline = "Your private and secure AI assistant for everyday use."
  const fontText = tagline

  // Fetch logo/font opportunistically; never fail the OG image if unavailable.
  let logoDataUrl: string | null = null
  try {
    const logoResponse = await fetch(`${origin}/logo.png`)
    if (logoResponse.ok) {
      const logoBuffer = await logoResponse.arrayBuffer()
      const bytes = new Uint8Array(logoBuffer)
      const chunkSize = 8192
      let binary = ""
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize)
        for (let j = 0; j < chunk.length; j++) {
          binary += String.fromCharCode(chunk[j])
        }
      }
      logoDataUrl = `data:image/png;base64,${btoa(binary)}`
    }
  } catch {
    logoDataUrl = null
  }

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
          backgroundColor: "#FAFAFA",
          color: "#000000",
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
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt="Tiles logo"
              width={200}
              height={200}
              style={{
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 9999,
                backgroundColor: "#000000",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 96,
                fontWeight: 700,
              }}
            >
              T
            </div>
          )}
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
                color: "#1A1A1A",
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
