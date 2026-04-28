import type { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function ShareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
