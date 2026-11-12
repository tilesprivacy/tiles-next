<script lang="ts">
  import { Check, Copy, Download } from "@lucide/svelte"
  import CanaryDownloadAction from "#lib/components/CanaryDownloadAction.svelte"
  import FaApple from "#lib/components/icons/FaApple.svelte"
  import FaLinux from "#lib/components/icons/FaLinux.svelte"
  import MinimalTopbar from "#lib/components/MinimalTopbar.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import type { CanaryReleaseData } from "#lib/canary-release"
  import { LINUX_CANARY_INSTALL_COMMAND, LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "#lib/download-page-data"
  import { SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE } from "#lib/feature-flags"
  import {
    downloadButtonIconMotionClasses,
    downloadButtonMotionClasses,
    themeAwareHeaderPrimaryCtaClasses,
  } from "#lib/header-primary-cta-classes"
  import { LATEST_RELEASE_TITLE, LATEST_RELEASE_VERSION } from "#lib/latest-release-copy"

  interface DownloadMetadata {
    version: string
    downloadUrl: string
    binarySizeLabel: string
    sha256: string
    fileName: string
  }

  let {
    initialDownload,
    initialCanaryRelease,
  }: { initialDownload?: DownloadMetadata; initialCanaryRelease: CanaryReleaseData | null } = $props()

  const primaryButtonClass = `group minimal-primary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`
  const primaryIconClass = `download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`

  let copied = $state<string | null>(null)
  // svelte-ignore state_referenced_locally
  let canaryRelease = $state(initialCanaryRelease)

  // The canary build is replaced often. The server rendered a fresh copy, so
  // only re-check when someone comes back to a tab left open.
  $effect(() => {
    let activeRequest: AbortController | null = null

    const refresh = async () => {
      if (document.visibilityState !== "visible" || activeRequest) return
      const controller = new AbortController()
      activeRequest = controller
      try {
        const response = await fetch("/api/canary-release", { signal: controller.signal })
        if (!response.ok) return
        const latest: CanaryReleaseData = await response.json()
        if (Array.isArray(latest.assets)) canaryRelease = latest
      } catch {
        // Keep the last release while offline or GitHub is unavailable.
      } finally {
        if (activeRequest === controller) activeRequest = null
      }
    }

    document.addEventListener("visibilitychange", refresh)
    return () => {
      document.removeEventListener("visibilitychange", refresh)
      activeRequest?.abort()
    }
  })

  function copyLinuxCommand(command: string) {
    // navigator.clipboard is missing or rejects in some browsers and webviews;
    // fall back to a hidden textarea so the copy still lands.
    const copyWithTextArea = () => {
      const textArea = document.createElement("textarea")
      textArea.value = command
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    if (!navigator.clipboard?.writeText) copyWithTextArea()
    else void navigator.clipboard.writeText(command).catch(copyWithTextArea)

    copied = command
    window.setTimeout(() => (copied = null), 1400)
  }

  const networkInstallerReleaseLabel = $derived(
    initialDownload?.version === OFFLINE_INSTALLER.version
      ? OFFLINE_INSTALLER.releaseTitle
      : initialDownload?.version === LATEST_RELEASE_VERSION
        ? LATEST_RELEASE_TITLE
        : initialDownload?.version
          ? `Version ${initialDownload.version}`
          : null,
  )
</script>

{#snippet linuxCommand(command: string)}
  <button class="minimal-command" type="button" onclick={() => copyLinuxCommand(command)}>
    <code>{command}</code>
    {#if copied === command}<Check aria-label="Copied" />{:else}<Copy aria-label="Copy command" />{/if}
  </button>
{/snippet}

<div class="minimal-product-page">
  <MinimalTopbar />
  <main class="minimal-inner-page minimal-download-page">
    <article class="minimal-inner-content">
      <header class="minimal-page-intro">
        <h1>Download Tiles</h1>
        <p class="minimal-download-lead">Public alpha for macOS and Linux.</p>
        <div class="minimal-download-detail">
          <p>Canary version includes experimental support for Agent plugins.</p>
          {#if SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE}
            <p>
              The offline installer is ideal for computers that cannot connect
              to the internet or operate in air-gapped environments. It is
              also useful for installing Tiles across a large number of
              computers at once. It includes the default
              <span class="minimal-model-label"
                ><img src="https://ai.google.dev/gemma/images/gemma_sq.png" alt="Gemma logo" width="15" height="15" loading="lazy" /><a
                  href="https://huggingface.co/unsloth/gemma-4-12b-it-GGUF"
                  target="_blank"
                  rel="noopener noreferrer">gemma-4-12b-it-GGUF</a
                ></span
              >
              model for fully offline use.{#if initialDownload?.version && initialDownload.version !== OFFLINE_INSTALLER.version}{" "}Offline installer builds aren't published for every
                release, whereas network installers always fetch the latest
                version available.{/if}
            </p>
          {/if}
        </div>
      </header>

      <section class="minimal-download-platform" aria-labelledby="macos-heading">
        <h2 id="macos-heading">
          <FaApple class="minimal-download-platform-icon" aria-hidden="true" />macOS
        </h2>
        <p>Apple Silicon · macOS 14+ · 16 GB unified memory recommended</p>
        <!-- One stanza per installer: the action, then a one-line caption naming its size and release. -->
        <div class="minimal-download-actions">
          <div class="minimal-download-option">
            {#if initialDownload?.downloadUrl}
              <a class={primaryButtonClass} href={initialDownload.downloadUrl}>
                <span>Download network installer</span>
                <Download class={primaryIconClass} aria-hidden="true" />
              </a>
              <span class="minimal-download-size"
                >{[initialDownload.binarySizeLabel, networkInstallerReleaseLabel, "Recommended for most users"]
                  .filter(Boolean)
                  .join(" · ")}</span
              >
            {:else}
              <span class="minimal-disabled-button">Network installer unavailable</span>
            {/if}
          </div>
          {#if SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE}
            <div class="minimal-download-option">
              <a class={primaryButtonClass} href={OFFLINE_INSTALLER.downloadUrl}>
                <span>Download offline installer</span>
                <Download class={primaryIconClass} aria-hidden="true" />
              </a>
              <span class="minimal-download-size"
                >{OFFLINE_INSTALLER.binarySizeLabel} · {OFFLINE_INSTALLER.releaseTitle} · For air-gapped systems</span
              >
            </div>
          {/if}
          <CanaryDownloadAction release={canaryRelease} />
        </div>
      </section>

      <section class="minimal-download-platform" aria-labelledby="linux-heading">
        <h2 id="linux-heading">
          <FaLinux class="minimal-download-platform-icon" aria-hidden="true" />Linux
        </h2>
        <p>16 GB VRAM recommended</p>
        {@render linuxCommand(LINUX_INSTALL_COMMAND)}
        <p class="minimal-note">Paste this command in your terminal.</p>
        <p class="minimal-note">
          Canary, for early testers: the latest build of the canary branch, which can be unstable.
          The chat opens in your browser at <code>http://127.0.0.1:1729</code>.
        </p>
        {@render linuxCommand(LINUX_CANARY_INSTALL_COMMAND)}
        <p class="minimal-note">The offline installer for Linux is a work in progress.</p>
      </section>

      <p class="minimal-legal">
        By downloading and using Tiles, you agree to the <a href="/terms">terms</a> and <a href="/privacy">privacy statement</a>.
      </p>
    </article>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
