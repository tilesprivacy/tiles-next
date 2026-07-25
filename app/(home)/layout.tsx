import { HOME_PAGE_THEME } from "@/lib/home-page-theme"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.pageTheme=${JSON.stringify(HOME_PAGE_THEME)};`,
        }}
      />
      {children}
    </>
  )
}
