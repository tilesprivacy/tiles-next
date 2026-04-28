import { AtpAgent } from "@atproto/api"
import { ImageResponse } from "next/og"
import { resolveSharedSessionUri } from "@/lib/shared-session"

export const runtime = "nodejs"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

interface ShareOpenGraphImageProps {
  params: Promise<{ session: string[] }>
}

const DEFAULT_ATPROTO_SERVICE = "https://public.api.bsky.app"

function getDidFromAtUri(uri: string): string | null {
  const match = uri.match(/^at:\/\/([^/]+)\/[^/]+\/[^/]+$/)
  return match ? match[1] : null
}

export default async function Image({ params }: ShareOpenGraphImageProps) {
  const { session } = await params
  const shareToken = session.join("/")

  let handleText = "@unknown"
  let avatarUrl: string | null = null

  try {
    const sourceUri = resolveSharedSessionUri(shareToken)
    const did = getDidFromAtUri(sourceUri)

    if (did) {
      const agent = new AtpAgent({
        service: DEFAULT_ATPROTO_SERVICE,
        fetch,
      })
      const profile = await agent.app.bsky.actor.getProfile({ actor: did })
      const handle = profile.data.handle?.trim()
      handleText = handle
        ? handle.startsWith("@")
          ? handle
          : `@${handle}`
        : `@${did}`
      avatarUrl = profile.data.avatar?.trim() || null
    }
  } catch {
    handleText = "@unknown"
    avatarUrl = null
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#1f1f1f",
          color: "#e7e7ed",
          padding: "56px",
          fontFamily:
            "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, fontWeight: 600 }}>
            Shared Tiles chat session from
          </div>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={handleText}
              width={84}
              height={84}
              style={{
                borderRadius: "9999px",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            />
          ) : (
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            />
          )}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 42,
            fontWeight: 500,
            color: "rgba(231,231,237,0.95)",
          }}
        >
          {handleText}
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
