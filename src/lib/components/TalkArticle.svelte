<script lang="ts" module>
  export interface TalkSlide {
    number: number
    transcript: string[]
    media: "image" | "video"
    title?: string
  }

  export type SlidePlacement = "stage" | "inline"
</script>

<script lang="ts">
  import type { Snippet } from "svelte"
  import { onMount } from "svelte"

  // Body of a talk page: intro, the recording, then slides with their
  // transcript. On wide screens the current slide stays pinned beside the
  // transcript and changes as the reader scrolls.
  let {
    intro,
    recording,
    slides,
    slideSrc,
    slideAlt,
    video,
  }: {
    /** Trusted intro HTML from the talk module. */
    intro: string
    recording: { title: string; embedUrl: string; iframeTitle: string }
    slides: TalkSlide[]
    slideSrc: (number: number) => string
    slideAlt: (slide: TalkSlide, placement: SlidePlacement) => string
    /** Renders the demo video for a slide whose media is "video". */
    video: Snippet<[{ class: string; active: boolean }]>
  } = $props()

  const mediaClass =
    "rounded-lg border border-black/8 object-contain shadow-[0_18px_48px_rgba(0,0,0,0.12)] dark:border-white/10"
  const inlineClass = `mb-4 block aspect-video h-auto w-full ${mediaClass} xl:hidden`

  let section: HTMLElement
  // svelte-ignore state_referenced_locally
  let activeSlide = $state(slides[0]?.number ?? 1)
  const lastSlide = $derived(slides[slides.length - 1]?.number)

  function stageClass(active: boolean): string {
    return `absolute inset-0 h-full w-full ${mediaClass} transition duration-500 ${
      active ? "opacity-100 scale-100" : "opacity-0 scale-[0.985]"
    } ${active ? "pointer-events-auto" : "pointer-events-none"}`
  }

  onMount(() => {
    const wide = window.matchMedia("(max-width: 1200px)")
    const blocks = Array.from(section.querySelectorAll<HTMLElement>("[data-slide]"))

    // The slide whose transcript block is nearest the middle of the viewport.
    const update = () => {
      if (wide.matches) return
      const target = window.innerHeight * 0.52
      let closest = slides[0]?.number ?? 1
      let closestDistance = Number.POSITIVE_INFINITY
      for (const block of blocks) {
        const rect = block.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - target)
        if (distance < closestDistance) {
          closestDistance = distance
          closest = Number(block.dataset.slide)
        }
      }
      activeSlide = closest
    }

    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  })
</script>

<div class="space-y-4">{@html intro}</div>

<h2 class="blog-print-screen-only">{recording.title}</h2>

<figure class="blog-print-screen-only my-8 overflow-hidden rounded-lg border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
  <div class="relative aspect-video w-full">
    <iframe
      src={recording.embedUrl}
      title={recording.iframeTitle}
      class="absolute inset-0 h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</figure>

<h2>Slides and Transcript</h2>

<section
  bind:this={section}
  class="relative left-1/2 my-12 grid w-[min(90rem,calc(100vw-3rem))] -translate-x-1/2 grid-cols-1 gap-12 lg:my-20 xl:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]"
>
  <div class="sticky top-[calc(5.5rem+env(safe-area-inset-top,0px))] hidden h-[calc(100dvh-7rem)] items-center xl:flex">
    <div class="relative aspect-video w-full">
      {#each slides as slide (slide.number)}
        {@const active = activeSlide === slide.number}
        {#if slide.media === "video"}
          {@render video({ class: stageClass(active), active })}
        {:else}
          <img
            class={stageClass(active)}
            src={slideSrc(slide.number)}
            alt={slideAlt(slide, "stage")}
            width="1920"
            height="1080"
            loading={slide.number === 1 ? "eager" : "lazy"}
            decoding="async"
          />
        {/if}
      {/each}
    </div>
  </div>

  <div>
    {#each slides as slide (slide.number)}
      <div
        data-slide={slide.number}
        class="flex flex-col justify-center xl:min-h-[75vh] xl:px-6 {slide.transcript.length === 0
          ? 'xl:min-h-[55vh]'
          : ''} {slide.number === lastSlide ? 'xl:pb-[50vh]' : ''}"
      >
        {#if slide.media === "video"}
          {@render video({ class: inlineClass, active: true })}
        {:else}
          <img
            src={slideSrc(slide.number)}
            alt={slideAlt(slide, "inline")}
            width="1920"
            height="1080"
            loading={slide.number === 1 ? "eager" : "lazy"}
            decoding="async"
            class={inlineClass}
          />
        {/if}

        {#if slide.transcript.length > 0}
          <div
            class="mb-12 space-y-4 text-base leading-7 text-black/76 transition duration-500 dark:text-white/85 lg:text-[1.03rem] xl:translate-y-28 {activeSlide ===
            slide.number
              ? 'opacity-100'
              : 'xl:text-black/46 xl:opacity-70 xl:dark:text-white/55'}"
          >
            {#each slide.transcript as paragraph, index (index)}
              <p>{paragraph}</p>
            {/each}
          </div>
        {:else}
          <div class="mb-12 xl:hidden"></div>
        {/if}
      </div>
    {/each}
  </div>
</section>
