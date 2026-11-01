<script lang="ts">
  let { marginClass }: { marginClass: string } = $props()
</script>

<p class={`${marginClass} max-w-2xl text-sm leading-relaxed text-black/55 dark:text-[#9A9A9D]`}>
  Visual identity developed in collaboration with
  <a
    href="https://darkshapes.org"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
  >
    <img src="/darkshapes-logo.svg" alt="Darkshapes logo" width="14" height="14" class="h-3.5 w-auto" loading="lazy" decoding="async" />
    <span>Darkshapes</span></a
  >, an umbrella organization rethinking machine-learning tools that work for people, not corporations.
</p>
