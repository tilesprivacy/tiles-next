import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { marketingPageLeadClass } from "@/lib/marketing-page-title-classes"

const sharedScienceConversationPath =
  "/share/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuc2Vzc2lvbi8zbWtuMm9veG5xeTI3"

export const useCasesPageMetadata: Metadata = {
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
}

const conversationCards: ConversationCard[] = [
  {
    title: "Compare chemistry and physics",
    prompt: "What is chemistry in brief? What about physics then? What were we talking about as of now?",
    href: sharedScienceConversationPath,
  },
  {
    title: "Apply a mathematical model to your research",
    prompt:
      "Tell me about the ordinary differential equation model. How might it be used to predict oocyte consumption in the ovary?",
  },
  {
    title: "Make a budget",
    prompt:
      "I want to set up a budget. I do not know how to do that, but I want a weekly budget and to be mindful of what I am spending.",
  },
  {
    title: "Brainstorm research questions",
    prompt:
      "I am a medical researcher in pediatric radiology. Based on this dataset and top-tier journal standards, what compelling research questions, analyses, or novel angles could become a publishable paper?",
  },
  {
    title: "Get personalized coaching",
    prompt:
      "Act like a certified health coach and ask me one question at a time about my current exercise, nutrition, supplements, and goals so we can build a plan.",
  },
  {
    title: "Audit your spending habits",
    prompt:
      "Audit my spending habits. Show me where I might be wasting money and how to avoid it.",
  },
  {
    title: "Find scientific literature",
    prompt:
      "I am an academic pathologist with a research focus in GI pathology. Summarize current work on transcription factors in high-grade neuroendocrine carcinomas and note references in the GI literature.",
  },
  {
    title: "Customize your workout plan",
    prompt:
      "Create a six-week progression plan for strength and weight-loss workouts. Keep sessions under 40 minutes and include low-impact cardio.",
  },
  {
    title: "Take inventory of your subscriptions",
    prompt:
      "Identify all subscriptions and recurring charges in my transactions and tell me what to cancel or keep.",
  },
]

function ConversationCardView({ card }: { card: ConversationCard }) {
  const cardClass =
    "group mb-3 flex break-inside-avoid flex-col rounded-lg bg-[#F3F3F3] p-[1.125rem] text-left text-black transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#F3F3F3] hover:shadow-sm focus-visible:bg-[#F3F3F3] dark:bg-[#3f3f3f] dark:text-white dark:hover:bg-[#414141] dark:focus-visible:bg-[#414141] sm:p-5"
  const content = (
    <>
      <h2 className="text-[0.98rem] font-semibold leading-snug tracking-[-0.02em] text-black dark:text-white">{card.title}</h2>
      <p className="mt-4 text-[0.82rem] leading-6 text-black/62 dark:text-white/72">{card.prompt}</p>
      {card.href ? (
        <span
          className="mt-5 flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center self-end rounded-full bg-black text-white opacity-0 shadow-sm transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-foreground dark:text-background"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            <path
              d="M10 15V5M10 5 5.75 9.25M10 5l4.25 4.25"
              stroke="currentColor"
              strokeWidth="2"
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
      <Link href={card.href} className={cardClass} aria-label={`Open shared chat: ${card.title}`}>
        {content}
      </Link>
    )
  }

  return <article className={cardClass}>{content}</article>
}

export function UseCasesPage() {
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
            <p className="mt-7 text-[0.82rem] font-medium leading-5 text-black/46 dark:text-white/46">
              Tap a chat to view shared conversation.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-none pb-12">
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&:has(:focus-visible)>:not(:focus-visible)]:bg-[#F7F7F7] [&:has(:hover)>:not(:hover)]:bg-[#F7F7F7] dark:[&:has(:focus-visible)>:not(:focus-visible)]:bg-[#383838] dark:[&:has(:hover)>:not(:hover)]:bg-[#383838]">
            {conversationCards.map((card) => (
              <ConversationCardView key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center pb-2 pt-6 text-center sm:pb-4 lg:pt-10">
          <p className="max-w-3xl text-[0.78rem] leading-6 text-black/48 dark:text-white/45">
            We do not store a copy of the shared conversation on our servers. Data is fetched from the user&apos;s personal
            data server (PDS) on ATProto.
          </p>
        </section>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
