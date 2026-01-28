import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tiles.run"),
  title: "Tiles Privacy – Your private AI assistant for everyday use",
  description: "Tiles Privacy is your private AI assistant for everyday use. Keep your memory, notes, and workflows private on your own device.",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Tiles Privacy – Your private AI assistant for everyday use",
    description: "Tiles Privacy is your private AI assistant for everyday use. Keep your memory, notes, and workflows private on your own device.",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Privacy – Your private AI assistant for everyday use",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Privacy – Your private AI assistant for everyday use",
    description: "Tiles Privacy is your private AI assistant for everyday use. Keep your memory, notes, and workflows private on your own device.",
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
          <SiteHeader themeAware />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
