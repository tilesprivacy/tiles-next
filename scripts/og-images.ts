// Renders the site's Open Graph cards to static/og/generated/*.png before
// `vite build`, so no image is drawn at request time. The layouts match the
// Next.js `ImageResponse` routes they replace (/api/og, /api/og/pricing,
// /api/og/plugin), which now redirect here.
//
// Plain Node with type stripping: no enums or other TS-only syntax.

import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { registerHooks } from "node:module"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"

// src/lib modules import JSON without attributes, which Vite allows and Node
// does not. Hand JSON to Node as a module instead.
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && url.endsWith(".json")) {
      return nextLoad(url, { ...context, importAttributes: { type: "json" } })
    }
    return nextLoad(url, context)
  },
})

const root = new URL("../", import.meta.url)
const outDir = new URL("static/og/generated/", root)
const WIDTH = 1200
const HEIGHT = 630

const { TILES_PRODUCT_DESCRIPTION_CORE } = await import(
  new URL("src/lib/product-description.ts", root).href
)
const { PRICING_PAGE_DESCRIPTION, PRICING_PAGE_TITLE, PRICING_PLANS } = await import(
  new URL("src/lib/pricing-plans.ts", root).href
)
const { getTilesPlugins } = await import(new URL("src/lib/plugins.ts", root).href)

const font = (path) => readFile(new URL(path, root))
const [wordmarkFont, geistRegular] = await Promise.all([
  font("static/fonts/geist-tiles-bold.ttf"),
  font("static/fonts/geist-og-regular.ttf"),
])

// Next's ImageResponse falls back to Geist Regular for every weight, so the
// plugin and pricing cards use only that face.
const geist = [{ name: "geist", data: geistRegular, weight: 400, style: "normal" }]

// satori takes React-shaped element objects.
function h(type, props, ...children) {
  const flat = children.flat().filter((child) => child !== null && child !== false)
  return {
    type,
    props: { ...props, children: flat.length === 1 ? flat[0] : flat.length ? flat : undefined },
  }
}

function tilesLogo(size) {
  return h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "10 55 190 190",
      preserveAspectRatio: "xMidYMid meet",
    },
    h("rect", { x: "10", y: "55", width: "190", height: "190", fill: "#000000" }),
    h(
      "g",
      { transform: "matrix(1.7339297,0,0,1.7339297,-170.63802,-212.29752)" },
      h("path", {
        fill: "#FAFAFA",
        d: "m 186.99621,168.60179 -63.42476,16.74409 -2.5583,0.0714 -8.72979,9.06288 -1.46642,1.45163 13.14273,-3.48681 63.42524,-16.74416 1.15447,0.39563 1.40975,-0.37392 14.94459,-3.96512 -9.42404,-1.66122 z m 21.52021,3.14773 -51.83664,13.65787 -1.66407,0.65303 -13.84832,3.6743 -1.15447,-0.39566 -1.41022,0.37442 -14.01904,3.71962 -0.22102,0.0591 -0.70463,0.18692 -14.23996,3.77808 9.42463,1.66124 8.47287,1.4945 21.48478,-5.7007 2.5583,-0.72626 0.83595,-0.80549 6.35955,-1.68731 c 0.5319,0.26196 1.20702,0.58075 1.92156,0.88328 l -10.57365,2.83235 -22.52888,6.03473 7.32394,2.05679 0.59588,-0.68103 9.49701,-2.54449 1.13169,-0.0343 0.2136,-0.0105 -17.7122,29.33853 1.85918,7.22052 1.49497,5.82259 2.51936,0.2392 9.79465,-16.03992 -0.13185,-0.99982 5.60606,-8.9788 1.57476,-0.31462 -16.57289,27.50485 1.02603,3.53729 h 2.98985 l 35.41478,-58.46823 22.47821,-5.94619 2.44708,-1.18978 2.08544,-2.22029 z",
      }),
    ),
  )
}

// Match the older satori inside Next.js: boxes were border-box (newer satori
// defaults to content-box, pushing padded boxes past their width) and missing
// bold faces were never synthesized.
const div = (style, ...children) =>
  h("div", { style: { boxSizing: "border-box", fontSynthesis: "none", ...style } }, ...children)

