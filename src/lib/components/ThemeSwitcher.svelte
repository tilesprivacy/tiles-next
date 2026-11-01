<script lang="ts">
  import { theme, type ThemeChoice } from "#lib/theme.svelte"

  // Cycles light -> dark -> system. The 24px chip keeps a 44px tap target.
  const NEXT: Record<ThemeChoice, ThemeChoice> = { light: "dark", dark: "system", system: "light" }

  const isDark = $derived(theme.resolved === "dark")
  const selected = $derived(theme.choice)
  const next = $derived(NEXT[selected])
  const focusRing = $derived(isDark ? "focus-visible:ring-white/25" : "focus-visible:ring-black/25")
</script>

{#if !theme.mounted}
  <!-- Same footprint before hydration, so the header doesn't shift. -->
  <span aria-hidden="true" class="inline-flex h-6 shrink-0 items-center rounded-sm bg-foreground/[0.06] pointer-events-none">
    <span class="relative flex h-6 w-6 items-center justify-center">
      <span class="inline-flex h-5 w-5 items-center justify-center h-4 w-4 opacity-0"></span>
    </span>
  </span>
{:else}
  <div class="inline-flex shrink-0 items-center rounded-sm leading-none {isDark ? 'bg-white/[0.07]' : 'bg-black/[0.055]'} h-6">
    <div class="relative flex h-6 w-6 items-center justify-center">
      <button
        type="button"
        onclick={() => theme.set(next)}
        class="absolute -inset-[calc((2.75rem-1.5rem)/2)] z-[1] inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border-0 bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 {focusRing}"
        aria-label="Theme: {selected}. Click to switch to {next}."
        title="Theme: {selected.toUpperCase()} (click for {next.toUpperCase()})"
      >
        <span
          class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 {focusRing} {isDark
            ? 'text-white/58 hover:text-white'
            : 'text-black/55 hover:text-black'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class={selected === "dark" ? "h-4 w-4 scale-90" : "h-4 w-4"}>
            {#if selected === "light"}
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
            {:else if selected === "dark"}
              <!-- The moon fills its box more densely, hence scale-90 above. -->
              <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
            {:else}
              <path fill-rule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.485-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clip-rule="evenodd" />
            {/if}
          </svg>
        </span>
      </button>
    </div>
  </div>
{/if}
