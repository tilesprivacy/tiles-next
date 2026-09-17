import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { SponsorContent } from "@/components/sponsor-content"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"

const socialImage = getSocialImage("About")

export const metadata: Metadata = {
  title: "About | Tiles",
  description:
    "Learn about Tiles Privacy, the team and advisors behind it, and how to support our work.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Tiles",
    description:
      "Learn about Tiles Privacy, the team and advisors behind it, and how to support our work.",
    type: "website",
    url: "/about",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Tiles",
    description:
      "Learn about Tiles Privacy, the team and advisors behind it, and how to support our work.",
    images: [socialImage.url],
  },
}

export default async function AboutPage() {
  const sponsorsGoal = await getGithubSponsorsGoalData()
  return <SponsorContent sponsorsGoal={sponsorsGoal} />
}
