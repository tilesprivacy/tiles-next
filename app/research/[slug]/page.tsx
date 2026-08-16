import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ResearchExplorationContent } from "@/components/research-exploration-content"
import { ResearchLogMdx } from "@/components/research-log-mdx"
import { getResearchLogEntryById, getResearchLogEntryIds } from "@/lib/research-log"

const baseUrl = "https://www.tiles.run"
const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

type ResearchExplorationPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getResearchLogEntryIds().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ResearchExplorationPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getResearchLogEntryById(slug)

  if (!entry) {
    return { title: "Research | Tiles" }
  }

  const pageUrl = `${baseUrl}/research/${entry.id}`
  const ogTitle = `${entry.title} | Research | Tiles`

  return {
    title: ogTitle,
    description: entry.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: ogTitle,
      description: entry.description,
      url: pageUrl,
      type: "article",
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          width: 1672,
          height: 941,
          type: "image/png",
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: entry.description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  }
}

export default async function ResearchExplorationPage({ params }: ResearchExplorationPageProps) {
  const { slug } = await params
  const entry = getResearchLogEntryById(slug)

  if (!entry) {
    notFound()
  }

  return (
    <ResearchExplorationContent entry={entry}>
      {entry.kind === "mdx" && entry.mdxSlug ? (
        <ResearchLogMdx slug={entry.mdxSlug} />
      ) : (
        <p>{entry.body ?? entry.description}</p>
      )}
    </ResearchExplorationContent>
  )
}
