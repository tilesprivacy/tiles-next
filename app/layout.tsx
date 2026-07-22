import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeFavicon } from "@/components/theme-favicon"
import SiteHeader from "@/components/site-header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { SiteOfflineCacheRegistrar } from "@/components/site-offline-cache-registrar"
import { TILES_PRODUCT_DESCRIPTION, TILES_SITE_TITLE } from "@/lib/product-description"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tiles.run"),
  title: TILES_SITE_TITLE,
  description: TILES_PRODUCT_DESCRIPTION,
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/icon-dark-96x96.png",
        sizes: "96x96",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-light-96x96.png",
        sizes: "96x96",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: TILES_SITE_TITLE,
    description: TILES_PRODUCT_DESCRIPTION,
    url: "https://www.tiles.run",
    siteName: "Tiles Privacy",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: TILES_SITE_TITLE,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TILES_SITE_TITLE,
    description: TILES_PRODUCT_DESCRIPTION,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-title" content="Tiles Privacy" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geist.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
          disableTransitionOnChange
          storageKey="tiles-theme"
        >
          <ThemeFavicon />
          <SiteOfflineCacheRegistrar />
          <AnnouncementBanner />
          <SiteHeader themeAware />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
