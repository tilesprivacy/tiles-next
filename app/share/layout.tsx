import type { Metadata } from "next"

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

export default function ShareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
