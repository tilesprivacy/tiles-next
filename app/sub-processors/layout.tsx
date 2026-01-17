import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Subprocessors",
  description: "Third-party subprocessors that Tiles uses to provide services.",
  openGraph: {
    title: "Tiles Subprocessors",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Subprocessors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Subprocessors",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    images: ["/api/og"],
  },
}

export default function SubProcessorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
