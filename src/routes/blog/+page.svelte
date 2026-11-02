<script lang="ts">
  import JsonLd from "#lib/components/JsonLd.svelte"
  import BlogListingContent from "#lib/components/BlogListingContent.svelte"
  import { getPersonById } from "#lib/people"
  import { BLOG_LISTING_SOCIAL_IMAGE_URL } from "#lib/standard-site"

  let { data } = $props()

  const title = "Blog | Tiles"
  const description = "We're building open source privacy technology for personalized software experiences."

  const structuredData = $derived({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://tiles.run/blog#blog",
        name: "Tiles Blog",
        description,
        url: "https://tiles.run/blog",
        publisher: {
          "@type": "Organization",
          "@id": "https://tiles.run/#organization",
          name: "Tiles Privacy",
          logo: { "@type": "ImageObject", url: "https://tiles.run/tiles_banner_outline_blk.svg" },
          url: "https://tiles.run",
        },
        blogPost: data.posts.map((post) => {
          const author = post.author ? getPersonById(post.author) : null
          return {
            "@type": "BlogPosting",
            "@id": `https://tiles.run/blog/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            url: `https://tiles.run/blog/${post.slug}`,
            datePublished: post.date.toISOString(),
            author: author ? { "@type": "Person", name: author.name, url: author.links[0] } : undefined,
            image: post.coverImage
              ? { "@type": "ImageObject", url: `https://tiles.run${post.coverImage}` }
              : undefined,
          }
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://tiles.run/blog#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://tiles.run" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://tiles.run/blog" },
        ],
      },
    ],
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="Tiles,privacy technology,open source,AI assistant,blog,engineering,Python,software development" />
  <link rel="canonical" href="https://tiles.run/blog" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="https://tiles.run/blog" />
  <meta property="og:site_name" content="Tiles Privacy" />
  <meta property="og:image" content={BLOG_LISTING_SOCIAL_IMAGE_URL} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={title} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={BLOG_LISTING_SOCIAL_IMAGE_URL} />
</svelte:head>

<JsonLd data={structuredData} />

<BlogListingContent posts={data.posts} />
