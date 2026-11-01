<script lang="ts">
  import { calculateReadingTime } from "#lib/utils"

  let { content, className }: { content: string; className?: string } = $props()

  const minutes = $derived(calculateReadingTime(content))
</script>

<span class={className}>{minutes === 1 ? "1 min read" : `${minutes} min read`}</span>
