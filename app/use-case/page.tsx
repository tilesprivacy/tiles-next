import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { marketingPageLeadClass } from "@/lib/marketing-page-title-classes"

const sharedScienceConversationPath =
  "/share/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuc2Vzc2lvbi8zbWtuMm9veG5xeTI3"

export const metadata: Metadata = {
  title: "Use Cases | Tiles",
  description: "Explore how people use Tiles for private work, research, and everyday AI workflows.",
  openGraph: {
    title: "Use Cases | Tiles",
    description: "Explore how people use Tiles for private work, research, and everyday AI workflows.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Use Cases | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases | Tiles",
    description: "Explore how people use Tiles for private work, research, and everyday AI workflows.",
    images: ["https://www.tiles.run/api/og"],
  },
}

interface ConversationCard {
  title: string
  prompt: string
  href?: string
  tall?: boolean
}

const conversationCards: ConversationCard[] = [
  {
    title: "Compare chemistry and physics",
    prompt: "What is chemistry in brief? What about physics then? What were we talking about as of now?",
    href: sharedScienceConversationPath,
    tall: true,
  },
  {
    title: "Brainstorm research questions",
    prompt:
      "I am a medical researcher in pediatric radiology. Based on this dataset and top-tier journal standards, what compelling research questions, analyses, or novel angles could become a publishable paper?",
    tall: true,
  },
  {
    title: "Apply a mathematical model to your research",
    prompt:
      "Tell me about the ordinary differential equation model. How might it be used to predict oocyte consumption in the ovary?",
  },
  {
    title: "Find scientific literature",
    prompt:
      "I am an academic pathologist with a research focus in GI pathology. Summarize current work on transcription factors in high-grade neuroendocrine carcinomas and note references in the GI literature.",
    tall: true,
  },
  {
    title: "Get personalized coaching",
    prompt:
      "Act like a certified health coach and ask me one question at a time about my current exercise, nutrition, supplements, and goals so we can build a plan.",
  },
  {
    title: "Customize your workout plan",
    prompt:
      "Create a six-week progression plan for strength and weight-loss workouts. Keep sessions under 40 minutes and include low-impact cardio.",
    tall: true,
  },
  {
    title: "Review your form from a photo",
    prompt:
      "Can you take a look at my form and do a form check for me? How am I doing?",
  },
  {
    title: "Make a budget",
    prompt:
      "I want to set up a budget. I do not know how to do that, but I want a weekly budget and to be mindful of what I am spending.",
  },
  {
    title: "Get discount codes",
    prompt:
      "Find discount codes for these jeans. Add the item to my cart, scan the web for codes, test each one, and give me the best discount.",
    tall: true,
  },
  {
    title: "Audit your spending habits",
    prompt:
      "Audit my spending habits. Show me where I might be wasting money and how to avoid it.",
  },
  {
    title: "Take inventory of your subscriptions",
    prompt:
      "Identify all subscriptions and recurring charges in my transactions and tell me what to cancel or keep.",
  },
]

function FooterScribble() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 190"
      className="mx-auto h-36 w-full max-w-xs text-foreground/20 dark:text-white/20 sm:h-44 sm:max-w-sm"
      fill="none"
    >
      <path
        d="M70 98c16-24 45-31 71-16 15 9 26 9 42 1 22-11 47-6 62 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M85 135c38 12 80 14 124 5 20-4 39-3 57 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="152" cy="54" r="14" stroke="currentColor" strokeWidth="2" />
      <path
        d="M143 67c-7 11-13 29-8 47M160 68c16 12 23 27 21 46"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M136 87c-19 2-35 9-49 22M173 88c17-2 35 4 51 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M104 112l46-11 44 12-48 14-42-15Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M119 112l31-7 24 7M131 118l27-8M151 123l23-8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M220 36c20-7 39-2 50 13 10 15 7 34-7 46"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="244" cy="63" r="20" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M229 50c10 6 22 8 36 7M226 67c12-1 25 1 37 7M244 43c-7 14-7 28 0 42M254 45c-4 15-4 28 2 39"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M255 91l18 22M269 104l15-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M269 123l36-16 18 39-37 15-17-38Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M281 125l24-10M285 134l25-10M289 143l19-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M292 55l31-10 8 24-30 10-9-24ZM292 88l27-4 4 21-28 4-3-21ZM45 72l35-9 8 28-35 9-8-28Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M311 39c8-8 17-13 28-16M326 79c10 1 19 4 28 10M54 58c-8-9-19-15-32-18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ConversationCardView({ card }: { card: ConversationCard }) {
  const cardClass =
    "group relative mb-3 flex break-inside-avoid flex-col rounded-lg bg-black/[0.045] p-[1.125rem] text-left transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-black/[0.075] hover:shadow-sm dark:bg-white/[0.09] dark:hover:bg-white/[0.13] sm:p-5"
  const minHeightClass = card.tall ? "min-h-[12.5rem]" : "min-h-[10.5rem]"
  const content = (
    <>
      <h2 className="pr-10 text-[0.98rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">
        {card.title}
      </h2>
      <p className="mt-4 text-[0.82rem] leading-6 text-black/68 dark:text-white/68">{card.prompt}</p>
      {card.href ? (
        <span
          className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background opacity-100 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M6 3.5 10.5 8 6 12.5M10.5 8H2.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </>
  )

  if (card.href) {
    return (
      <Link href={card.href} className={`${cardClass} ${minHeightClass}`} aria-label={`Open shared chat: ${card.title}`}>
        {content}
      </Link>
    )
  }

  return <article className={`${cardClass} ${minHeightClass}`}>{content}</article>
}

export default function UseCasesPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex-1 px-4 pb-16 pt-[calc(6.75rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px))]">
        <section className="relative mx-auto flex min-h-[25rem] w-full max-w-6xl flex-col items-center justify-center overflow-hidden pb-10 pt-8 text-center sm:min-h-[29rem] lg:min-h-[32rem]">
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <h1 className="max-w-[13ch] text-balance text-[clamp(2.85rem,8vw,5.3rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-foreground">
              Chats for private work
            </h1>
            <p className={`mt-5 max-w-xl ${marketingPageLeadClass}`}>
              Explore how people use Tiles for private work, research, and everyday AI workflows.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl pb-12">
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
            {conversationCards.map((card) => (
              <ConversationCardView key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center pb-2 pt-6 text-center sm:pb-4 lg:pt-10">
          <FooterScribble />
          <p className="mt-5 max-w-3xl text-[0.78rem] leading-6 text-black/48 dark:text-white/45">
            We do not store a copy of the shared conversation on our servers. Data is fetched from the user&apos;s personal
            data server (PDS) on ATProto.
          </p>
        </section>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
