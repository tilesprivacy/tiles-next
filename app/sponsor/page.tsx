import type { Metadata } from "next"
import { SponsorContent } from "@/components/sponsor-content"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Sponsor | Tiles",
  description: "Support Tiles Privacy and help fund private, local-first AI.",
  openGraph: {
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Sponsor | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default async function SponsorPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
