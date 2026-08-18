import type { Metadata } from "next"
import { SponsorContent } from "@/components/sponsor-content"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Sponsor | Tiles",
  description: "Support Tiles Privacy and help fund private, local-first AI.",
  openGraph: {
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    type: "website",
    images: [socialImage("Sponsor | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default async function SponsorPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
