import ownYourAiSlidesData from "./own-your-ai-talk-data.json"

export interface OwnYourAiSlide {
  number: number
  title: string
  transcript: string[]
  media: "image" | "video"
}

export const ownYourAiTalkIntroParagraphs = [
  'This post is adapted from a talk whose different versions were presented at <a href="https://www.localfirstconf.com/" target="_blank" rel="noopener noreferrer">Local-First Conf</a> in Berlin and IndiaFOSS 2026 in Bengaluru. It is written for anyone thinking about how AI should fit into our digital lives.',
  'As AI becomes central to how we work and communicate, I believe we are seeing a new form of technological feudalism, where a handful of platforms control the models, identities, data, and distribution channels people depend on. Local-first AI offers an alternative, but many tools still lack the identity, sync, and collaboration features people expect.',
]

export const ownYourAiTalkIntro = ownYourAiTalkIntroParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n")

export const ownYourAiSlides = ownYourAiSlidesData as OwnYourAiSlide[]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function ownYourAiSlideSrc(number: number): string {
  return `/own-your-ai-talk/foss-india-2026-r3/slide-${String(number).padStart(2, "0")}.png`
}

export const ownYourAiDemoVideo = {
  mp4: "/tiles-demo.48de4a8b.mp4",
  webm: "/tiles-demo.8492c6fd.webm",
  poster: "/tiles-demo-poster.d0ad9089.webp",
} as const

/** Recording of the Local-First Conf 2026 version of this talk. */
export const ownYourAiTalkRecording = {
  title: "Watch the Local-First Conf version",
  watchUrl: "https://youtu.be/WY_M7TMQ8do",
  /** nocookie host so the player does not set tracking cookies before playback. */
  embedUrl: "https://www.youtube-nocookie.com/embed/WY_M7TMQ8do",
  iframeTitle:
    "Own your AI with local models and open protocols: Local-First Conf 2026, Berlin",
} as const

export const ownYourAiBlogContent = `${ownYourAiTalkIntro}

${ownYourAiSlides
  .map((slide) => {
    const transcript = slide.transcript.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")

    const media = slide.media === "video"
      ? `<video controls loop muted playsinline preload="metadata" poster="${ownYourAiDemoVideo.poster}" aria-label="Tiles desktop app demo"><source src="${ownYourAiDemoVideo.mp4}" type="video/mp4"><source src="${ownYourAiDemoVideo.webm}" type="video/webm"></video>`
      : `<img src="${ownYourAiSlideSrc(slide.number)}" alt="Slide ${slide.number}: ${escapeHtml(slide.title)}" />`

    return `<figure>${media}</figure>${transcript}`
  })
  .join("\n\n")}`
