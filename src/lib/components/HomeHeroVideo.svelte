<script lang="ts">
  import { onMount } from "svelte"
  import { Maximize, Minimize, Pause, Play } from "@lucide/svelte"

  const CONTROLS_HIDE_DELAY = 3000

  // iPhone Safari has no element fullscreen API, only the native video presentation.
  type WebKitVideoElement = HTMLVideoElement & { webkitEnterFullscreen?: () => void }
  type WebKitDocument = Document & { webkitFullscreenElement?: Element | null }

  let video = $state<HTMLVideoElement | null>(null)
  let frame = $state<HTMLDivElement | null>(null)
  let hasStarted = $state(false)
  let failed = $state(false)
  let webmOnly = $state(false)
  let paused = $state(true)
  let currentTime = $state(0)
  let duration = $state(0)
  let controlsVisible = $state(true)
  let fullscreen = $state(false)
  let hideTimer = 0

  const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0)

  function scheduleControlsHide() {
    clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => {
      // A paused demo keeps its resume affordance in view.
      if (video && !video.paused) controlsVisible = false
    }, CONTROLS_HIDE_DELAY)
  }

  function showControls() {
    controlsVisible = true
    scheduleControlsHide()
  }

  function play() {
    if (!video) return
    video.muted = true
    video.defaultMuted = true
    video.play().catch((error: DOMException) => {
      if (error.name === "NotSupportedError") failed = true
    })
  }

  // The <video> is recreated when switching to the WebM-only source list.
  $effect(() => {
    if (!video) return
    // With <source> children, play() can stay pending if every source failed
    // before the page was interactive. Recover that settled state too.
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) failed = true
    video.autoplay = false
    video.pause()
    paused = true
    duration = video.duration || 0
  })

  onMount(() => {
    const syncFullscreen = () => {
      const element = document.fullscreenElement ?? (document as WebKitDocument).webkitFullscreenElement
      fullscreen = !!element && element === frame
    }
    document.addEventListener("fullscreenchange", syncFullscreen)
    document.addEventListener("webkitfullscreenchange", syncFullscreen)
    return () => {
      clearTimeout(hideTimer)
      document.removeEventListener("fullscreenchange", syncFullscreen)
      document.removeEventListener("webkitfullscreenchange", syncFullscreen)
    }
  })

  function togglePlayback() {
    if (!video) return
    if (video.paused) {
      hasStarted = true
      play()
    } else {
      video.pause()
    }
  }

  function startPlayback() {
    if (!video) return
    if (failed) {
      failed = false
      video.load()
    }
    hasStarted = true
    play()
  }

  function toggleFullscreen() {
    const el = video as WebKitVideoElement | null
    if (!frame || !el) return
    const element = document.fullscreenElement ?? (document as WebKitDocument).webkitFullscreenElement
    if (element) document.exitFullscreen().catch(() => {})
    else if (frame.requestFullscreen) frame.requestFullscreen().catch(() => {})
    else el.webkitEnterFullscreen?.()
  }

  function seek(event: Event & { currentTarget: HTMLInputElement }) {
    if (!video) return
    const time = Number(event.currentTarget.value)
    video.currentTime = time
    currentTime = time
  }
</script>

<figure class="minimal-hero-demo">
  <!-- Pointer movement only reveals the controls; the buttons inside are the interactive parts. -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div bind:this={frame} class="minimal-hero-video-frame" onpointermove={showControls} onpointerdown={showControls}>
    {#key webmOnly}
      <video
        bind:this={video}
        class="minimal-hero-video"
        poster="/tiles-demo-poster.d0ad9089.webp"
        loop
        muted
        playsinline
        preload="metadata"
        width="1280"
        height="896"
        aria-label="Tiles desktop app demo"
        onloadedmetadata={() => (duration = video?.duration || 0)}
        ondurationchange={() => (duration = video?.duration || 0)}
        ontimeupdate={() => {
          if (!video) return
          currentTime = video.currentTime
          paused = video.paused
        }}
        onplay={() => {
          if (!hasStarted) {
            video?.pause()
            if (video) video.currentTime = 0
            return
          }
          paused = false
          showControls()
        }}
        onplaying={() => (failed = false)}
        onpause={() => {
          paused = true
          controlsVisible = true
        }}
        onerror={() => {
          // Source selection handles unsupported formats. A decode failure
          // after selection needs an explicit switch to the other codec.
          if (!webmOnly) webmOnly = true
          else failed = true
        }}
      >
        {#if !webmOnly}
          <source src="/tiles-demo.48de4a8b.mp4" type="video/mp4" />
        {/if}
        <source src="/tiles-demo.8492c6fd.webm" type="video/webm" onerror={() => (failed = true)} />
      </video>
    {/key}
    {#if !hasStarted || failed}
      <button
        type="button"
        class="minimal-hero-video-start"
        aria-label={failed ? "Retry Tiles demo video" : "Play Tiles demo video"}
        onclick={startPlayback}
      >
        <Play size={28} fill="currentColor" aria-hidden="true" />
      </button>
    {/if}
    {#if hasStarted && !failed}
      <div class="minimal-hero-video-controls" data-hidden={controlsVisible || paused ? undefined : ""}>
        <button type="button" class="minimal-hero-video-toggle" aria-label={paused ? "Play" : "Pause"} onclick={togglePlayback}>
          {#if paused}
            <Play size={16} aria-hidden="true" />
          {:else}
            <Pause size={16} aria-hidden="true" />
          {/if}
        </button>
        <input
          type="range"
          class="minimal-hero-video-scrubber"
          aria-label="Seek through the demo"
          min="0"
          max={duration > 0 ? duration : 100}
          step="0.1"
          value={currentTime}
          oninput={seek}
          style:--progress={`${progress}%`}
        />
        <button
          type="button"
          class="minimal-hero-video-toggle"
          aria-label={fullscreen ? "Exit full screen" : "Enter full screen"}
          onclick={toggleFullscreen}
        >
          {#if fullscreen}
            <Minimize size={16} aria-hidden="true" />
          {:else}
            <Maximize size={16} aria-hidden="true" />
          {/if}
        </button>
      </div>
    {/if}
  </div>
</figure>
