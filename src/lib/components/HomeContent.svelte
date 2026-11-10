<script lang="ts">
  import type { Component, Snippet } from "svelte"
  import {
    ArrowUpRight,
    Bot,
    Box,
    Briefcase,
    Building2,
    Check,
    ChevronDown,
    Fingerprint,
    FlaskConical,
    RefreshCw,
    Share2,
    User,
  } from "@lucide/svelte"
  import DownloadPlatformSubtext from "./DownloadPlatformSubtext.svelte"
  import DownloadTilesCta from "./DownloadTilesCta.svelte"
  import HomeHeroVideo from "./HomeHeroVideo.svelte"
  import MinimalTopbar from "./MinimalTopbar.svelte"
  import OpenSourceIcon from "./OpenSourceIcon.svelte"
  import RemoteInferenceIcon from "./RemoteInferenceIcon.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import { TILES_PRODUCT_TECHNOLOGY_LINE } from "#lib/product-description"

  interface Disclosure {
    title: string
    icon: Component<{ strokeWidth?: number }>
    body: string | Snippet
    comingSoon?: boolean
  }

  const useCases: Disclosure[] = [
    {
      title: "Individuals",
      icon: User,
      body: "Plan finances, track health notes, and journal privately. Run models locally, sync across devices, and share only when you choose.",
    },
    {
      title: "Coworking spaces",
      icon: Building2,
      body: "Turn shared compute into private AI infrastructure. Let members use local models from their own devices while keeping identity and data private.",
    },
    {
      title: "Researchers",
      icon: FlaskConical,
      body: "Review literature, analyze datasets, and run agents in preconfigured, resumable research sandboxes.",
    },
    {
      title: "Enterprises",
      icon: Briefcase,
      body: "Deploy private agentic systems powered by open frontier models. Secure users and agents with zero-trust authentication and authorization, simplify team management, and reduce infrastructure and model costs.",
    },
  ]

  const features: Disclosure[] = [
    { title: "Run polished local models", icon: Bot, body: runModelsBody },
    { title: "Own your identity", icon: Fingerprint, body: identityBody },
    {
      title: "Use local models on remote devices",
      icon: RemoteInferenceIcon,
      body: "Securely run local models on a remote device like your home lab, peer-to-peer, from any device.",
    },
    {
      title: "Sync chats across your devices",
      icon: RefreshCw,
      body: "Encrypted peer-to-peer chat sync across your linked devices.",
    },
    { title: "Share chats with friends", icon: Share2, body: shareBody },
    {
      title: "Every chat is a sandbox",
      icon: Box,
      body: "Resume or share chats as sandboxed microVM environments with friends or agents across devices.",
      comingSoon: true,
    },
    { title: "Open source and free forever", icon: OpenSourceIcon, body: openSourceBody },
  ]

  const atmosphereBullets = [
    "Your online data lives on a Personal Data Server (PDS), and you choose who hosts it.",
    "Apps connect to you, not the other way around.",
    "No starting over when apps change or disappear.",
  ]
</script>

