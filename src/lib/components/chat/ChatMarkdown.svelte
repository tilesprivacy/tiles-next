<script lang="ts">
  import type { RenderedMarkdown } from "#lib/chat/markdown"

  let { markdown }: { markdown: RenderedMarkdown } = $props()
</script>

<div class="grid gap-3">
  {#if markdown.frontmatter.length}
    <dl class="share-markdown-frontmatter">
      {#each markdown.frontmatter as { key, value }, index (index)}
        <div
          class="grid gap-1 border-b border-black/8 py-2 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3"
        >
          <dt class="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-black/42 dark:text-white/42">{key}</dt>
          <dd class="min-w-0 break-words text-[0.86rem] leading-5 text-black/72 dark:text-white/72">{value}</dd>
        </div>
      {/each}
    </dl>
  {/if}
  <!-- Sanitized by the strict allowlist in #lib/chat/markdown before it gets here. -->
  <div class="space-y-4 whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 share-markdown break-words">
    {@html markdown.html}
  </div>
</div>
