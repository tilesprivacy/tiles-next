"use client"

import { useEffect, useState } from "react"

const STARS_CACHE_KEY = "tiles_github_stars_count"

function formatStarCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function useGithubStars() {
  const [starsLabel, setStarsLabel] = useState<string | null>(null)

  useEffect(() => {
    const cached = window.localStorage.getItem(STARS_CACHE_KEY)
    if (cached) {
      const parsed = Number(cached)
      if (Number.isFinite(parsed) && parsed >= 0) {
        setStarsLabel(formatStarCount(parsed))
      }
    }

    const updateStars = async () => {
      try {
        const response = await fetch("/api/github-stars", { cache: "no-store" })
        if (!response.ok) return

        const data = (await response.json()) as { stars?: number | null }
        if (typeof data.stars !== "number") return

        window.localStorage.setItem(STARS_CACHE_KEY, String(data.stars))
        setStarsLabel(formatStarCount(data.stars))
      } catch {
        // Keep cached value on fetch errors.
      }
    }

    void updateStars()
  }, [])

  return starsLabel
}
