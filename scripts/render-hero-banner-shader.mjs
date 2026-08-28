// Headless preview of the hero MacBook banner shader (vgpu/node + llvmpipe).
// Renders the exact WGSL the site ships (lib/hero-banner-shader-gpu.ts) at a
// few tilt/theme/time combinations and writes PNGs for visual review.
//
//   node --experimental-strip-types scripts/render-hero-banner-shader.mjs [outDir]
//
// First run on a machine without a GPU may need: npx vgpu install-software-renderer

import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { PNG } from "pngjs"
import sharp from "sharp"
import { effect, init, sampler, target } from "vgpu/node"

import {
  HERO_BANNER_BLEED_X,
  HERO_BANNER_BLEED_Y,
  HERO_BANNER_INK_DARK,
  HERO_BANNER_INK_LIGHT,
  HERO_BANNER_LOGO_ASPECT,
  HERO_BANNER_RASTER_HEIGHT,
  HERO_BANNER_RASTER_PAD,
  HERO_BANNER_RASTER_WIDTH,
  HERO_BANNER_SPEC_DARK,
  HERO_BANNER_SPEC_LIGHT,
  HERO_BANNER_WGSL,
} from "../lib/hero-banner-shader-gpu.ts"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.resolve(process.argv[2] ?? path.join(repoRoot, ".hero-banner-preview"))

const WIDTH = 960
const HEIGHT = Math.round(
  (WIDTH / HERO_BANNER_LOGO_ASPECT) * ((1 + 2 * HERO_BANNER_BLEED_X) / (1 + 2 * HERO_BANNER_BLEED_Y)),
)

async function rasterizeLogo() {
  const pad = HERO_BANNER_RASTER_PAD
  const inner = await sharp(path.join(repoRoot, "public", "tiles_banner_outline_blk.svg"))
    .resize(HERO_BANNER_RASTER_WIDTH - pad * 2, HERO_BANNER_RASTER_HEIGHT - pad * 2, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer()
  const padded = await sharp(inner, {
    raw: { width: HERO_BANNER_RASTER_WIDTH - pad * 2, height: HERO_BANNER_RASTER_HEIGHT - pad * 2, channels: 4 },
  })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, extendWith: "background", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer()
  return new Uint8Array(padded.buffer, padded.byteOffset, padded.byteLength)
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

function compositeOverBackground(pixels, background) {
  const out = Buffer.alloc(WIDTH * HEIGHT * 4)
  for (let i = 0; i < WIDTH * HEIGHT; i += 1) {
    const a = pixels[i * 4 + 3] / 255
    for (let c = 0; c < 3; c += 1) {
      // Shader output is premultiplied; composite over the page background.
      out[i * 4 + c] = Math.round(pixels[i * 4 + c] + background[c] * (1 - a))
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

  const logoBytes = await rasterizeLogo()
  const texture = gpu.gpu.createTexture({
    label: "hero-banner-logo-preview",
    size: [HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT],
    format: "rgba8unorm",
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
  })
  const { data, bytesPerRow } = padRows(logoBytes, HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT)
  gpu.gpu.queue.writeTexture(
    { texture },
    data,
    { bytesPerRow, rowsPerImage: HERO_BANNER_RASTER_HEIGHT },
    [HERO_BANNER_RASTER_WIDTH, HERO_BANNER_RASTER_HEIGHT],
  )

  const colorTarget = target(gpu, { size: [WIDTH, HEIGHT] })
  const banner = effect(gpu, HERO_BANNER_WGSL, {
    label: "hero-banner-preview",
    set: {
      logoTex: texture,
      logoSamp: sampler(gpu, {
        minFilter: "linear",
        magFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge",
      }),
      params: { ink: HERO_BANNER_INK_LIGHT, time: 0, tilt: [0, 0], reveal: 1, specGain: HERO_BANNER_SPEC_LIGHT },
    },
  })

  const scenes = [
    { name: "light-flat", ink: HERO_BANNER_INK_LIGHT, specGain: HERO_BANNER_SPEC_LIGHT, tilt: [0, 0], time: 0, background: [255, 255, 255] },
    { name: "light-tilt", ink: HERO_BANNER_INK_LIGHT, specGain: HERO_BANNER_SPEC_LIGHT, tilt: [-0.16, 0.3], time: 2.4, background: [255, 255, 255] },
    { name: "dark-tilt", ink: HERO_BANNER_INK_DARK, specGain: HERO_BANNER_SPEC_DARK, tilt: [-0.16, 0.3], time: 2.4, background: [31, 31, 31] },
    { name: "dark-tilt-alt", ink: HERO_BANNER_INK_DARK, specGain: HERO_BANNER_SPEC_DARK, tilt: [0.14, -0.28], time: 5.1, background: [31, 31, 31] },
    { name: "light-reveal", ink: HERO_BANNER_INK_LIGHT, specGain: HERO_BANNER_SPEC_LIGHT, tilt: [-0.1, 0.18], time: 0.5, reveal: 0.45, background: [255, 255, 255] },
  ]

  for (const scene of scenes) {
    banner.set({
      params: {
        ink: scene.ink,
        time: scene.time,
        tilt: scene.tilt,
        reveal: scene.reveal ?? 1,
        specGain: scene.specGain,
      },
    })
    banner.draw(colorTarget)
    const pixels = await colorTarget.read()
    let covered = 0
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 8) covered += 1
    const coverage = covered / (WIDTH * HEIGHT)
    console.log(`${scene.name}: coverage ${(coverage * 100).toFixed(2)}%`)
    if (coverage < 0.01 || coverage > 0.6) {
      throw new Error(`${scene.name}: unexpected coverage ${(coverage * 100).toFixed(2)}% — the logo should read as thin strokes`)
    }
    writePng(`${scene.name}.png`, compositeOverBackground(pixels, scene.background))
  }
} finally {
  gpu.dispose()
}
