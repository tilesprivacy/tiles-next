// The link-preview card for a shared chat: the Tiles mark, and who shared it
// with their avatar. Private shares get the same card with "Private"; their
// name and content are never on it. Loaded on demand by /chat/og, so its
// WebAssembly (satori's layout engine and resvg) only starts for card requests.
import { env } from "cloudflare:workers"
import { dev } from "$app/env"
import { initWasm, Resvg } from "@resvg/resvg-wasm"
// satori 0.25, the version inside Next.js's card renderer: newer releases lay
// the card out a few pixels differently (the build-time cards use 0.62).
import satori, { init as initSatori } from "satori-og/standalone"
import type { SharedBy } from "#lib/chat/share-page"

const WIDTH = 1200
const HEIGHT = 630
const MAX_AVATAR_BYTES = 1024 * 1024

type Node = { type: string; props: Record<string, unknown> }

function h(type: string, props: Record<string, unknown>, ...children: (Node | string | null)[]): Node {
  const kids = children.filter((child) => child !== null)
  return { type, props: { ...props, children: kids.length === 1 ? kids[0] : kids.length ? kids : undefined } }
}

const div = (style: Record<string, unknown>, ...children: (Node | string | null)[]) => h("div", { style }, ...children)

interface CardAssets {
  font: ArrayBuffer
  logo: string
}

async function loadWasmModules(): Promise<[WebAssembly.Module, WebAssembly.Module]> {
  if (dev) {
    const { readFile } = await import("node:fs/promises")
    const compile = async (path: string) => WebAssembly.compile(await readFile(new URL(`../../../../node_modules/${path}`, import.meta.url)))
    return Promise.all([compile("satori-og/yoga.wasm"), compile("@resvg/resvg-wasm/index_bg.wasm")])
  }
  // Workers can't compile WebAssembly at run time; wrangler uploads these
  // precompiled (they stay external in vite.config.ts).
  const [layout, resvg] = await Promise.all([import("satori-og/yoga.wasm"), import("@resvg/resvg-wasm/index_bg.wasm")])
  return [layout.default, resvg.default]
}

// Both run once per isolate; a failure is retried with the next card.
let wasm: Promise<unknown> | null = null
function startWasm(): Promise<unknown> {
  wasm ??= loadWasmModules()
    .then(([layout, resvg]) => Promise.all([initSatori(layout), initWasm(resvg)]))
    .catch((cause: unknown) => {
      wasm = null
      throw cause
    })
  return wasm
}

// The font (the one Next.js's card renderer fell back to) and the logo are
// the site's own static files, read from the Worker's assets.
async function readStatic(path: string): Promise<Response> {
  if (dev) {
    const { readFile } = await import("node:fs/promises")
    return new Response(await readFile(new URL(`../../../../static${path}`, import.meta.url)))
  }
  const response = await env.ASSETS.fetch(new Request(`https://assets.invalid${path}`))
  if (!response.ok) throw new Error(`${path}: ${response.status}`)
  return response
}

let assets: Promise<CardAssets> | null = null
function loadAssets(): Promise<CardAssets> {
  assets ??= Promise.all([readStatic("/fonts/geist-og-regular.ttf").then((r) => r.arrayBuffer()), readStatic("/icon-mark-light.svg").then((r) => r.text())])
    .then(([font, logo]) => ({ font, logo: `data:image/svg+xml;base64,${btoa(logo)}` }))
    .catch((cause: unknown) => {
      assets = null
      throw cause
    })
  return assets
}

/** The avatar as a data URL, or null (the card then shows a plain circle). */
export async function fetchAvatar(url: string | null): Promise<string | null> {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "cdn.bsky.app") return null
  // The CDN serves WebP by default, which resvg can't draw; ask for JPEG.
  if (!parsed.pathname.split("/").pop()?.includes("@")) parsed.pathname += "@jpeg"

  try {
    const response = await fetch(parsed, { signal: AbortSignal.timeout(4_000), redirect: "manual" })
    const type = response.headers.get("content-type") ?? ""
    if (!response.ok || !/^image\/(jpeg|png)$/.test(type)) return null
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.byteLength > MAX_AVATAR_BYTES) return null
    let binary = ""
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    return `data:${type};base64,${btoa(binary)}`
  } catch {
    return null
  }
}

export async function renderShareCard(options: { sharedBy: SharedBy; isPrivate: boolean; avatar: string | null }): Promise<Uint8Array> {
  const [{ font, logo }] = await Promise.all([loadAssets(), startWasm()])
  const { sharedBy, isPrivate, avatar } = options
  const handle = sharedBy.handle ? `@${sharedBy.handle}` : `@${sharedBy.did}`
  const avatarStyle = { width: 44, height: 44, borderRadius: 9999, border: "2px solid rgba(255,255,255,0.2)" }

  const card = div(
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#000000",
      color: "#e7e7ed",
      padding: 56,
      fontFamily: "Geist",
    },
    div(
      { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 38 },
      h("img", { src: logo, width: 132, height: 132, style: { objectFit: "contain" } }),
      div({ fontSize: 72, fontWeight: 700, letterSpacing: "-0.02em", color: "#f2f2f4" }, "Tiles"),
    ),
    div(
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        lineHeight: 1.2,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontSize: 28,
        fontWeight: 500,
        color: "rgba(231,231,237,0.88)",
      },
      h("span", {}, `${isPrivate ? "Private" : "Public"} chat session shared by`),
      h(
        "span",
        { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 28, color: "rgba(231,231,237,0.95)" } },
        avatar
          ? h("img", { src: avatar, width: 44, height: 44, style: { ...avatarStyle, objectFit: "cover" } })
          : div({ ...avatarStyle, background: "rgba(255,255,255,0.14)" }),
        h("span", {}, handle),
      ),
    ),
  )

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: "Geist", data: font, weight: 400, style: "normal" }],
  })
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  try {
    return resvg.render().asPng()
  } finally {
    resvg.free()
  }
}
