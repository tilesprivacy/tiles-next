import type { Metadata } from "next"
import { SponsorContent } from "@/components/sponsor-content"

const SPONSORS_PROGRESS_PERCENT_FALLBACK = "28%"

export const metadata: Metadata = {
  title: "Sponsor | Tiles",
  description: "Support Tiles Privacy and help fund private, local-first AI.",
  openGraph: {
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Sponsor | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    images: ["https://www.tiles.run/api/og"],
  },
}

async function getGithubSponsorsGoalData() {
  try {
    const response = await fetch("https://github.com/sponsors/tilesprivacy", {
      next: { revalidate: 21600 },
      headers: {
        "User-Agent": "Tiles Website",
      },
    })

    if (!response.ok) {
      return { goalAmountMonthly: null, progressPercent: null }
    }

    const html = await response.text()
    const goalMatch = html.match(/earn\s+\$([0-9,]+)\s+per month/i) ?? html.match(/towards\s+\$([0-9,]+)\s+per month/i)
    const progressMatch =
      html.match(/<p class="f5 text-bold mb-2">[\s\S]*?<span[^>]*>\s*([0-9]{1,3})%\s*<\/span>/i) ??
      html.match(/width:\s*([0-9]{1,3})%;[^>]*sponsors-goal-progress-bar/i)

    const parsedProgressPercent = progressMatch ? Number.parseInt(progressMatch[1], 10) : null
    const fallbackProgressPercent = Number.parseInt(SPONSORS_PROGRESS_PERCENT_FALLBACK, 10)
    const normalizedProgressPercent =
      parsedProgressPercent === null ? fallbackProgressPercent : Math.max(parsedProgressPercent, fallbackProgressPercent)

    return {
      goalAmountMonthly: goalMatch ? `$${goalMatch[1]} per month` : null,
      progressPercent: `${normalizedProgressPercent}%`,
    }
  } catch {
    return { goalAmountMonthly: null, progressPercent: SPONSORS_PROGRESS_PERCENT_FALLBACK }
  }
}

export default async function SponsorPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
