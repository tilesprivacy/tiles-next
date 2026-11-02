<script lang="ts">
  import { SITE_ORIGIN } from "#lib/absolute-url"
  import { theme, type ThemeChoice } from "#lib/theme.svelte"

  // Light, dark, then the system setting, as the viewer always cycled.
  const NEXT: Record<ThemeChoice, ThemeChoice> = { light: "dark", dark: "system", system: "light" }
</script>

<div
  class="share-floating-download-bar pointer-events-none fixed inset-x-0 bottom-[max(0.65rem,env(safe-area-inset-bottom,0px))] z-[60] px-3 print:hidden sm:bottom-4 sm:px-4"
>
  <div class="mx-auto w-full max-w-[38rem]">
    <div
      class="pointer-events-auto flex min-w-0 items-center justify-between gap-2 rounded-[0.9rem] border border-black/10 bg-white/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm dark:border-white/10 dark:bg-[#1f1f1f]/95 sm:gap-3 sm:px-3 sm:py-2"
    >
      <div class="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        <a href={SITE_ORIGIN} class="inline-flex shrink-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-2.5">
          <img
            src="/icon-mark-transparent-white.svg"
            alt="Tiles"
            width="40"
            height="40"
            class="h-6 w-6 shrink-0 opacity-90 invert dark:invert-0 sm:h-7 sm:w-7"
          />
          <span class="shrink-0 text-sm font-semibold leading-none tracking-[-0.01em] text-[#1d1d1f] dark:text-[#e7e7ed] sm:text-base"
            >Tiles</span
          >
        </a>
        <span class="inline-flex min-w-0 items-baseline">
          <span class="ml-0.5 hidden min-w-0 truncate text-xs leading-none text-black/55 dark:text-white/55 min-[430px]:inline sm:hidden"
            >Own your AI</span
          >
          <span class="ml-0.5 hidden text-xs leading-none text-black/55 dark:text-white/55 sm:inline">Own your AI</span>
        </span>
      </div>
      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onclick={() => theme.set(NEXT[theme.choice])}
          class="inline-flex h-8 w-8 items-center justify-center rounded-[0.65rem] text-[#1d1d1f]/85 transition-colors hover:text-[#1d1d1f] dark:text-[#e7e7ed]/90 dark:hover:text-[#e7e7ed]"
          aria-label={`Theme: ${theme.choice}. Click to switch theme`}
          title={`Theme: ${theme.choice}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
            {#if theme.choice === "light"}
              <path
                d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z"
              />
            {:else if theme.choice === "dark"}
              <path
                fill-rule="evenodd"
                d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                clip-rule="evenodd"
              />
            {:else}
              <path
                fill-rule="evenodd"
                d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z"
                clip-rule="evenodd"
              />
            {/if}
          </svg>
        </button>
        <a
          href="{SITE_ORIGIN}/download"
          class="inline-flex h-8 items-center justify-center rounded-[0.65rem] border border-black/10 bg-black/[0.03] px-2.5 text-xs font-medium text-[#1d1d1f]/85 transition-colors hover:bg-black/[0.06] hover:text-[#1d1d1f] dark:border-white/10 dark:bg-white/[0.035] dark:text-[#e7e7ed]/90 dark:hover:bg-white/[0.08] dark:hover:text-[#e7e7ed] sm:px-3.5 sm:text-sm"
          >Download</a
        >
      </div>
    </div>
  </div>
</div>
