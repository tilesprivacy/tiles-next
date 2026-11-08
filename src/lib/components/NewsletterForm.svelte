<script lang="ts">
  import { onMount } from "svelte"
  import { PUBLIC_TURNSTILE_SITE_KEY } from "$app/env/public"
  import Button from "./ui/Button.svelte"
  import Input from "./ui/Input.svelte"
  import { cn } from "#lib/utils"
  import { triggerHaptic } from "#lib/haptics"
  import { loadScript } from "#lib/load-script"
  import { theme } from "#lib/theme.svelte"
  import type { TurnstileWidget } from "#lib/turnstile"

  const SNIPER_LINK_SRC = "https://sniperl.ink/v1/sniper-link.js"
  const STATUS_RESET_MS = 5000
  // Empty in local dev, where the form skips Turnstile.
  const siteKey = PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? ""
  const emailInputId = "newsletter-email-input"

  let email = $state("")
  let status = $state<"idle" | "loading" | "success" | "error">("idle")
  let message = $state("")
  let subscriberEmail = $state("")
  let senderEmail = $state("")
  let isOnline = $state(true)
  let startedAt = 0

  let form = $state<HTMLFormElement | null>(null)
  let turnstileContainer = $state<HTMLDivElement | null>(null)
  let widget: Promise<TurnstileWidget | null> | null = null
  let challengeVisible = $state(false)

  const isDark = $derived(theme.mounted && theme.resolved === "dark")
  const showSniperLink = $derived(Boolean(subscriberEmail && senderEmail))

  function ensureWidget(): Promise<TurnstileWidget | null> {
    if (!siteKey || !turnstileContainer) return Promise.resolve(null)
    const container = turnstileContainer
    widget ??= import("#lib/turnstile")
      .then(({ createTurnstileWidget }) =>
        createTurnstileWidget(container, siteKey, {
          theme: isDark ? "dark" : "light",
          onVisibleChange: (visible) => (challengeVisible = visible),
        }),
      )
      .catch(() => {
        widget = null
        return null
      })
    return widget
  }

  onMount(() => {
    startedAt = Date.now()
    isOnline = navigator.onLine
    const handleOnline = () => (isOnline = true)
    const handleOffline = () => (isOnline = false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Fetch Turnstile once the form scrolls into view (or on first focus, below),
    // so Subscribe is quick. The check itself only runs on submit.
    let observer: IntersectionObserver | null = null
    if (siteKey && form) {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer?.disconnect()
        void ensureWidget()
      })
      observer.observe(form)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      observer?.disconnect()
      void widget?.then((created) => created?.destroy())
    }
  })

  $effect(() => {
    if (showSniperLink && isOnline) loadScript(SNIPER_LINK_SRC).catch(() => {})
  })

  function resetStatusLater(clearMessage: boolean) {
    setTimeout(() => {
      status = "idle"
      if (clearMessage) message = ""
    }, STATUS_RESET_MS)
  }

  async function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()

    if (!email) {
      message = "Please enter your email"
      return
    }

    triggerHaptic()
    status = "loading"
    const website = new FormData(event.currentTarget).get("website")
    const turnstile = await ensureWidget()

    try {
      const turnstileToken = turnstile ? await turnstile.token() : ""
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, startedAt, turnstileToken }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        error?: string
        message?: string
        senderEmail?: string
      }

      if (!response.ok) throw new Error(data.error || data.message || "Failed to subscribe")

      status = "success"
      message = "Welcome! Check your email for confirmation."
      subscriberEmail = email.trim()
      senderEmail = data.senderEmail || ""
      resetStatusLater(false)
    } catch (error) {
      status = "error"
      message = error instanceof Error ? error.message : "Something went wrong"
      resetStatusLater(true)
    } finally {
      // Turnstile tokens are single use.
      turnstile?.reset()
    }
  }

  function selectAllInField(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    // Keep Cmd/Ctrl+A selecting the field rather than the page.
    if ((event.metaKey || event.ctrlKey) && event.key === "a") {
      event.preventDefault()
      event.currentTarget.select()
    }
  }

  const controlSizeClasses = "!box-border !h-10 !min-h-10 !rounded-sm !py-0"

  const inputClasses = $derived(
    isDark
      ? "!bg-[#151515] !border-[#303030] !text-[#E6E6E6] placeholder:!text-[#8A8A8A] focus-visible:!ring-white/20 focus-visible:!border-white/25"
      : "!bg-white !border-black/15 !text-black placeholder:!text-black/45 focus-visible:!ring-black/10 focus-visible:!border-black/25",
  )

  const buttonClasses = $derived(
    isDark
      ? "!bg-[var(--sponsor-yellow,#f7ff61)] !text-black hover:!bg-[#e8f24f] focus-visible:!ring-[var(--sponsor-yellow,#f7ff61)]/40"
      : "!bg-black !text-white hover:!bg-black/90 focus-visible:!ring-black/20",
  )

  const messageClasses = $derived(
    status === "error" ? (isDark ? "text-red-300" : "text-red-700") : isDark ? "text-[#B3B3B3]" : "text-black/65",
  )
</script>

<form
  bind:this={form}
  onsubmit={handleSubmit}
  onfocusin={() => void ensureWidget()}
  class="w-full lg:max-w-[24rem]"
  data-theme={isDark ? "dark" : "light"}
>
  <div class="space-y-2.5">
    <!-- Honeypot: hidden from people, filled in by naive bots. -->
    <label class="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      Website
      <input name="website" tabindex="-1" autocomplete="off" />
    </label>
    <label for={emailInputId} class="sr-only">Email address</label>
    <div class="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <Input
        id={emailInputId}
        type="email"
        autocomplete="email"
        inputmode="email"
        placeholder="your@email.com"
        maxlength={254}
        bind:value={email}
        oninput={(event) => {
          // Typing a different address hides the "Open in …" button.
          if (subscriberEmail && event.currentTarget.value !== subscriberEmail) {
            subscriberEmail = ""
            senderEmail = ""
          }
        }}
        onkeydown={selectAllInField}
        disabled={status === "loading"}
        class={cn(
          "text-sm leading-none selection:!bg-blue-500 selection:!text-white",
          controlSizeClasses,
          inputClasses,
        )}
      />
      <Button
        type="submit"
        disabled={status === "loading" || status === "success"}
        class={cn(
          "w-full px-4 text-sm font-medium leading-none disabled:opacity-50 sm:w-auto",
          controlSizeClasses,
          buttonClasses,
        )}
      >
        {status === "loading" ? "Subscribing..." : status === "success" ? "Done!" : "Subscribe"}
      </Button>
    </div>
    {#if showSniperLink}
      <div class="flex justify-center sm:justify-start">
        <sniper-link
          recipient={subscriberEmail}
          sender={senderEmail}
          template={"Open in {provider}"}
          class="sniper-link-wrapper"
        ></sniper-link>
      </div>
    {/if}
    {#if message}
      <p role="status" aria-live="polite" class={cn("text-xs leading-relaxed", messageClasses)}>{message}</p>
    {/if}
  </div>
  {#if siteKey}
    <!-- Empty and zero-height unless Cloudflare asks for a click after Subscribe. -->
    <div bind:this={turnstileContainer} class={challengeVisible ? "mt-2.5" : ""}></div>
  {/if}
</form>
