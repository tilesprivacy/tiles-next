<script lang="ts">
  import { formatBlogPostDate } from "#lib/blog-date"
  import BlogPostContent from "#lib/components/BlogPostContent.svelte"
  import BlogPostHead from "#lib/components/BlogPostHead.svelte"
  import TalkArticle from "#lib/components/TalkArticle.svelte"
  import {
    ownYourAiBlogContent,
    ownYourAiSlideSrc,
    ownYourAiSlides,
    ownYourAiTalkIntro,
    ownYourAiTalkRecording,
    ownYourAiVideoSrc,
  } from "#lib/own-your-ai-talk"

  let { data } = $props()
  const post = $derived(data.post)
</script>

<BlogPostHead {post} />

<BlogPostContent
  title={post.title}
  description={post.description}
  date={formatBlogPostDate(post.date)}
  authorId={post.author}
  printCoverImage={post.coverImage}
  standardSiteDocumentUri={post.atUri}
  blueskyPostUri={post.blueskyPostUri}
  content={ownYourAiBlogContent}
  showTableOfContents={false}
>
  <TalkArticle
    intro={ownYourAiTalkIntro}
    recording={ownYourAiTalkRecording}
    slides={ownYourAiSlides}
    slideSrc={ownYourAiSlideSrc}
    slideAlt={(slide, placement) => (placement === "stage" ? "" : `Slide ${slide.number}`)}
  >
    {#snippet video({ class: className })}
      <video class={className} controls playsinline preload="metadata" aria-label="Slide 26 demo video">
        <source src={ownYourAiVideoSrc()} type="video/mp4" />
      </video>
    {/snippet}
  </TalkArticle>
</BlogPostContent>
