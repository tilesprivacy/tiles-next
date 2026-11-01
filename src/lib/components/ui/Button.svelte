<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "#lib/utils"

  let { class: className, children, ...rest }: HTMLButtonAttributes & { children?: Snippet } = $props()
</script>

<button
  data-slot="button"
  class={cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "bg-foreground text-background hover:bg-foreground/90",
    "h-9 px-4 py-2 has-[>svg]:px-3",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</button>
