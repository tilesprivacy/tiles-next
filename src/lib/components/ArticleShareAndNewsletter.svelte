<script lang="ts">
  import { onMount } from "svelte"
  import { TILES_PRODUCT_DESCRIPTION_CORE, TILES_PRODUCT_TECHNOLOGY_LINE } from "#lib/product-description"
  import ArticlePrintButton from "./ArticlePrintButton.svelte"
  import NewsletterCta from "./NewsletterCta.svelte"
  import FaBluesky from "./icons/FaBluesky.svelte"
  import FaLink from "./icons/FaLink.svelte"
  import FaLinkedinIn from "./icons/FaLinkedinIn.svelte"
  import FaMastodon from "./icons/FaMastodon.svelte"
  import FaRedditAlien from "./icons/FaRedditAlien.svelte"
  import FaXTwitter from "./icons/FaXTwitter.svelte"

  let {
    title,
    moreLinkHref,
    moreLinkLabel,
    showIntro = true,
  }: {
    title: string
    moreLinkHref: string
    moreLinkLabel: string
    /** Hide the product-blurb intro when the page renders its own outro copy. */
    showIntro?: boolean
  } = $props()

  let shareUrl = $state<string | null>(null)
  let copied = $state(false)

  onMount(() => {
    shareUrl = window.location.href
  })

  const shareText = $derived(shareUrl ? encodeURIComponent(`${title}: ${shareUrl}`) : "")
  const shareUrlEncoded = $derived(shareUrl ? encodeURIComponent(shareUrl) : "")
  const shareTitleEncoded = $derived(encodeURIComponent(title))

  function handleCopyLink() {
    if (!shareUrl) return
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl)
      copied = true
      window.setTimeout(() => (copied = false), 1400)
      return
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  const shareIconClass =
    "h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5"
  const copyLabelClass =
    "text-[11px] text-black/50 transition-colors hover:text-black/70 dark:text-white/50 dark:hover:text-white/70 lg:text-xs"
  const shareLabelClass = "text-xs text-black/45 dark:text-white/45"
</script>

<div class="mx-auto mt-10 w-full max-w-[44rem] lg:mt-12" data-pagefind-ignore="all">
  {#if showIntro}
    <div class="space-y-2 text-xs text-black/60 dark:text-white/60 lg:text-sm">
      <p>
        <span class="block">{TILES_PRODUCT_DESCRIPTION_CORE}</span>
        <span class="block">{TILES_PRODUCT_TECHNOLOGY_LINE}</span>
      </p>
      <p>
        There are <a href={moreLinkHref} class="text-black underline hover:text-black/80 dark:text-white dark:hover:text-white/80">{moreLinkLabel}</a>.
      </p>
      <p>Keep on Tiling!</p>
    </div>
  {/if}

  <div class={showIntro ? "mt-8 lg:mt-10" : ""}>
    <ArticlePrintButton />
    <p class="{shareLabelClass} mt-4">Share this:</p>
    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {#if shareUrl}
        <a href="https://twitter.com/intent/tweet?text={shareText}" target="_blank" rel="noopener noreferrer" aria-label="Share on X" class="inline-flex items-center justify-center">
          <FaXTwitter class={shareIconClass} />
        </a>
        <a href="https://bsky.app/intent/compose?text={shareText}" target="_blank" rel="noopener noreferrer" aria-label="Share on Bluesky" class="inline-flex items-center justify-center">
          <FaBluesky class={shareIconClass} />
        </a>
        <a href="https://mastodon.social/share?text={shareText}" target="_blank" rel="noopener noreferrer" aria-label="Share on Mastodon" class="inline-flex items-center justify-center">
          <FaMastodon class={shareIconClass} />
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url={shareUrlEncoded}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" class="inline-flex items-center justify-center">
          <FaLinkedinIn class={shareIconClass} />
        </a>
        <a href="https://www.reddit.com/submit?url={shareUrlEncoded}&title={shareTitleEncoded}" target="_blank" rel="noopener noreferrer" aria-label="Share on Reddit" class="inline-flex items-center justify-center">
          <FaRedditAlien class={shareIconClass} />
        </a>
        <button type="button" onclick={handleCopyLink} aria-label="Copy link" class="inline-flex items-center justify-center">
          <FaLink class={shareIconClass} />
        </button>
        <button type="button" onclick={handleCopyLink} aria-label={copied ? "Copied link" : "Copy link"} class={copyLabelClass}>
          {copied ? "Copied" : "Copy link"}
        </button>
      {/if}
    </div>
  </div>
</div>

<section
  data-blog-newsletter
  data-pagefind-ignore="all"
  class="mx-auto mt-10 w-full max-w-[44rem] border-y border-black/8 py-6 dark:border-white/12 lg:mt-12 lg:py-7"
>
  <NewsletterCta />
</section>
