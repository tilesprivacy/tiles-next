import { SPONSOR_PAGE_THEME } from "@/lib/sponsor-page-theme"

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.pageTheme=${JSON.stringify(SPONSOR_PAGE_THEME)};`,
        }}
      />
      {children}
    </>
  )
}
