import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const MAX_NAME_LENGTH = 60
const MAX_DESCRIPTION_LENGTH = 180

function PackageIcon() {
  return (
    <svg width="112" height="112" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m7.5 4.27 9 5.15m-9 5.16 9 5.15M3.27 6.96 12 12l8.73-5.04M12 22V12M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PluginIcon({ slug, requestUrl }: { slug: string; requestUrl: string }) {
  const iconPath = slug === "caldir"
    ? "/caldir-icon-white.png"
    : slug === "exa"
      ? "/exa-icon.svg"
      : null

  if (!iconPath) {
    return <PackageIcon />
  }

  return (
    // ImageResponse needs an absolute URL when it fetches a public asset.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={new URL(iconPath, requestUrl).toString()}
      alt=""
      width={112}
      height={112}
      style={{ borderRadius: slug === "exa" ? 18 : 0 }}
    />
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")?.trim() ?? ""
  const name = (searchParams.get("name")?.trim() || "Tiles Plugin").slice(0, MAX_NAME_LENGTH)
  const description = (
    searchParams.get("description")?.trim()
    || "Extend Tiles with portable skills and MCP servers."
  ).slice(0, MAX_DESCRIPTION_LENGTH)

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
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          padding: "64px 100px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 144,
            height: 144,
            color: "#fafafa",
            marginBottom: 28,
          }}
        >
          <PluginIcon slug={slug} requestUrl={request.url} />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 62,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            maxWidth: 960,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 29,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "rgba(231,231,237,0.9)",
            maxWidth: 900,
            marginTop: 22,
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
