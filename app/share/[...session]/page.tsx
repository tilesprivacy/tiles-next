import type { Metadata } from "next"
import { ShareSessionClient } from "./share-session-client"

interface SharePageProps {
  params: Promise<{ session: string[] }>
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { session } = await params
  const shareToken = session.join("/")
  const imagePath = `https://www.tiles.run/api/share/og?session=${encodeURIComponent(shareToken)}`

  return {
    title: "Shared chat session | Tiles",
    description: "Shared chat session on Tiles. Powered by ATProto.",
    openGraph: {
      title: "Shared chat session | Tiles",
      description: "Shared chat session on Tiles. Powered by ATProto.",
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: "Shared chat session on Tiles. Powered by ATProto.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Shared chat session | Tiles",
      description: "Shared chat session on Tiles. Powered by ATProto.",
      images: [imagePath],
    },
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SharePage({ params }: SharePageProps) {
  const { session } = await params
  const shareToken = session.join("/")
  return <ShareSessionClient shareToken={shareToken} />
}
