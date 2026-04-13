import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About | Tiles",
  description: "Get to know Tiles Privacy, our contributors, and sponsors.",
  openGraph: {
    title: "About | Tiles",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "About | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Tiles",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
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
    const progressMatch = html.match(/width:\s*([0-9]{1,3})%;[^>]*sponsors-goal-progress-bar/i)

    return {
      goalAmountMonthly: goalMatch ? `$${goalMatch[1]} per month` : null,
      progressPercent: progressMatch ? `${progressMatch[1]}%` : null,
    }
  } catch {
    return { goalAmountMonthly: null, progressPercent: null }
  }
}

export default async function AboutPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <AboutContent sponsorsGoal={sponsorsGoal} />
}
