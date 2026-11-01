<script lang="ts">
  import { formatBlogPostDate } from "#lib/blog"
  import BlogPostContent from "#lib/components/BlogPostContent.svelte"
  import BlogPostHead from "#lib/components/BlogPostHead.svelte"

  let { data } = $props()
  const post = $derived(data.post)
</script>

<BlogPostHead {post} />

<BlogPostContent
  title={post.title}
  description={post.description}
  date={formatBlogPostDate(post.date)}
  authorId={post.author}
  coverImage={post.showCover ? post.coverImage : undefined}
  coverImageDark={post.showCover ? post.coverImageDark : undefined}
  coverAlt={post.coverAlt ?? post.title}
  coverImageWidth={post.coverWidth}
  coverImageHeight={post.coverHeight}
  printCoverImage={post.coverImage}
  standardSiteDocumentUri={post.atUri}
  blueskyPostUri={post.blueskyPostUri}
  content={data.html}
  showTableOfContents={post.toc}
  tocItems={data.toc}
>
  {#if post.bodyClass}
    <div class={post.bodyClass}>{@html data.html}</div>
  {:else}
    {@html data.html}
  {/if}
</BlogPostContent>
