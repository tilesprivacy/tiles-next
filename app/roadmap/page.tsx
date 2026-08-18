import type { Metadata } from "next"
import { Suspense } from "react"
import { RoadmapContent } from "@/components/roadmap-content"
import { getRoadmapNotesMap } from "@/lib/roadmap-notes-server"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Roadmap | Tiles",
  description: "Tiles roadmap and implementation priorities.",
  openGraph: {
    title: "Roadmap | Tiles",
    description: "Tiles roadmap and implementation priorities.",
    url: "https://www.tiles.run/roadmap",
    type: "website",
    images: [socialImage("Roadmap | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roadmap | Tiles",
    description: "Tiles roadmap and implementation priorities.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function RoadmapPage() {
  const notesBySlug = getRoadmapNotesMap()
  return (
    <Suspense
      fallback={<div className="min-h-[100dvh] bg-background" aria-hidden="true" />}
    >
      <RoadmapContent notesBySlug={notesBySlug} />
    </Suspense>
  )
}
