import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Download Tiles",
  description: "Download Tiles, a private and secure AI assistant for everyday use",
  openGraph: {
    title: "Download Tiles",
    description: "Download Tiles, a private and secure AI assistant for everyday use",
  },
  twitter: {
    title: "Download Tiles",
    description: "Download Tiles, a private and secure AI assistant for everyday use",
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
