import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { SponsorContent } from "@/components/sponsor-content"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"

const socialImage = getSocialImage("Sponsor")

export const metadata: Metadata = {
  title: "Sponsor | Tiles",
  description: "Support Tiles Privacy and help fund private, local-first AI.",
  openGraph: {
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsor | Tiles",
    description: "Support Tiles Privacy and help fund private, local-first AI.",
    images: [socialImage.url],
  },
}

export default async function SponsorPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
