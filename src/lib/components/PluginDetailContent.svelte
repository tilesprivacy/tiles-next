<script lang="ts">
  import { ArrowLeft, ArrowUpRight, BookOpen, Server } from "@lucide/svelte"
  import PluginIcon from "./PluginIcon.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import { triggerHaptic } from "#lib/haptics"
  import {
    marketingPageSubsectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"
  import type {
    TilesPlugin,
    TilesPluginMcpServer,
    TilesPluginMetadata,
    TilesPluginSkill,
  } from "#lib/plugins"

  let {
    plugin,
    metadata,
    mcpServers,
    skills,
  }: {
    plugin: TilesPlugin
    metadata: TilesPluginMetadata | null
    mcpServers: TilesPluginMcpServer[]
    skills: TilesPluginSkill[]
  } = $props()

  let deepLinkFailed = $state(false)
  let copiedInstallCommand = $state(false)
  const installHref = $derived(`tiles://plugins/${plugin.slug}`)

  function metadataLabel(key: string) {
    if (key === "$schema") return "Schema"
    return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase())
  }

  function mcpTypeLabel(type: string) {
    return type
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => (part.toLowerCase() === "http" ? "HTTP" : part.charAt(0).toUpperCase() + part.slice(1)))
      .join(" ")
  }

  function copyInstallCommand() {
    // Best effort: the command is also shown on the page to copy by hand.
    navigator.clipboard?.writeText(plugin.installCommand).catch(() => {})
    copiedInstallCommand = true
    window.setTimeout(() => (copiedInstallCommand = false), 1400)
  }

  // If the tiles:// link doesn't move focus away within 1.5s, Tiles probably
  // isn't installed: show the CLI command and copy it instead.
  function handleInstallClick() {
    triggerHaptic()

    if (deepLinkFailed) copyInstallCommand()

    let settled = false

    const settle = (fallback: boolean) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      window.removeEventListener("blur", onBlur)
      document.removeEventListener("visibilitychange", onVisibilityChange)

      if (fallback) {
        deepLinkFailed = true
        copyInstallCommand()
      }
    }
    const onBlur = () => settle(false)
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") settle(false)
    }

    const timer = window.setTimeout(() => settle(true), 1500)
    window.addEventListener("blur", onBlur)
    document.addEventListener("visibilitychange", onVisibilityChange)
  }
</script>