<!-- The Gemma logo is lazy so the browser doesn't open an early connection to ai.google.dev. -->
{#snippet runModelsBody()}
  Embedded <a href="https://pi.dev/">Pi</a> agent harness for knowledge work, running Google’s <span
    class="minimal-model-label"
    ><img
      src="https://ai.google.dev/gemma/images/gemma_sq.png"
      alt="Gemma logo"
      width="15"
      height="15"
      loading="lazy"
      decoding="async"
    /><span>gemma-4-12b</span></span
  > on <a href="https://llama.app/">llama.cpp</a>, with <a href="https://agent-plugins.org/">Agent Plugins</a> support
  for reusable, skill-based workflows.
{/snippet}

{#snippet identityBody()}
  Tiles uses locally generated <a href="https://www.w3.org/TR/did-1.1/">DIDs</a> and <a href="https://ucan.xyz"
    >UCANs</a
  > for zero-trust authentication and authorization. This lets you own and control your identity across your digital
  life.
{/snippet}

{#snippet shareBody()}
  Create a public or private link to a chat session, published on <a href="https://atproto.com">Atmosphere</a> and
  stored on your own personal data server (PDS).
{/snippet}

{#snippet openSourceBody()}
  Tiles is <a href="https://github.com/tilesprivacy/tiles">open source</a> and forever free to use, dual-licensed under
  MIT and Apache 2.0. It is designed to be future-proof and continue working forever.
{/snippet}

{#snippet disclosureSection(id: string, heading: string, items: Disclosure[])}
  <section class="minimal-copy" aria-labelledby={id}>
    <h2 {id} class="minimal-copy-heading">{heading}</h2>
    <div class="minimal-copy-content minimal-disclosure-list">
      {#each items as item (item.title)}
        <details class="minimal-disclosure">
          <summary>
            <h3>
              <span class="minimal-feature-icon" aria-hidden="true">
                <item.icon strokeWidth={1.75} />
              </span>
              <span class="minimal-disclosure-title">{item.title}</span>
              <span class="minimal-disclosure-meta">
                {#if item.comingSoon}
                  <span class="minimal-disclosure-status">Coming soon</span>
                {/if}
                <ChevronDown class="minimal-disclosure-chevron" aria-hidden="true" />
              </span>
            </h3>
          </summary>
          <p>{#if typeof item.body === "string"}{item.body}{:else}{@render item.body()}{/if}</p>
        </details>
      {/each}
    </div>
  </section>
{/snippet}

{#snippet atmosphereLink(href: string, label: string)}
  <a class="minimal-atmosphere-link" {href} target="_blank" rel="noopener noreferrer"
    >{label}<ArrowUpRight aria-hidden="true" /></a
  >
{/snippet}

<main class="minimal-product-page minimal-home-page">
  <MinimalTopbar />
  <section class="minimal-hero" aria-labelledby="tiles-title">
    <div class="minimal-hero-copy">
      <h1 id="tiles-title" class="minimal-hero-title">Own your AI</h1>
      <p>A local-first, collaborative AI assistant that works for you. {TILES_PRODUCT_TECHNOLOGY_LINE}</p>
      <div class="minimal-hero-actions">
        <DownloadTilesCta size="hero" label="Download for free" />
        <DownloadPlatformSubtext size="hero" />
        <a
          href="https://github.com/tilesprivacy/tiles"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-[0.79rem] font-medium leading-none !text-black/48 dark:!text-[#9A9A9A] !no-underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-[0.83rem]"
        >
          View source <ArrowUpRight class="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
    <HomeHeroVideo />
  </section>

  <section class="minimal-copy minimal-copy--after-hero" aria-labelledby="why-tiles-heading">
    <h2 id="why-tiles-heading" class="minimal-copy-heading">Why Tiles?</h2>
    <div class="minimal-copy-content">
      <p class="minimal-copy-lede">
        For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your
        conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end
        encryption, and use social features, such as sharing chats, built on <a href="https://atproto.com"
          >AT Protocol</a
        >. Tiles gives you user-owned keys for your digital life with <a href="https://www.w3.org/TR/did-1.1/">DIDs</a>
        and <a href="https://ucan.xyz">UCANs</a>, so your data and identity truly remain yours.
      </p>
    </div>
  </section>

  {@render disclosureSection("use-cases-heading", "Use cases", useCases)}
  {@render disclosureSection("whats-inside-heading", "What's inside", features)}

  <section class="minimal-copy" aria-labelledby="atmosphere-heading">
    <h2 id="atmosphere-heading" class="minimal-copy-heading">Designed for the Atmosphere</h2>
    <div class="minimal-copy-content minimal-atmosphere-content">
      <ul class="minimal-atmosphere-list">
        {#each atmosphereBullets as bullet (bullet)}
          <li>
            <span class="minimal-feature-icon" aria-hidden="true">
              <Check strokeWidth={1.75} />
            </span>
            <span>{bullet}</span>
          </li>
        {/each}
      </ul>
      <div class="minimal-atmosphere-note">
        <h3>What's the Atmosphere?</h3>
        <p>
          The Atmosphere is the growing network of apps built on the {@render atmosphereLink(
            "https://atproto.com",
            "AT Protocol",
          )} (ATproto), an open decentralized protocol for social applications and portable identity. For Tiles, this
          means social features do not need to live inside a closed platform.
        </p>
        <p>
          Learn more about the AT Protocol in the {@render atmosphereLink(
            "https://atproto.com/guides/understanding-atproto",
            "official documentation",
          )}.
        </p>
      </div>
      <span class="minimal-atmosphere-icon" aria-hidden="true"></span>
    </div>
  </section>

  <SiteFooter />
</main>
