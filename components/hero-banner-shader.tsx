"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import {
  HERO_BANNER_INK_DARK,
  HERO_BANNER_INK_LIGHT,
  HERO_BANNER_RASTER_HEIGHT,
  HERO_BANNER_RASTER_PAD,
  HERO_BANNER_RASTER_WIDTH,
  HERO_BANNER_SPEC_DARK,
  HERO_BANNER_SPEC_LIGHT,
  HERO_BANNER_WGSL,
} from "@/lib/hero-banner-shader-gpu"
import { isDarkResolvedTheme } from "@/lib/site-theme"

/**
 * The banner logo inside the hero MacBook, rendered as a WebGPU 3D shader
 * (vgpu). The static light/dark SVG pair stays in the DOM as the initial
 * paint and the fallback for browsers without WebGPU; once the shader draws
 * its first frame the canvas cross-fades in over the images.
 *
 * Preview the shader headlessly with
 * `node --experimental-strip-types scripts/render-hero-banner-shader.mjs`.
 */
export function HeroBannerShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<HeroBannerRenderer | null>(null)
  const [shaderActive, setShaderActive] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    const renderer = createHeroBannerRenderer(canvas, {
      onFirstFrame: () => {
        if (!cancelled) setShaderActive(true)
      },
      onFail: () => {
        if (!cancelled) setShaderActive(false)
      },
    })
    rendererRef.current = renderer
    return () => {
      cancelled = true
      rendererRef.current = null
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (resolvedTheme) rendererRef.current?.setDark(isDarkResolvedTheme(resolvedTheme))
  }, [resolvedTheme])

  return (
    <div
      className={`minimal-hero-banner-stage${shaderActive ? " minimal-hero-banner-stage--shader" : ""}`}
    >
      <Image
        src="/tiles_banner_outline_blk.svg"
        alt=""
        width={1200}
        height={220}
        className="dark:hidden"
      />
      <Image
        src="/tiles_banner_outline_wht.svg"
        alt=""
        width={1200}
        height={220}
        className="hidden bg-background dark:block"
      />
      <canvas ref={canvasRef} className="minimal-hero-banner-canvas" />
    </div>
  )
}

interface HeroBannerRenderer {
  setDark(dark: boolean): void
  dispose(): void
}

interface RendererCallbacks {
  onFirstFrame: () => void
  onFail: () => void
}

const FRAME_INTERVAL_MS = 33
/** Resting pose: a slight pitch/yaw so the extrusion reads even while idle. */
const IDLE_TILT: readonly [number, number] = [-0.09, 0.14]
const DRIFT_AMPLITUDE: readonly [number, number] = [0.045, 0.07]
const POINTER_TILT: readonly [number, number] = [0.18, 0.26]
const TILT_SMOOTHING_SECONDS = 0.25