<div class="flex min-h-screen flex-col bg-background text-foreground">
  <main
    class="flex-1 px-5 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto w-full max-w-[768px]">
      <section class="min-w-0">
        <a
          href="/plugins"
          class="mb-8 inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft class="h-5 w-5" aria-hidden="true" />
          Back
        </a>

        <div class="mb-7 flex items-center justify-between gap-4">
          <div class="flex min-w-0 items-center gap-4">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-secondary text-foreground ring-1 ring-border/60"
            >
              <PluginIcon slug={plugin.slug} />
            </span>
            <h1 class={`min-w-0 truncate lg:overflow-visible lg:whitespace-nowrap ${marketingPageTitleClass}`}>
              {plugin.name}
            </h1>
          </div>

          <a
            href={installHref}
            onclick={handleInstallClick}
            aria-label={deepLinkFailed
              ? `Install ${plugin.name} in Tiles or copy the install command`
              : `Install ${plugin.name} in Tiles`}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-foreground px-3 text-xs font-medium sm:h-11 sm:px-5 sm:text-sm text-background transition-opacity hover:opacity-85 cyberpunk:bg-[var(--sponsor-yellow)] cyberpunk:text-black"
          >
            {copiedInstallCommand ? "Copied" : "Install"}
          </a>
        </div>

        <div class="mb-10 max-w-3xl">
          <p class="text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
            {plugin.description}
          </p>
          {#if plugin.requirements}
            <p class="mt-4 text-sm leading-6 text-muted-foreground">
              {plugin.requirements}
              {#if plugin.documentationUrl}
                <a
                  href={plugin.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 text-foreground underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                >
                  Setup guide
                  <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              {/if}
            </p>
          {/if}
          {#if plugin.showCliInstall || deepLinkFailed}
            <div class="mt-6">
              <p class="text-sm text-muted-foreground">
                {deepLinkFailed ? "Tiles didn't open? Install from your terminal instead:" : "Or install from the CLI:"}
              </p>
              <!-- Focusable so keyboard users can scroll a long command. -->
              <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
              <pre
                tabindex="0"
                aria-label={`Install ${plugin.name} command`}
                class="mt-2 overflow-x-auto rounded-[8px] bg-secondary/65 p-4 text-xs leading-6 sm:text-sm"><code
                  >{plugin.installCommand}</code
                ></pre>
              <p class="mt-3 text-sm leading-6 text-muted-foreground">
                {#if plugin.slug === "cloudflare"}
                  Restart Tiles, then use <code>@cloudflare-cli</code> for developer tools or
                  <code>@tiles-remote-inference</code> to share inference.
                {:else}
                  Restart Tiles, then use <code>@{plugin.slug}</code> in chat.
                {/if}
              </p>
            </div>
          {/if}
        </div>

        {#if mcpServers.length > 0}
          <div class="mb-12">
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class={marketingPageSubsectionTitleClass}>
                MCP <span class="ml-2 text-muted-foreground/55">{mcpServers.length}</span>
              </h2>
              <a
                href={mcpServers[0].sourceUrl}
                target="_blank"
                rel="noreferrer"
                class="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View mcp.json
                <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <div class="overflow-hidden rounded-[8px] bg-secondary/65">
              {#each mcpServers as server (server.name)}
                <div class="flex min-h-[75px] items-center gap-3 border-b border-border/55 px-4 py-4 last:border-b-0">
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-muted-foreground/55 shadow-sm ring-1 ring-border/60"
                  >
                    <Server class="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[17px] font-medium leading-[21px] text-foreground">{server.name}</span>
                    <span class="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">
                      {[mcpTypeLabel(server.type), server.endpoint].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        {#if skills.length > 0}
          <div class={metadata ? "mb-12" : undefined}>
            <h2 class={`mb-4 ${marketingPageSubsectionTitleClass}`}>
              Skills <span class="ml-2 text-muted-foreground/55">{skills.length}</span>
            </h2>
            <div class="overflow-hidden rounded-[8px] bg-secondary/65">
              {#each skills as skill, index (skill.sourceUrl)}
                <a
                  href={skill.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  class="group flex min-h-[75px] items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-muted-foreground/55 shadow-sm ring-1 ring-border/60"
                  >
                    {#if plugin.slug === "caldir"}
                      <PluginIcon slug={plugin.slug} />
                    {:else}
                      <BookOpen class="h-5 w-5" aria-hidden="true" />
                    {/if}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[17px] font-medium leading-[21px] text-foreground">
                      {plugin.slug === "caldir" ? "caldir" : skill.name}
                    </span>
                    {#if skill.description && plugin.slug !== "caldir"}
                      <span class="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">{skill.description}</span>
                    {/if}
                  </span>
                  <ArrowUpRight
                    class="h-4 w-4 shrink-0 text-muted-foreground/55 transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                  {#if index < skills.length - 1}<span class="sr-only">Skill</span>{/if}
                </a>
              {/each}
            </div>
          </div>
        {/if}

        {#if metadata}
          <div>
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class={marketingPageSubsectionTitleClass}>Plugin metadata</h2>
              <a
                href={metadata.sourceUrl}
                target="_blank"
                rel="noreferrer"
                class="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View plugin.json
                <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <dl class="overflow-hidden rounded-[8px] bg-secondary/65">
              {#each metadata.fields as field (field.key)}
                <div
                  class="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-border/55 px-4 py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
                >
                  <dt class="text-sm font-medium text-muted-foreground">{metadataLabel(field.key)}</dt>
                  <dd class="min-w-0 break-words text-sm text-foreground">
                    {#if field.href}
                      <a
                        href={field.href}
                        target="_blank"
                        rel="noreferrer"
                        class="underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                      >
                        {field.value}
                      </a>
                    {:else}
                      {field.value}
                    {/if}
                  </dd>
                </div>
              {/each}
            </dl>
          </div>
        {/if}
      </section>
    </div>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
