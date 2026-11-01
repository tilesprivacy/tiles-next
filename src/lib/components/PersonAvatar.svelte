<script lang="ts" module>
  const VARIANTS = {
    default: {
      // Twice the largest rendered size, so retina screens stay sharp.
      size: 48,
      img: "h-6 w-6 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15",
      initials:
        "inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[10px] font-semibold text-black/70 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/80 dark:ring-white/15",
    },
    /** Small square thumb that matches the blog listing covers and meta text. */
    blog: {
      size: 40,
      img: "h-5 w-5 rounded-sm object-cover",
      initials:
        "inline-flex h-5 w-5 items-center justify-center rounded-sm bg-black/[0.04] text-[9px] font-medium tracking-tight text-black/45 dark:bg-white/[0.06] dark:text-white/45",
    },
  } as const
</script>

<script lang="ts">
  import { getAvatarUrlCandidates, getPersonInitials } from "#lib/person-avatar"

  let {
    name,
    links,
    className,
    variant = "default",
    loading = "lazy",
  }: {
    name: string
    links: string[]
    /** Optional wrapper class (e.g. shrink-0). */
    className?: string
    variant?: keyof typeof VARIANTS
    loading?: "eager" | "lazy"
  } = $props()

  // Committed local avatars first, then unavatar.io lookups; initials when all fail.
  const candidates = $derived(getAvatarUrlCandidates(links))
  const styles = $derived(VARIANTS[variant])
  let failedCount = $state(0)
  const activeUrl = $derived(candidates[failedCount])
</script>

{#snippet avatar()}
  {#if activeUrl}
    {#key activeUrl}
      <img
        src={activeUrl}
        alt=""
        width={styles.size}
        height={styles.size}
        class={styles.img}
        referrerpolicy="no-referrer"
        {loading}
        decoding="async"
        onerror={() => (failedCount += 1)}
      />
    {/key}
  {:else}
    <span class={styles.initials}>{getPersonInitials(name)}</span>
  {/if}
{/snippet}

{#if className}
  <span class={className}>{@render avatar()}</span>
{:else}
  {@render avatar()}
{/if}
