import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { AnalyticsConsent } from "@/components/analytics-consent"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeFavicon } from "@/components/theme-favicon"
import SiteHeader from "@/components/site-header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { SiteOfflineCacheRegistrar } from "@/components/site-offline-cache-registrar"
import { ScrollAtTopMarker } from "@/components/scroll-at-top-marker"
import { TILES_PRODUCT_DESCRIPTION, TILES_SITE_TITLE } from "@/lib/product-description"
import { getSocialImage } from "@/lib/social-image"
import { HOME_PAGE_THEME, HOME_PATH } from "@/lib/home-page-theme"
import { OWN_YOUR_AI_PAGE_THEME, OWN_YOUR_AI_PATH } from "@/lib/own-your-ai-theme"
import { SPONSOR_PAGE_THEME, SPONSOR_PATH } from "@/lib/sponsor-page-theme"
import { CYBERPUNK_THEME, DEFAULT_SITE_THEME } from "@/lib/site-theme"
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

const socialImage = getSocialImage()

const initialThemeScript = `(function(){try{var d=document.documentElement,p=location.pathname,t=null;if(p===${JSON.stringify(HOME_PATH)})t=${JSON.stringify(HOME_PAGE_THEME)};else if(p===${JSON.stringify(SPONSOR_PATH)}||p.indexOf(${JSON.stringify(`${SPONSOR_PATH}/`)})===0)t=${JSON.stringify(SPONSOR_PAGE_THEME)};else if(p===${JSON.stringify(OWN_YOUR_AI_PATH)}||p.indexOf(${JSON.stringify(`${OWN_YOUR_AI_PATH}/`)})===0)t=${JSON.stringify(OWN_YOUR_AI_PAGE_THEME)};if(t)d.dataset.pageTheme=t;else delete d.dataset.pageTheme;var k="tiles-theme",c=${JSON.stringify(CYBERPUNK_THEME)},v=null;try{v=localStorage.getItem(k);if(v===c){v="dark";localStorage.setItem(k,v);}}catch(e){}var dark=v==="dark"||(v!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dark);}catch(e){}})();`

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
      { ...socialImage, alt: TILES_SITE_TITLE },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TILES_SITE_TITLE,
    description: TILES_PRODUCT_DESCRIPTION,
    images: [socialImage.url],
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
        <meta name="apple-mobile-web-app-title" content="Tiles Privacy" />
      </head>
      <body className={`${geist.className} antialiased`}>
        <Script id="tiles-initial-theme" strategy="beforeInteractive">
          {initialThemeScript}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme={DEFAULT_SITE_THEME}
          disableTransitionOnChange
          storageKey="tiles-theme"
        >
          <ThemeFavicon />
          <SiteOfflineCacheRegistrar />
          <ScrollAtTopMarker />
          <AnnouncementBanner />
          <SiteHeader themeAware />
          {/* Marks page content for the Pagefind full-text index used by the
              top-nav AI search; chrome inside pages opts out with
              data-pagefind-ignore. */}
          <div style={{ display: "contents" }} data-pagefind-body>
            {children}
          </div>
        </ThemeProvider>
        <AnalyticsConsent />
      </body>
    </html>
  )
}
