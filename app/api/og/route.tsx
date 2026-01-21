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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin

  const title = "Tiles"
  const tagline = "Your private AI assistant for everyday use"

  // Fetch the logo image and convert to base64 for edge runtime
  const logoResponse = await fetch(`${origin}/logo.png`)
  if (!logoResponse.ok) {
    throw new Error("Failed to fetch logo")
  }
  const logoBuffer = await logoResponse.arrayBuffer()
  
  // Convert ArrayBuffer to base64 (edge runtime compatible, chunked to avoid stack overflow)
  const bytes = new Uint8Array(logoBuffer)
  const chunkSize = 8192
  let binary = ""
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    // Build string chunk by chunk without spreading
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j])
    }
  }
  const logoBase64 = btoa(binary)
  const logoDataUrl = `data:image/png;base64,${logoBase64}`

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
            marginBottom: 48,
          }}
        >
          <img
            src={logoDataUrl}
            alt="Tiles logo"
            width={200}
            height={200}
            style={{
              objectFit: "contain",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 400,
            letterSpacing: 0,
            textAlign: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
