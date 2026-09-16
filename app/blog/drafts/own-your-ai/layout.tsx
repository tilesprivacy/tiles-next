import type { Metadata } from "next"

const title = "Own your AI with local models and open protocols | Tiles Blog"
const description = "A talk about local models, decentralized protocols, and user-owned AI"

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function OwnYourAiDraftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
