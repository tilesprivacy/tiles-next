import { StandardSiteLinkTags } from "@/components/standard-site-link-tags"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StandardSiteLinkTags />
      {children}
    </>
  )
}
