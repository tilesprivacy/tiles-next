<script lang="ts">
  import { ChevronRight, Plus } from "@lucide/svelte"
  import PluginIcon from "./PluginIcon.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import { marketingPageTitleClass } from "#lib/marketing-page-title-classes"
  import type { TilesPlugin } from "#lib/plugins"

  let { plugins }: { plugins: TilesPlugin[] } = $props()

  let query = $state("")
  const normalizedQuery = $derived(query.trim().toLowerCase())

  const filteredPlugins = $derived(
    normalizedQuery
      ? plugins.filter((plugin) =>
          [plugin.name, plugin.description, plugin.fileName].join(" ").toLowerCase().includes(normalizedQuery),
        )
      : plugins,
  )

  const showMakeYourOwnPluginCard = $derived(
    !normalizedQuery ||
      "make your own plugin bundle mcp servers and skills in the portable agent plugins format package layout".includes(
        normalizedQuery,
      ),
  )
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
  <main
    class="flex-1 px-5 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto w-full max-w-[768px]">
      <section class="min-w-0">
        <div class="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div class="min-w-0 flex-1">
            <h1 class={marketingPageTitleClass}>Extend the Agent</h1>
            <p class="mt-4 max-w-[30rem] text-base leading-7 text-muted-foreground">
              Tiles plugins follow the open
              <a
                href="https://agent-plugins.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-foreground underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                >Agent Plugins standard</a
              >, a portable package format for reusable components that extend AI agents.
            </p>
          </div>

          <label class="relative block w-full md:mt-2 md:w-[18.75rem] md:shrink-0">
            <span class="sr-only">Search plugins</span>
            <input
              type="search"
              bind:value={query}
              placeholder="Search plugins"
              class="h-10 w-full rounded-full border-0 bg-secondary/65 px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/75 focus:bg-secondary"
            />
          </label>
        </div>

        <div id="all-plugins" class="grid gap-3 sm:max-w-[48rem] sm:grid-cols-2">
          {#each filteredPlugins as plugin (plugin.slug)}
            <a
              href={`/plugins/${plugin.slug}`}
              class="group flex h-[75px] items-center gap-3 overflow-hidden rounded-[8px] bg-secondary/65 px-4 py-4 text-card-foreground transition-colors hover:bg-secondary"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-foreground shadow-sm ring-1 ring-border/60"
              >
                <PluginIcon slug={plugin.slug} />
              </span>
              <span class="min-w-0 flex-1 overflow-hidden">
                <span
                  class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-medium leading-[21px] text-foreground"
                  >{plugin.name}</span
                >
                <span
                  class="mt-0.5 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 text-muted-foreground"
                  >{plugin.description}</span
                >
              </span>
              <ChevronRight
                class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          {/each}
          {#if showMakeYourOwnPluginCard}
            <a
              href="/book/manual#plugin-package-layout"
              class="group flex h-[75px] items-center gap-3 overflow-hidden rounded-[8px] bg-secondary/65 px-4 py-4 text-card-foreground transition-colors hover:bg-secondary"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-foreground shadow-sm ring-1 ring-border/60"
              >
                <Plus class="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span class="min-w-0 flex-1 overflow-hidden">
                <span
                  class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-medium leading-[21px] text-foreground"
                >
                  Make your own plugin
                </span>
                <span
                  class="mt-0.5 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 text-muted-foreground"
                >
                  Bundle MCP servers and skills in the portable Agent Plugins format
                </span>
              </span>
              <ChevronRight
                class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          {/if}
        </div>

        {#if filteredPlugins.length === 0 && !showMakeYourOwnPluginCard}
          <div class="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
            No plugins match that search.
          </div>
        {/if}
      </section>
    </div>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
