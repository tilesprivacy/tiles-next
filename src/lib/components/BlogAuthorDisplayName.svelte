<script lang="ts">
  import { splitPersonDisplayName } from "#lib/people"

  let {
    fullName,
    className,
    handleClassName,
  }: { fullName: string; className?: string; handleClassName?: string } = $props()

  const parts = $derived(splitPersonDisplayName(fullName))
</script>

<span class={className}>{parts.nameWithoutHandle}{#if parts.handle}{" "}<span class={handleClassName}>{parts.handle}</span>{/if}</span>
