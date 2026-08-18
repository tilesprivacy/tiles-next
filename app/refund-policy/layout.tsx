import type { Metadata } from "next"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

const description =
  "Read the Tiles Refund Policy and 7-day money-back guarantee for Tiles Pro."

export const metadata: Metadata = {
  title: "Refund Policy | Tiles",
  description,
  openGraph: {
    title: "Refund Policy | Tiles",
    description,
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Refund Policy | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | Tiles",
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