function defaultCard() {
  return div(
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000",
      color: "#f2f2f4",
      fontFamily: "Tiles Body",
    },
    div(
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 90px",
      },
      tilesLogo(132),
      div(
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
          textAlign: "center",
        },
        div(
          {
            fontFamily: "Tiles Wordmark",
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: 0,
            color: "#FAFAFA",
            maxWidth: 960,
          },
          "Tiles",
        ),
        div(
          {
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.25,
            marginTop: 20,
            color: "rgba(231,231,237,0.9)",
            maxWidth: 900,
          },
          TILES_PRODUCT_DESCRIPTION_CORE,
        ),
      ),
    ),
  )
}

function pricingPlanCard(plan, index) {
  return div(
    {
      position: "relative",
      display: "flex",
      flex: 1,
      minHeight: 326,
      flexDirection: "column",
      overflow: "hidden",
      marginLeft: index === 0 ? 0 : 14,
      border: plan.highlighted
        ? "1px solid rgba(255, 255, 255, 0.3)"
        : "1px solid rgba(255, 255, 255, 0.14)",
      borderRadius: 20,
      background: plan.highlighted
        ? "linear-gradient(145deg, rgba(203, 48, 224, 0.15), rgba(255, 255, 255, 0.07))"
        : "rgba(255, 255, 255, 0.035)",
      padding: "22px 20px 20px",
    },
    plan.highlighted
      ? div({
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          width: "100%",
          height: 4,
          backgroundColor: "#CB30E0",
        })
      : null,
    div({ display: "flex", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }, plan.name),
    div(
      { display: "flex", alignItems: "baseline", marginTop: 20 },
      div(
        { display: "flex", fontSize: 46, fontWeight: 500, letterSpacing: "-0.055em", lineHeight: 1 },
        plan.price,
      ),
      plan.cadence
        ? div(
            { display: "flex", marginLeft: 3, color: "rgba(244, 244, 245, 0.52)", fontSize: 15 },
            plan.cadence,
          )
        : null,
    ),
    div(
      {
        display: "flex",
        minHeight: 72,
        marginTop: 16,
        color: "rgba(244, 244, 245, 0.64)",
        fontSize: 16,
        lineHeight: 1.35,
      },
      plan.tagline,
    ),
    div(
      { display: "flex", flexDirection: "column", marginTop: 22 },
      div(
        {
          display: "flex",
          color: "rgba(244, 244, 245, 0.4)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
        plan.featuresIntro ?? " ",
      ),
      div(
        {
          display: "flex",
          alignItems: "flex-start",
          marginTop: 10,
          color: "rgba(244, 244, 245, 0.88)",
          fontSize: 15,
          lineHeight: 1.32,
        },
        div({
          display: "flex",
          width: 6,
          height: 6,
          flexShrink: 0,
          marginTop: 7,
          marginRight: 8,
          borderRadius: 6,
          backgroundColor: plan.highlighted ? "#CB30E0" : "rgba(244, 244, 245, 0.7)",
        }),
        div({ display: "flex" }, plan.features[0]),
      ),
    ),
  )
}

function pricingCard() {
  const ring = (size, top, right, alpha) =>
    div({
      position: "absolute",
      top,
      right,
      display: "flex",
      width: size,
      height: size,
      border: `1px solid rgba(203, 48, 224, ${alpha})`,
      borderRadius: size,
    })

  return div(
    {
      position: "relative",
      display: "flex",
      width: "100%",
      height: "100%",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "#050505",
      color: "#F4F4F5",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "54px 58px 48px",
    },
    div({
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      width: "100%",
      height: 6,
      background: "linear-gradient(90deg, #CB30E0 0%, #7E35D7 58%, #050505 100%)",
    }),
    ring(680, -330, -230, 0.22),
    ring(520, -250, -150, 0.14),
    div(
      { display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" },
      div(
        { display: "flex", alignItems: "center" },
        tilesLogo(48),
        div(
          { display: "flex", marginLeft: 16, fontSize: 32, fontWeight: 600, letterSpacing: "-0.04em" },
          "Tiles",
        ),
      ),
      div(
        { display: "flex", color: "rgba(244, 244, 245, 0.56)", fontSize: 20, letterSpacing: "-0.01em" },
        "tiles.run/pricing",
      ),
    ),
    div(
      { display: "flex", width: "100%", flex: 1, alignItems: "center", marginTop: 34 },
      div(
        { display: "flex", width: "36%", flexDirection: "column", paddingRight: 40 },
        div(
          {
            display: "flex",
            color: "#D964E8",
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          },
          PRICING_PAGE_TITLE,
        ),
        div(
          {
            display: "flex",
            maxWidth: 420,
            marginTop: 18,
            fontSize: 62,
            fontWeight: 600,
            letterSpacing: "-0.055em",
            lineHeight: 1.02,
          },
          "Local AI stays free.",
        ),
        div(
          {
            display: "flex",
            maxWidth: 420,
            marginTop: 22,
            color: "rgba(244, 244, 245, 0.68)",
            fontSize: 23,
            lineHeight: 1.38,
            letterSpacing: "-0.015em",
          },
          PRICING_PAGE_DESCRIPTION,
        ),
      ),
      div(
        { display: "flex", width: "64%", alignItems: "stretch" },
        PRICING_PLANS.map(pricingPlanCard),
      ),
    ),
    div(
      { display: "flex", alignItems: "center", color: "rgba(244, 244, 245, 0.5)", fontSize: 17 },
      div({
        display: "flex",
        width: 8,
        height: 8,
        marginRight: 11,
        borderRadius: 8,
        backgroundColor: "#CB30E0",
      }),
      "Everything on your hardware stays free, without limits.",
    ),
  )
}

// Plugins without their own artwork get Lucide's "package" icon.
const PLUGIN_ICONS = {
  caldir: "static/caldir-icon-white.png",
  exa: "static/exa-icon.svg",
  obsidian: "static/obsidian-icon.svg",
  cloudflare: "static/cloudflare-icon.svg",
  // The upstream SVG has Unicode comments the renderer can't decode.
  solstone: "static/solstone-icon-og.png",
}

async function pluginIcon(slug) {
  const path = PLUGIN_ICONS[slug]
  if (!path) {
    return h(
      "svg",
      { width: "112", height: "112", viewBox: "0 0 24 24", fill: "none" },
      h("path", {
        d: "m7.5 4.27 9 5.15m-9 5.16 9 5.15M3.27 6.96 12 12l8.73-5.04M12 22V12M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    )
  }
  const mime = path.endsWith(".svg") ? "image/svg+xml" : "image/png"
  const data = (await readFile(new URL(path, root))).toString("base64")
  return h("img", {
    src: `data:${mime};base64,${data}`,
    width: 112,
    height: 112,
    style: { borderRadius: slug === "exa" ? 18 : 0, objectFit: "contain" },
  })
}

async function pluginCard(plugin) {
  return div(
    {
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
    },
    div(
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 144,
        height: 144,
        color: "#fafafa",
        marginBottom: 28,
      },
      await pluginIcon(plugin.slug),
    ),
    div(
      { display: "flex", fontSize: 62, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.025em", maxWidth: 960 },
      plugin.name.slice(0, 60),
    ),
    div(
      {
        display: "flex",
        fontSize: 29,
        fontWeight: 400,
        lineHeight: 1.3,
        color: "rgba(231,231,237,0.9)",
        maxWidth: 900,
        marginTop: 22,
      },
      plugin.description.slice(0, 180),
    ),
  )
}

async function render(name, element, fonts) {
  const svg = await satori(element, { width: WIDTH, height: HEIGHT, fonts })
  const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng()
  await writeFile(new URL(name, outDir), png)
  console.log(`og: ${name}`)
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

await render("og.png", defaultCard(), [
  { name: "Tiles Wordmark", data: wordmarkFont, weight: 700, style: "normal" },
  { name: "Tiles Body", data: geistRegular, weight: 400, style: "normal" },
])
await render("pricing.png", pricingCard(), geist)

for (const plugin of await getTilesPlugins()) {
  if (!/^[a-z0-9-]+$/.test(plugin.slug)) continue
  await render(`plugin-${plugin.slug}.png`, await pluginCard(plugin), geist)
}
