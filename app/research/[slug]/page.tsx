import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ResearchExplorationContent } from "@/components/research-exploration-content"
import { ResearchLogMdx } from "@/components/research-log-mdx"
import { getResearchLogEntryById, getResearchLogEntryIds } from "@/lib/research-log"

const baseUrl = "https://www.tiles.run"

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
  const coverImage = entry.coverImage || "/og-image.jpg"

  return {
    title: `${entry.title} | Research | Tiles`,
    description: entry.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${entry.title} | Research | Tiles`,
      description: entry.description,
      url: pageUrl,
      type: "article",
      images: [
        {
          url: `${baseUrl}${coverImage}`,
          width: 1200,
          height: 630,
          alt: entry.coverAlt || entry.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | Research | Tiles`,
      description: entry.description,
      images: [`${baseUrl}${coverImage}`],
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
        <p>{entry.description}</p>
      )}
    </ResearchExplorationContent>
  )
}
