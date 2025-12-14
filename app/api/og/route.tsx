import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // Fetch the logo image
  const logoUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"}/og-logo.png`

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        padding: "60px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoUrl || "/placeholder.svg"} width={240} height={240} style={{ marginBottom: 48 }} alt="Tiles Logo" />
      <div
        style={{
          color: "#000000",
          fontSize: 48,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Tiles is your private AI assistant with offline memory
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
