import type { Metadata } from "next"
import { ShareSessionClient } from "./share-session-client"

interface SharePageProps {
  params: Promise<{ session: string[] }>
}

export const metadata: Metadata = {
  title: "Shared chat session | Tiles",
  description: "A shared chat session on Tiles.",
  openGraph: {
    title: "Shared chat session | Tiles",
    description: "A shared chat session on Tiles.",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Shared chat session | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shared chat session | Tiles",
    description: "A shared chat session on Tiles.",
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
