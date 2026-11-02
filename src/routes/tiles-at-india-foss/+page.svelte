<script lang="ts">
  import BlogPostContent from "#lib/components/BlogPostContent.svelte"
  import TalkArticle from "#lib/components/TalkArticle.svelte"
  import TalkDemoVideo from "#lib/components/TalkDemoVideo.svelte"
  import {
    ownYourAiBlogContent,
    ownYourAiSlideSrc,
    ownYourAiSlides,
    ownYourAiTalkIntro,
    ownYourAiTalkRecording,
  } from "#lib/own-your-ai-draft-talk"

  const title = "Tiles at India FOSS"
  const description = "An IndiaFOSS 2026 talk about open models, decentralized protocols, and user-owned AI"
  const published = "2026-09-27T00:00:00+05:30"
  const image = "https://tiles.run/own-your-ai-og.png"
</script>

<svelte:head>
  <title>{title} | Tiles Privacy</title>
  <meta name="description" content={description} />
  <meta name="article:author" content="Ankesh Bharti" />
  <meta name="article:published_time" content={published} />
  <link rel="canonical" href="https://tiles.run/tiles-at-india-foss" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="https://tiles.run/tiles-at-india-foss" />
  <meta property="og:site_name" content="Tiles Privacy" />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1672" />
  <meta property="og:image:height" content="941" />
  <meta property="og:image:alt" content={title} />
  <meta property="og:type" content="article" />
  <meta property="article:published_time" content={published} />
  <meta property="article:author" content="Ankesh Bharti" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@_feynon" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<BlogPostContent
  {title}
  {description}
  date="September 2026"
  authorId="ankesh-bharti"
  printCoverImage="/own-your-ai-og.png"
  content={ownYourAiBlogContent}
  showTableOfContents={false}
>
  <TalkArticle
    intro={ownYourAiTalkIntro}
    recording={ownYourAiTalkRecording}
    slides={ownYourAiSlides}
    slideSrc={ownYourAiSlideSrc}
    slideAlt={(slide) => `Slide ${slide.number}: ${slide.title}`}
  >
    {#snippet video({ class: className, active })}
      <TalkDemoVideo class="{className} bg-black" {active} />
    {/snippet}
  </TalkArticle>
</BlogPostContent>
