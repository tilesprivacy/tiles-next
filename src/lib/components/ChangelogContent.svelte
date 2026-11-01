<script lang="ts">
  import SiteFooter from "./SiteFooter.svelte"
  import { formatBinarySize } from "#lib/format-binary-size"
  import {
    marketingPageBodyClass,
    marketingPageLeadClass,
    marketingPageMetaClass,
    marketingPageSubsectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"
  import type { ChangeItem, Release, ReleaseInstaller, ReleaseTarball } from "#lib/releases"

  let { releases, error }: { releases: Release[]; error: string | null } = $props()

  const linkColor =
    "font-medium text-foreground underline decoration-foreground/35 underline-offset-2 transition-colors hover:decoration-foreground"
  const badgeClass = "rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
  const sourceLinkClass = `inline-flex items-center gap-0.5 text-sm font-medium capitalize ${linkColor} underline underline-offset-2`
  /** Legacy changelog card look: soft gray in light, charcoal in dark. */
  const artifactCardClass =
    "rounded-sm border border-black/5 bg-black/[0.035] px-3 py-2.5 text-sm text-foreground shadow-none dark:border-white/5 dark:bg-white/[0.06]"
  const artifactLinkClass = `${linkColor} inline-flex items-center gap-0.5 font-medium`
  const releaseBodyClass = `space-y-2 ${marketingPageBodyClass}`
  const releaseSectionHeadingClass = "text-xs font-light uppercase tracking-wide text-muted-foreground"

  const normalizeChanges = (changes: ChangeItem["subItems"]): ChangeItem[] =>
    (changes ?? [])
      .map((item) => (typeof item === "string" ? { text: item } : item))
      .map((item) => ({
        ...item,
        text: item.text.trim(),
        subItems: normalizeChanges(item.subItems),
        codeBlock: item.codeBlock?.trim() || undefined,
      }))
      .filter((item) => item.text.length > 0 || item.codeBlock)

  /** Splits release-note text into plain runs and `inline code` runs. */
  const textParts = (text: string) =>
    text
      .split(/(`[^`]+`)/)
      .map((part) =>
        part.startsWith("`") && part.endsWith("`")
          ? { code: true, value: part.slice(1, -1) }
          : { code: false, value: part },
      )

  const releaseAnchorId = (version: string) => version.replace(/^v/, "")

  const releaseHeading = (release: Release, index: number) =>
    release.title !== release.version ? release.title : `Alpha ${releases.length - index}`
</script>

{#snippet externalLinkIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    class="h-2.5 w-2.5 inline-block ml-0.5 align-baseline"
    style="vertical-align: baseline"
  >
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
{/snippet}

{#snippet changeList(changes: ChangeItem[], depth: number, className?: string)}
  <ul class={depth === 0 ? className : "ml-4 mt-1.5 space-y-1.5"}>
    {#each changes as change, index (index)}
      <li>
        {#if change.text.length > 0}
          <div class="flex items-start gap-2">
            <span
              class={`mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full ${depth > 0 ? "bg-border" : "bg-muted-foreground"}`}
            ></span>
            <span class={`min-w-0 ${depth > 0 ? "text-muted-foreground" : ""}`}
              >{#each textParts(change.text) as part, partIndex (partIndex)}{#if part.code}<code
                    class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
                    >{part.value}</code
                  >{:else}{part.value}{/if}{/each}</span
            >
          </div>
        {/if}
        {#if change.codeBlock}
          <pre
            class={`overflow-x-auto rounded-md border border-border bg-muted p-3 font-mono text-sm leading-relaxed text-foreground ${
              change.text.length > 0 ? "ml-6 mt-2" : "mt-0"
            }`}>{change.codeBlock}</pre>
        {/if}
        {#if change.subItems && change.subItems.length > 0}
          {@render changeList(normalizeChanges(change.subItems), depth + 1)}
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

{#snippet artifact(kind: string, file: ReleaseInstaller | ReleaseTarball)}
  <div class={artifactCardClass}>
    <div class="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
      <span class="shrink-0 text-xs font-medium text-muted-foreground">{kind}</span>
      <a href={file.url} target="_blank" rel="noopener noreferrer" class={artifactLinkClass}>
        {file.name}
        {@render externalLinkIcon()}
      </a>
      <span class="text-xs tabular-nums text-muted-foreground">
        ({formatBinarySize(file.sizeBytes, { unknownLabel: "Unknown size" })})
      </span>
    </div>
    <p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">
      <span class="select-none">SHA256 </span>
      <span class="break-all font-mono text-foreground">{file.sha256}</span>
    </p>
  </div>
{/snippet}

{#snippet downloadArtifacts(release: Release)}
  {#if release.tarballs.length > 0 || release.installer || release.fullInstaller}
    <div class="mb-4 mt-1 space-y-2.5">
      {#if release.installer}{@render artifact("Network installer", release.installer)}{/if}
      {#if release.fullInstaller}{@render artifact("Offline installer", release.fullInstaller)}{/if}
      {#each release.tarballs as tarball (tarball.name)}
        {@render artifact("Tarball", tarball)}
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet badges(release: Release, index: number)}
  {#if index === 0}
    <span class={`${badgeClass} text-foreground`}>Latest</span>
  {/if}
  {#if release.isPrerelease}
    <span class={`${badgeClass} text-muted-foreground`}>Pre-release</span>
  {/if}
{/snippet}

{#snippet sourceLinks(release: Release, gapClass: string)}
  <div class={`mb-4 flex flex-wrap ${gapClass}`}>
    <a href={release.githubUrl} target="_blank" rel="noopener noreferrer" class={sourceLinkClass}>
      github
      {@render externalLinkIcon()}
    </a>
    {#if release.compareUrl}
      <a href={release.compareUrl} target="_blank" rel="noopener noreferrer" class={sourceLinkClass}>
        changelog
        {@render externalLinkIcon()}
      </a>
    {/if}
  </div>
{/snippet}

{#snippet releaseSections(release: Release)}
  {#if release.sections.length > 0}
    <div class="space-y-5">
      {#each release.sections as section, sectionIndex (`${release.version}-${section.title}-${sectionIndex}`)}
        {@const visibleChanges = normalizeChanges(section.changes)}
        {#if visibleChanges.length > 0}
          <section class="space-y-2">
            <h3 class={releaseSectionHeadingClass}>{section.title}</h3>
            {@render changeList(visibleChanges, 0, releaseBodyClass)}
          </section>
        {/if}
      {/each}
    </div>
  {/if}
{/snippet}

<div class="relative flex min-h-screen flex-col bg-background">
  <main
    class="flex-1 px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto max-w-3xl">
      <h1 class={`mb-4 ${marketingPageTitleClass} text-foreground`}>Releases</h1>
      <p class={`mb-10 max-w-3xl ${marketingPageLeadClass} lg:mb-12`}>All notable changes and releases for Tiles.</p>

      {#if error}
        <div class="rounded-sm bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      {:else}
        <div id="releases" class="relative scroll-mt-28 lg:scroll-mt-40">
          <div class="absolute left-[124px] top-0 hidden h-full w-px bg-border md:block"></div>

          <div class="space-y-10 md:space-y-12">
            {#each releases as release, index (release.version)}
              {@const anchorId = releaseAnchorId(release.version)}
              <div
                id={anchorId}
                class="relative scroll-mt-28 border-b border-black/5 pb-10 last:border-b-0 last:pb-0 dark:border-white/10 lg:scroll-mt-40"
              >
                <div class="md:hidden">
                  <div class="mb-3 flex items-center gap-3">
                    <a href={`#${anchorId}`} class={`text-base font-light ${linkColor} lg:text-lg`}>{release.version}</a>
                    {@render badges(release, index)}
                  </div>
                  <p class={`mb-2 ${marketingPageMetaClass}`}>{release.date}</p>
                  <h2 class={`mb-3 ${marketingPageSubsectionTitleClass} text-foreground`}>
                    {releaseHeading(release, index)}
                  </h2>
                  {@render sourceLinks(release, "gap-3")}
                  {@render downloadArtifacts(release)}
                  {@render releaseSections(release)}
                </div>

                <div class="hidden md:grid md:grid-cols-[100px_16px_1fr] md:gap-4">
                  <div class="text-right">
                    <a href={`#${anchorId}`} class={`text-base font-light ${linkColor} lg:text-lg`}>{release.version}</a>
                    <p class={marketingPageMetaClass}>{release.date}</p>
                  </div>

                  <div class="relative flex justify-center items-start">
                    <div class="relative z-10 h-3 w-3 rounded-full bg-foreground mt-2 ring-4 ring-background"></div>
                  </div>

                  <div>
                    <div class="mb-2 flex items-center gap-3">
                      <h2 class={`${marketingPageSubsectionTitleClass} text-foreground`}>
                        {releaseHeading(release, index)}
                      </h2>
                      {@render badges(release, index)}
                    </div>
                    {@render sourceLinks(release, "gap-4")}
                    {@render downloadArtifacts(release)}
                    {@render releaseSections(release)}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </main>

  <SiteFooter />
</div>
