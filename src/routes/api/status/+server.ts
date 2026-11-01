import type { RequestHandler } from "./$types"

export const prerender = false

// status.tiles.run is a Better Stack page; its old Statuspage-style
// /api/v2/status.json now redirects to HTML. The response keeps the
// Statuspage shape the footer indicator reads.
const STATUS_URL = "https://status.tiles.run/index.json"

const STATES: Record<string, { indicator: string; description: string }> = {
  operational: { indicator: "none", description: "All systems operational" },
  degraded: { indicator: "minor", description: "Partially degraded service" },
  downtime: { indicator: "major", description: "Service disruption" },
  maintenance: { indicator: "maintenance", description: "Service under maintenance" },
}

// Never claim "operational" without having heard it from the status page.
const UNKNOWN = { indicator: "unknown", description: "Status unavailable" }

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(STATUS_URL, {
      signal: AbortSignal.timeout(5_000),
      cf: { cacheTtl: 60, cacheEverything: true },
    } as RequestInit)
    if (response.ok) {
      const data = (await response.json()) as { data?: { attributes?: { aggregate_state?: unknown } } }
      const state = data?.data?.attributes?.aggregate_state
      if (typeof state === "string" && state in STATES) {
        return Response.json(
          { status: STATES[state] },
          { headers: { "Cache-Control": "public, max-age=0, s-maxage=60" } },
        )
      }
    }
  } catch {
    // reported as unknown below
  }
  return Response.json({ status: UNKNOWN }, { headers: { "Cache-Control": "no-store" } })
}
