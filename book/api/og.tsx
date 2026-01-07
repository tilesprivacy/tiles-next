import { ImageResponse } from "next/og"

export const runtime = "edge"

export default async function handler(request: Request) {
  // Fetch the dark.png image (the "T" logo)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://book.tiles.run')
  const imageResponse = await fetch(`${baseUrl}/dark.png`)
  const imageData = await imageResponse.arrayBuffer()
  const imageBase64 = Buffer.from(imageData).toString('base64')
  const imageDataUrl = `data:image/png;base64,${imageBase64}`
  
  // Get query parameters if provided
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Learn about decentralized memory networks'
  const description = searchParams.get('description') || 'Learn about decentralized memory networks'
  
  // Use description if provided, otherwise use title, fallback to default
  const displayText = description || title || 'Learn about decentralized memory networks'
  
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E0E0D",
        padding: "60px",
      }}
    >
      {/* Stylized "T" logo in upper half */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <img
          src={imageDataUrl}
          alt="Tilekit Logo"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "contain",
          }}
        />
      </div>
      
      {/* Text below the logo */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 28,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.4,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {displayText}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
