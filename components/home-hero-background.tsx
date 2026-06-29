"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const PARTICLE_COUNT_DESKTOP = 52
const PARTICLE_COUNT_MOBILE = 30
const LINK_DISTANCE = 132
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE

function createParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    radius: Math.random() * 1.1 + 1.1,
  }))
}

function getPalette(isDark: boolean) {
  return isDark
    ? {
        dot: "rgba(245, 245, 247, 0.22)",
        glow: "rgba(100, 181, 246, 0.14)",
      }
    : {
        dot: "rgba(29, 29, 31, 0.16)",
        glow: "rgba(100, 181, 246, 0.1)",
      }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  width: number,
  height: number,
  isDark: boolean,
  animate: boolean,
) {
  const palette = getPalette(isDark)
  ctx.clearRect(0, 0, width, height)

  const glow = ctx.createRadialGradient(width * 0.58, height * 0.34, 0, width * 0.58, height * 0.34, width * 0.42)
  glow.addColorStop(0, palette.glow)
  glow.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)

  if (animate) {
    for (const particle of particles) {
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.x < -12) particle.x = width + 12
      if (particle.x > width + 12) particle.x = -12
      if (particle.y < -12) particle.y = height + 12
      if (particle.y > height + 12) particle.y = -12
    }
  }

  ctx.lineWidth = 1
  const lineBaseAlpha = isDark ? 0.09 : 0.07
  const lineRgb = isDark ? "245, 245, 247" : "29, 29, 31"
  for (let i = 0; i < particles.length; i += 1) {
    const a = particles[i]
    for (let j = i + 1; j < particles.length; j += 1) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distSq = dx * dx + dy * dy
      if (distSq > LINK_DISTANCE_SQ) continue

      const alpha = 1 - Math.sqrt(distSq) / LINK_DISTANCE
      ctx.strokeStyle = `rgba(${lineRgb}, ${alpha * lineBaseAlpha})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  ctx.fillStyle = palette.dot
  for (const particle of particles) {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function HomeHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frameId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = width < 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
      particles = createParticles(width, height, count)
    }

    const render = () => {
      const isDark = document.documentElement.classList.contains("dark")
      drawFrame(context, particles, width, height, isDark, !media.matches)
      if (!media.matches) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    resize()
    render()

    const resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    const handleMotionChange = () => {
      window.cancelAnimationFrame(frameId)
      render()
    }

    media.addEventListener("change", handleMotionChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      media.removeEventListener("change", handleMotionChange)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-90 [mask-image:radial-gradient(ellipse_88%_72%_at_54%_30%,black_18%,transparent_78%)] sm:[mask-image:radial-gradient(ellipse_90%_74%_at_56%_32%,black_20%,transparent_80%)]"
    />
  )
}
