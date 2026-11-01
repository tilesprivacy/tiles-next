<script lang="ts">
  import { ownYourAiDemoVideo } from "#lib/own-your-ai-draft-talk"

  // The Tiles desktop demo on the India FOSS talk page. It pauses when its
  // slide scrolls out of the pinned stage.
  let { class: className, active }: { class: string; active: boolean } = $props()

  let video: HTMLVideoElement

  $effect(() => {
    if (!active) video.pause()
  })
</script>

<video
  bind:this={video}
  class={className}
  controls
  loop
  muted
  playsinline
  preload="metadata"
  poster={ownYourAiDemoVideo.poster}
  aria-label="Tiles desktop app demo"
>
  <source src={ownYourAiDemoVideo.mp4} type="video/mp4" />
  <source src={ownYourAiDemoVideo.webm} type="video/webm" />
</video>
