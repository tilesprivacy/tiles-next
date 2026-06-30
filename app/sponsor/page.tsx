import type { Metadata } from "next"
import { SponsorContent } from "@/components/sponsor-content"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"

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

export default async function SponsorPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
