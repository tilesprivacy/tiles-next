<script lang="ts">
  import FaRss from "./icons/FaRss.svelte"
  import NewsletterForm from "./NewsletterForm.svelte"
  import { DISCORD_URL } from "#lib/community-links"

  const linkClass = "text-black hover:text-black/65 dark:text-[#e7e7ed] dark:hover:text-[#c6c6cf]"
</script>

<div class="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-7">
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <h2 class="text-[0.95rem] font-normal tracking-tight text-black dark:text-white">Stay updated</h2>
      <a
        href="/api/rss"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center transition-colors {linkClass}"
        aria-label="RSS Feed for blog posts"
      >
        <FaRss class="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
    <p class="text-[0.84rem] leading-6 text-black/70 dark:text-[#b8b8c2]">
      Follow development in <a href={DISCORD_URL} class="underline transition-colors {linkClass}"
        >Discord</a
      > or via email.
    </p>
  </div>
  <NewsletterForm />
</div>
