<script lang="ts">
  import JsonLd from "./JsonLd.svelte"
  import type { BlogPostMeta } from "#lib/blog"
  import { getPersonById, splitPersonDisplayName } from "#lib/people"
  import { socialImageType, toBlogSocialImageUrl } from "#lib/standard-site"
  import StandardSiteLinkTags from "./StandardSiteLinkTags.svelte"

  let { post }: { post: BlogPostMeta } = $props()

  const url = $derived(`https://tiles.run/blog/${post.slug}`)
  const title = $derived(`${post.title} | Tiles Blog`)
  const image = $derived(toBlogSocialImageUrl(post.ogImage))
  const imageAlt = $derived(post.ogImageAlt ?? post.coverAlt ?? post.title)
  const published = $derived(`${post.publishDate}T00:00:00Z`)
  const person = $derived(post.author ? getPersonById(post.author) : null)
  const authorName = $derived(person ? splitPersonDisplayName(person.name).nameWithoutHandle : undefined)

  const structuredData = $derived({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: { "@type": "ImageObject", url: image, width: post.ogImageWidth, height: post.ogImageHeight },
        datePublished: published,
        dateModified: post.updatedAt ? `${post.updatedAt}T00:00:00Z` : published,
        author: person
          ? { "@type": "Person", "@id": `${url}#author`, name: authorName, url: person.links[0] }
          : undefined,
        publisher: {
          "@type": "Organization",
          "@id": "https://tiles.run/#organization",
          name: "Tiles Privacy",
          logo: { "@type": "ImageObject", url: "https://tiles.run/tiles_banner_outline_blk.svg" },
          url: "https://tiles.run",
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: post.keywords.length ? post.keywords : undefined,
        articleSection: post.section,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://tiles.run" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://tiles.run/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={post.description} />
  {#if post.keywords.length}<meta name="keywords" content={post.keywords.join(",")} />{/if}
  {#if authorName}<meta name="article:author" content={authorName} />{/if}
  <meta name="article:published_time" content={published} />
  {#if post.section}<meta name="article:section" content={post.section} />{/if}
  <link rel="canonical" href={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={post.description} />
  <meta property="og:url" content={url} />
  <meta property="og:site_name" content="Tiles Privacy" />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content={socialImageType(image)} />
  <meta property="og:image:width" content={String(post.ogImageWidth)} />
  <meta property="og:image:height" content={String(post.ogImageHeight)} />
  <meta property="og:image:alt" content={imageAlt} />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={published} />
  {#if authorName}<meta property="article:author" content={authorName} />{/if}
  {#if post.section}<meta property="article:section" content={post.section} />{/if}
  {#each post.keywords as tag (tag)}<meta property="article:tag" content={tag} />{/each}
  <meta name="twitter:card" content="summary_large_image" />
  {#if post.twitterCreator}<meta name="twitter:creator" content={post.twitterCreator} />{/if}
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={post.description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<JsonLd data={structuredData} />

<StandardSiteLinkTags documentUri={post.atUri} includePublication={false} />
