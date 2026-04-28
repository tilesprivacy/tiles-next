import { AtpAgent } from "@atproto/api"
import { ImageResponse } from "next/og"
import { resolveSharedSessionUri } from "@/lib/shared-session"

export const runtime = "nodejs"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const DEFAULT_ATPROTO_SERVICE = "https://public.api.bsky.app"

function getDidFromAtUri(uri: string): string | null {
  const match = uri.match(/^at:\/\/([^/]+)\/[^/]+\/[^/]+$/)
  return match ? match[1] : null
}

function normalizeAvatarUrlForOg(imageUrl: string): string {
  try {
    const parsed = new URL(imageUrl)
    if (parsed.hostname !== "cdn.bsky.app") {
      return imageUrl
    }

    const segments = parsed.pathname.split("/")
    const lastSegment = segments[segments.length - 1]
    if (!lastSegment) {
      return imageUrl
    }

    if (!lastSegment.includes("@")) {
      segments[segments.length - 1] = `${lastSegment}@jpeg`
      parsed.pathname = segments.join("/")
    }

    return parsed.toString()
  } catch {
    return imageUrl
  }
}

async function toDataUrl(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(normalizeAvatarUrlForOg(imageUrl), { cache: "no-store" })
    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get("content-type") ?? "image/png"
    const bytes = await response.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    return `data:${contentType};base64,${base64}`
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const shareToken = url.searchParams.get("session") ?? ""

  let handleText = "@unknown"
  let avatarDataUrl: string | null = null
  const logoDataUrl = await toDataUrl(`${url.origin}/icon-mark-light.svg`)

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
      const avatarUrl = profile.data.avatar?.trim() || null
      avatarDataUrl = avatarUrl ? await toDataUrl(avatarUrl) : null
    }
  } catch {
    handleText = "@unknown"
    avatarDataUrl = null
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
          background: "#000000",
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
            marginBottom: "22px",
          }}
        >
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt="Tiles"
              width={132}
              height={132}
              style={{ objectFit: "contain" }}
            />
          ) : null}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#f2f2f4",
            }}
          >
            Tiles
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            lineHeight: 1.2,
            textAlign: "center",
            whiteSpace: "nowrap",
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(231,231,237,0.88)",
          }}
        >
          <span>Shared chat from</span>
          {avatarDataUrl ? (
            <img
              src={avatarDataUrl}
              alt={handleText}
              width={44}
              height={44}
              style={{
                borderRadius: "9999px",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.14)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            />
          )}
          <span style={{ fontSize: 28, color: "rgba(231,231,237,0.95)" }}>
            {handleText}
          </span>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
