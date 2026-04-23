import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeFavicon } from "@/components/theme-favicon"
import { SiteHeader } from "@/components/site-header"
import { SiteOfflineCacheRegistrar } from "@/components/site-offline-cache-registrar"
import { GlobalMobileDownloadPrompt } from "@/components/mobile-download-prompt"
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
  title: "Tiles: Local-first AI assistant built with decentralized technologies",
  description: "Local-first AI assistant built with decentralized technologies.",
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
    title: "Tiles: Local-first AI assistant built with decentralized technologies",
    description: "Built as an independent open-source project, based on standards and decentralized technologies.",
    url: "https://www.tiles.run",
    siteName: "Tiles Privacy",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles: Local-first AI assistant built with decentralized technologies",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles: Local-first AI assistant built with decentralized technologies",
    description: "Local-first AI assistant built with decentralized technologies.",
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
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-title" content="Tiles" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('tiles-theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${geist.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="tiles-theme"
        >
          <ThemeFavicon />
          <SiteOfflineCacheRegistrar />
          <SiteHeader themeAware />
          <GlobalMobileDownloadPrompt />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
