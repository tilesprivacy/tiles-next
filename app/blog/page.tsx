import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog-posts"
import { BlogListingContent } from "@/components/blog-listing-content"
import { getPersonById } from "@/lib/people"

export const metadata: Metadata = {
  title: "Blog | Tiles",
  description: "We're building open source privacy technology for personalized software experiences.",
  keywords: ["Tiles", "privacy technology", "open source", "AI assistant", "blog", "engineering", "Python", "software development"],
  alternates: {
    canonical: "https://www.tiles.run/blog",
  },
  openGraph: {
    title: "Blog | Tiles",
    description: "We're building open source privacy technology for personalized software experiences.",
    type: "website",
    url: "https://www.tiles.run/blog",
    siteName: "Tiles Privacy",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Blog | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Tiles",
    description: "We're building open source privacy technology for personalized software experiences.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function BlogPage() {
  // Serialize and sort posts (latest first) for the client component
  const serializedPosts = [...blogPosts]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      coverImage: post.coverImage ?? "/og-image.jpg",
      coverImageDark: post.coverImageDark ?? post.coverImage ?? "/og-image.jpg",
      coverAlt: post.coverAlt ?? post.title,
    }))

  // Generate structured data for the blog collection
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://www.tiles.run/blog#blog",
        name: "Tiles Blog",
        description: "We're building open source privacy technology for personalized software experiences.",
        url: "https://www.tiles.run/blog",
        publisher: {
          "@type": "Organization",
          "@id": "https://www.tiles.run/#organization",
          name: "Tiles Privacy",
          logo: {
            "@type": "ImageObject",
            url: "https://www.tiles.run/tiles_banner_outline_blk.svg",
          },
          url: "https://www.tiles.run",
        },
        blogPost: blogPosts.map(post => {
          const author = post.author ? getPersonById(post.author) : null
          return {
            "@type": "BlogPosting",
            "@id": `https://www.tiles.run/blog/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            url: `https://www.tiles.run/blog/${post.slug}`,
            datePublished: post.date.toISOString(),
            author: author
              ? {
                  "@type": "Person",
                  name: author.name,
                  url: author.links[0],
                }
              : undefined,
            image: post.coverImage
              ? {
                  "@type": "ImageObject",
                  url: `https://www.tiles.run${post.coverImage}`,
                }
              : undefined,
          }
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.tiles.run/blog#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.tiles.run",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.tiles.run/blog",
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogListingContent posts={serializedPosts} />
    </>
  )
}
