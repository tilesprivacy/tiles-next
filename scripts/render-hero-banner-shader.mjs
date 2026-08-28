// Headless preview of the hero MacBook banner shader (vgpu/node + llvmpipe).
// Renders the exact WGSL the site ships (lib/hero-banner-shader-gpu.ts) at a
// few tilt/theme/time combinations and writes PNGs for visual review.
//
//   node --experimental-strip-types scripts/render-hero-banner-shader.mjs [outDir]
//
// First run on a machine without a GPU may need: npx vgpu install-software-renderer

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { PNG } from "pngjs"
import sharp from "sharp"
import { effect, init, sampler, target } from "vgpu/node"

import {
  HERO_BANNER_BEVEL_SIGMA,
  HERO_BANNER_BLEED_X,
  HERO_BANNER_BLEED_Y,
  HERO_BANNER_LOGO_ASPECT,
  HERO_BANNER_RASTER_HEIGHT,
  HERO_BANNER_RASTER_PAD,
  HERO_BANNER_RASTER_WIDTH,
  HERO_BANNER_THEME_DARK,
  HERO_BANNER_THEME_LIGHT,
  HERO_BANNER_WGSL,
  fillBannerSvg,
} from "../lib/hero-banner-shader-gpu.ts"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.resolve(process.argv[2] ?? path.join(repoRoot, ".hero-banner-preview"))

const WIDTH = 960
const HEIGHT = Math.round(
  (WIDTH / HERO_BANNER_LOGO_ASPECT) * ((1 + 2 * HERO_BANNER_BLEED_X) / (1 + 2 * HERO_BANNER_BLEED_Y)),
)

async function rasterizeLogo() {
  const pad = HERO_BANNER_RASTER_PAD
  const svg = fillBannerSvg(
    readFileSync(path.join(repoRoot, "public", "tiles_banner_outline_blk.svg"), "utf8"),
  )
  const inner = await sharp(Buffer.from(svg))
    .resize(HERO_BANNER_RASTER_WIDTH - pad * 2, HERO_BANNER_RASTER_HEIGHT - pad * 2, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer()
  const base = sharp(inner, {
    raw: { width: HERO_BANNER_RASTER_WIDTH - pad * 2, height: HERO_BANNER_RASTER_HEIGHT - pad * 2, channels: 4 },
  }).extend({ top: pad, bottom: pad, left: pad, right: pad, extendWith: "background", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  const sharpMask = await base.clone().raw().toBuffer()
  const softMask = await base.clone().blur(HERO_BANNER_BEVEL_SIGMA).raw().toBuffer()
  const toBytes = (buf) => new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  return { sharpMask: toBytes(sharpMask), softMask: toBytes(softMask) }
}

function padRows(data, width, height) {
  const bytesPerRow = Math.ceil((width * 4) / 256) * 256
  if (bytesPerRow === width * 4) return { data, bytesPerRow }
  const padded = new Uint8Array(bytesPerRow * height)
  for (let row = 0; row < height; row += 1) {
    padded.set(data.subarray(row * width * 4, (row + 1) * width * 4), row * bytesPerRow)
  }
  return { data: padded, bytesPerRow }
}

function uploadMask(gpu, label, bytes) {
  const texture = gpu.gpu.createTexture({
    label,
    size: [HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT],
    format: "rgba8unorm",
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
  })
  const { data, bytesPerRow } = padRows(bytes, HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT)
  gpu.gpu.queue.writeTexture(
    { texture },
    data,
    { bytesPerRow, rowsPerImage: HERO_BANNER_RASTER_HEIGHT },
    [HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT],
  )
  return texture
}

function compositeOverBackground(pixels, background) {
  const out = Buffer.alloc(WIDTH * HEIGHT * 4)
  for (let i = 0; i < WIDTH * HEIGHT; i += 1) {
    const a = pixels[i * 4 + 3] / 255
    for (let c = 0; c < 3; c += 1) {
      // Shader output is premultiplied; composite over the page background.
      out[i * 4 + c] = Math.round(Math.min(255, pixels[i * 4 + c] + background[c] * (1 - a)))
    }
    out[i * 4 + 3] = 255
  }
  return out
}

function writePng(name, rgba) {
  const png = new PNG({ width: WIDTH, height: HEIGHT })
  png.data.set(rgba)
  writeFileSync(path.join(outDir, name), PNG.sync.write(png))
  console.log(`wrote ${path.join(outDir, name)}`)
}

const gpu = await init()
try {
  mkdirSync(outDir, { recursive: true })

  const { sharpMask, softMask } = await rasterizeLogo()
  const maskTex = uploadMask(gpu, "hero-banner-mask-preview", sharpMask)
  const softTex = uploadMask(gpu, "hero-banner-soft-preview", softMask)

  const colorTarget = target(gpu, { size: [WIDTH, HEIGHT] })
  const banner = effect(gpu, HERO_BANNER_WGSL, {
    label: "hero-banner-preview",
    set: {
      maskTex,
      softTex,
      logoSamp: sampler(gpu, {
        minFilter: "linear",
        magFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge",
      }),
      params: { ...HERO_BANNER_THEME_LIGHT, time: 0, tilt: [0, 0] },
    },
  })

  const scenes = [
    { name: "light-flat", theme: HERO_BANNER_THEME_LIGHT, tilt: [0, 0], time: 0, background: [255, 255, 255] },
    { name: "light-tilt", theme: HERO_BANNER_THEME_LIGHT, tilt: [-0.16, 0.3], time: 2.4, background: [255, 255, 255] },
    { name: "dark-flat", theme: HERO_BANNER_THEME_DARK, tilt: [0, 0], time: 0, background: [31, 31, 31] },
    { name: "dark-tilt", theme: HERO_BANNER_THEME_DARK, tilt: [-0.16, 0.3], time: 2.4, background: [31, 31, 31] },
    { name: "dark-tilt-alt", theme: HERO_BANNER_THEME_DARK, tilt: [0.14, -0.28], time: 5.1, background: [31, 31, 31] },
  ]

  for (const scene of scenes) {
    banner.set({ params: { ...scene.theme, time: scene.time, tilt: scene.tilt } })
    banner.draw(colorTarget)
    const pixels = await colorTarget.read()
    let covered = 0
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 8) covered += 1
    const coverage = covered / (WIDTH * HEIGHT)
    console.log(`${scene.name}: coverage ${(coverage * 100).toFixed(2)}%`)
    if (coverage < 0.08 || coverage > 0.75) {
      throw new Error(`${scene.name}: unexpected coverage ${(coverage * 100).toFixed(2)}% — the filled slabs should cover a moderate share of the canvas`)
    }
    writePng(`${scene.name}.png`, compositeOverBackground(pixels, scene.background))
  }
} finally {
  gpu.dispose()
}
