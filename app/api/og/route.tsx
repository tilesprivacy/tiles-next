import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  // Get the base URL from the request
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  // Fetch the logo image as an ArrayBuffer that can be used directly by next/og.
  // Avoid Node.js-specific Buffer APIs since this route runs in the Edge runtime.
  const logoResponse = await fetch(`${baseUrl}/logo.png`)
  const logoArrayBuffer = await logoResponse.arrayBuffer()

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        padding: "60px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoArrayBuffer as any}
        width={240}
        height={240}
        style={{ marginBottom: 48 }}
        alt="Tiles Logo"
      />
      <div
        style={{
          color: "#000000",
          fontSize: 48,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Your private AI assistant for everyday use
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