function createHeroBannerRenderer(
  canvas: HTMLCanvasElement,
  callbacks: RendererCallbacks,
): HeroBannerRenderer {
  let disposed = false
  let dark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  let reduceMotion = false
  let visible = true
  let pointer: readonly [number, number] | null = null
  // Start flat so the cross-fade from the static image is seamless; the
  // smoothing then eases the logo into its idle 3D pose.
  let tilt: [number, number] = [0, 0]
  let lastTime = 0
  let lastRender = -Infinity
  let animationFrame = 0
  let drawFrame: ((timeSeconds: number, reveal: number) => void) | undefined
  let disposeGpu: (() => void) | undefined
  const cleanups: Array<() => void> = []

  const fail = () => {
    callbacks.onFail()
    dispose()
  }

  const dispose = () => {
    if (disposed) return
    disposed = true
    if (animationFrame) cancelAnimationFrame(animationFrame)
    for (const cleanup of cleanups.splice(0)) {
      try {
        cleanup()
      } catch {
        // Teardown continues past individual cleanup failures.
      }
    }
    try {
      disposeGpu?.()
    } catch {
      // The device may already be lost; nothing left to release.
    }
  }

  const renderStill = () => {
    // Single frame for reduced motion: settled pose, fully revealed.
    drawFrame?.(2, 1)
  }

  const loop = (now: number) => {
    if (disposed) return
    animationFrame = requestAnimationFrame(loop)
    if (!visible || !drawFrame || now - lastRender < FRAME_INTERVAL_MS) return
    lastRender = now
    const time = now / 1000
    const dt = Math.min(Math.max(time - lastTime, 0), 0.1)
    lastTime = time

    const drift: [number, number] = [
      IDLE_TILT[0] + Math.sin(time * 0.33) * DRIFT_AMPLITUDE[0],
      IDLE_TILT[1] + Math.cos(time * 0.26) * DRIFT_AMPLITUDE[1],
    ]
    const target: [number, number] = pointer
      ? [
          IDLE_TILT[0] + pointer[1] * POINTER_TILT[0],
          IDLE_TILT[1] + pointer[0] * POINTER_TILT[1],
        ]
      : drift
    const alpha = 1 - Math.exp(-dt / TILT_SMOOTHING_SECONDS)
    tilt = [tilt[0] + (target[0] - tilt[0]) * alpha, tilt[1] + (target[1] - tilt[1]) * alpha]

    drawFrame(time, 1)
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return
    const rect = canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width
    const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height
    // Full influence over the device, fading out ~1.6 canvas boxes away.
    const falloff = Math.min(1, Math.max(0, 1.6 - Math.max(Math.abs(nx), Math.abs(ny))))
    if (falloff <= 0) {
      pointer = null
      return
    }
    const clamp = (value: number) => Math.min(1, Math.max(-1, value))
    pointer = [clamp(nx) * falloff, clamp(ny) * falloff]
  }

  const handlePointerLeave = () => {
    pointer = null
  }

  const initialize = async () => {
    if (typeof navigator === "undefined" || !navigator.gpu) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduceMotion = motionQuery.matches

    const [{ init, surface, effect, frame, sampler }, logoCanvas] = await Promise.all([
      import("vgpu"),
      rasterizeBannerLogo(),
    ])
    if (disposed) return

    const gpu = await init({ label: "hero-banner-shader" })
    if (disposed) {
      // dispose() already ran during the await, so release the device here.
      gpu.dispose()
      return
    }
    disposeGpu = () => gpu.dispose()
    cleanups.push(
      gpu.onError(() => {
        if (!disposed) fail()
      }),
    )
    // A lost device (driver reset, tab GPU eviction) leaves the canvas blank;
    // surface the static images again instead.
    void gpu.gpu.lost.then((info) => {
      if (!disposed && info.reason !== "destroyed") fail()
    })

    const texture = gpu.gpu.createTexture({
      label: "hero-banner-logo",
      size: [logoCanvas.width, logoCanvas.height],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.RENDER_ATTACHMENT,
    })
    cleanups.push(() => texture.destroy())
    gpu.gpu.queue.copyExternalImageToTexture({ source: logoCanvas }, { texture }, [
      logoCanvas.width,
      logoCanvas.height,
    ])

    const canvasSurface = surface(gpu, canvas, {
      label: "hero-banner-surface",
      dpr: [1, 2],
      clearColor: [0, 0, 0, 0],
    })
    const banner = effect(gpu, HERO_BANNER_WGSL, {
      label: "hero-banner",
      set: {
        logoTex: texture,
        logoSamp: sampler(gpu, {
          minFilter: "linear",
          magFilter: "linear",
          addressModeU: "clamp-to-edge",
          addressModeV: "clamp-to-edge",
        }),
        params: {
          ink: HERO_BANNER_INK_LIGHT,
          time: 0,
          tilt: IDLE_TILT,
          reveal: 0,
          specGain: HERO_BANNER_SPEC_LIGHT,
        },
      },
    })
    // Surfaces are only usable inside frame(); pre-warm via their signature.
    await banner.compile({
      colors: [canvasSurface.format],
      sampleCount: canvasSurface.sampleCount,
    })
    if (disposed) return

    drawFrame = (timeSeconds, reveal) => {
      banner.set({
        params: {
          ink: dark ? HERO_BANNER_INK_DARK : HERO_BANNER_INK_LIGHT,
          time: timeSeconds,
          tilt,
          reveal,
          specGain: dark ? HERO_BANNER_SPEC_DARK : HERO_BANNER_SPEC_LIGHT,
        },
      })
      frame(gpu, (currentFrame) => currentFrame.pass(canvasSurface, banner))
    }

    lastTime = performance.now() / 1000

    const handleMotionChange = () => {
      reduceMotion = motionQuery.matches
      if (disposed) return
      if (reduceMotion) {
        if (animationFrame) cancelAnimationFrame(animationFrame)
        animationFrame = 0
        tilt = [...IDLE_TILT]
        renderStill()
      } else if (!animationFrame) {
        animationFrame = requestAnimationFrame(loop)
      }
    }
    motionQuery.addEventListener("change", handleMotionChange)
    cleanups.push(() => motionQuery.removeEventListener("change", handleMotionChange))

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? true
      })
      observer.observe(canvas)
      cleanups.push(() => observer.disconnect())
    }

    if (reduceMotion) {
      renderStill()
      // Layout-driven surface resizes only apply at a frame boundary, so
      // re-render stills as the hero scales with the viewport.
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => {
          if (!disposed) renderStill()
        })
        observer.observe(canvas)
        cleanups.push(() => observer.disconnect())
      }
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true })
      window.addEventListener("pointercancel", handlePointerLeave)
      window.addEventListener("blur", handlePointerLeave)
      cleanups.push(() => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointercancel", handlePointerLeave)
        window.removeEventListener("blur", handlePointerLeave)
      })
      drawFrame(lastTime, 1)
      animationFrame = requestAnimationFrame(loop)
    }
    callbacks.onFirstFrame()
  }

  // Deferring init one frame lets React strict mode's mount/cleanup/mount
  // cycle cancel the first renderer before it ever creates a GPU device.
  const startFrame = requestAnimationFrame(() => {
    initialize().catch((error: unknown) => {
      // No WebGPU adapter, canceled decode, or a lost device: the static
      // banner images simply stay visible.
      console.debug("Hero banner shader unavailable:", error)
      if (!disposed) fail()
    })
  })
  cleanups.push(() => cancelAnimationFrame(startFrame))

  return {
    setDark(nextDark) {
      if (dark === nextDark) return
      dark = nextDark
      if (!disposed && reduceMotion) renderStill()
    },
    dispose,
  }
}

/** Rasterize the black outline SVG; the shader only reads its alpha mask. */
async function rasterizeBannerLogo(): Promise<HTMLCanvasElement> {
  const image = document.createElement("img")
  image.decoding = "async"
  image.src = "/tiles_banner_outline_blk.svg"
  await image.decode()
  const raster = document.createElement("canvas")
  raster.width = HERO_BANNER_RASTER_WIDTH
  raster.height = HERO_BANNER_RASTER_HEIGHT
  const context = raster.getContext("2d")
  if (!context) throw new Error("Could not create the banner raster canvas.")
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  const pad = HERO_BANNER_RASTER_PAD
  context.drawImage(image, pad, pad, raster.width - pad * 2, raster.height - pad * 2)
  return raster
}
