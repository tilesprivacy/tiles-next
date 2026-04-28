import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shared chat session | Tiles",
  description: "A shared chat session on Tiles.",
  openGraph: {
    title: "Shared chat session | Tiles",
    description: "A shared chat session on Tiles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shared chat session | Tiles",
    description: "A shared chat session on Tiles.",
  },
}

export default function ShareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
