import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Download Tiles",
  description: "Download Tiles, a private AI assistant with offline memory",
  openGraph: {
    title: "Download Tiles",
    description: "Download Tiles, a private AI assistant with offline memory",
  },
  twitter: {
    title: "Download Tiles",
    description: "Download Tiles, a private AI assistant with offline memory",
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
