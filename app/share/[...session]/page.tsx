import type { Metadata } from "next"
import { ShareSessionClient } from "./share-session-client"

interface SharePageProps {
  params: Promise<{ session: string[] }>
}

export const metadata: Metadata = {
  title: "Shared Tiles session | Tiles",
  description: "A shared Tiles chat session.",
  openGraph: {
    title: "Shared Tiles session | Tiles",
    description: "A shared Tiles chat session.",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Shared Tiles session | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shared Tiles session | Tiles",
    description: "A shared Tiles chat session.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SharePage({ params }: SharePageProps) {
  const { session } = await params
  const shareToken = session.join("/")
  return <ShareSessionClient shareToken={shareToken} />
}
