"use client"

import { SiteFooter } from "@/components/site-footer"
import {
  roadmapItemSlug,
  roadmapTracks,
  type RoadmapStatus,
} from "@/lib/roadmap-data"
import { roadmapNoteEditUrl } from "@/lib/roadmap-notes-github"
import {
  marketingPageBodyClass,
  marketingPageLeadClass,
  marketingPageMetaClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import { RoadmapNotesMarkdown } from "@/components/roadmap-notes-markdown"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const roadmapLegend = [
  { label: "Shipped", status: "shipped" as const },
  { label: "Work in progress", status: "active" as const },
  { label: "Planned", status: "planned" as const },
]

const roadmapCtaClass =
  "inline-flex items-center gap-1 rounded-sm border border-black/5 bg-black/[0.035] px-3.5 py-1.5 text-[0.82rem] font-medium text-foreground shadow-none transition-colors hover:bg-black/[0.06] dark:border-white/5 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] lg:text-sm"

/** Legend swatches only (no hover/focus, avoids stray rings on non-interactive spans). */
function getRoadmapItemSwatchClassName(status: RoadmapStatus) {
  switch (status) {
    case "shipped":
      return "rounded-md border-[#171717] bg-[#171717] dark:border-white dark:bg-white"
    case "active":
      return "rounded-md border-black/18 bg-black/[0.045] dark:border-white/18 dark:bg-white/[0.08]"
    case "planned":
      return "rounded-md border-[#c7c7c7] border-dashed bg-transparent dark:border-white/24"
    default:
      return ""
  }
}

function getRoadmapItemClassName(status: RoadmapStatus, interactive = true) {
  if (!interactive) {
    return getRoadmapItemSwatchClassName(status)
  }
  switch (status) {
    case "shipped":
      return [
        "rounded-md border-[#171717] bg-[#171717] text-white shadow-sm",
        "hover:border-white/45 hover:bg-[#3a3a3a] hover:shadow-lg hover:shadow-black/40",
        "focus-visible:z-[1] focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.99] active:brightness-95",
        "dark:border-white dark:bg-white dark:text-black",
        "dark:hover:border-black/30 dark:hover:bg-[#e4e4e4] dark:hover:shadow-lg dark:hover:shadow-black/18",
        "dark:focus-visible:ring-black/60 dark:focus-visible:ring-offset-background",
        "dark:active:brightness-100",
      ].join(" ")
    case "active":
      return "rounded-md border-black/18 bg-black/[0.045] text-foreground shadow-sm hover:border-black/28 hover:bg-black/[0.09] hover:shadow-md active:scale-[0.99] dark:border-white/18 dark:bg-white/[0.08] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.14]"
    case "planned":
      return "rounded-md border-[#c7c7c7] border-dashed bg-transparent text-black/52 shadow-none hover:border-black/35 hover:border-solid hover:bg-black/[0.04] hover:text-black/70 hover:shadow-sm active:scale-[0.99] dark:border-white/24 dark:text-white/40 dark:hover:border-white/45 dark:hover:bg-white/[0.06] dark:hover:text-white/60"
    default:
      return ""
  }
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="inline-block h-2.5 w-2.5 align-baseline"
    style={{ verticalAlign: "baseline" }}
  >
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function RoadmapContent({ notesBySlug }: { notesBySlug: Record<string, string> }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const itemParam = searchParams.get("item")
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const notesPaneScrollRef = useRef<HTMLDivElement>(null)

  const slugToNotes = useMemo(
    () => new Map<string, string>(Object.entries(notesBySlug)),
    [notesBySlug],
  )

  const slugToHeading = useMemo(() => {
    const map = new Map<string, { track: string; label: string }>()
    for (const track of roadmapTracks) {
      for (const item of track.items) {
        map.set(roadmapItemSlug(track.label, item.label), {
          track: track.label,
          label: item.label,
        })
      }
    }
    return map
  }, [])

  const validSlugs = useMemo(() => new Set(slugToNotes.keys()), [slugToNotes])

  const [selectedSlug, setSelectedSlug] = useState<string | null>(() =>
    itemParam && validSlugs.has(itemParam) ? itemParam : null,
  )

  useEffect(() => {
    if (itemParam && validSlugs.has(itemParam)) {
      setSelectedSlug(itemParam)
    } else if (itemParam && !validSlugs.has(itemParam)) {
      setSelectedSlug(null)
    }
  }, [itemParam, validSlugs])

  useEffect(() => {
    if (!itemParam || validSlugs.has(itemParam)) {
      return
    }
    const next = new URLSearchParams(searchParams.toString())
    next.delete("item")
    const q = next.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }, [itemParam, pathname, router, searchParams, validSlugs])

  useEffect(() => {
    if (!selectedSlug) {
      return
    }
    const el = horizontalScrollRef.current
    if (!el) {
      return
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({
          left: Math.max(0, el.scrollWidth - el.clientWidth),
          behavior: "smooth",
        })
      })
    })
    return () => cancelAnimationFrame(id)
  }, [selectedSlug])

  const selectItem = useCallback(
    (slug: string) => {
      setSelectedSlug(slug)
      const next = new URLSearchParams(searchParams.toString())
      next.set("item", slug)
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const clearSelection = useCallback(() => {
    setSelectedSlug(null)
    const next = new URLSearchParams(searchParams.toString())
    next.delete("item")
    const q = next.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
    horizontalScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" })
  }, [pathname, router, searchParams])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelection()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [clearSelection])

  const paneMarkdown = selectedSlug ? slugToNotes.get(selectedSlug) ?? "" : ""
  const paneHeading = selectedSlug ? slugToHeading.get(selectedSlug) : undefined

  const notesPermalinkPrefix = useMemo(() => {
    if (!selectedSlug) {
      return undefined
    }
    const q = new URLSearchParams()
    q.set("item", selectedSlug)
    return `${pathname}?${q.toString()}`
  }, [pathname, selectedSlug])

  const scrollNotesPaneToHash = useCallback(() => {
    const raw = typeof window !== "undefined" ? window.location.hash.slice(1) : ""
    if (!raw) {
      return
    }
    let fragment = raw
    try {
      fragment = decodeURIComponent(raw)
    } catch {
      fragment = raw
    }
    const pane = notesPaneScrollRef.current
    if (!pane) {
      return
    }
    const tryScroll = (targetId: string) => {
      const el = document.getElementById(targetId)
      if (el && pane.contains(el)) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        return true
      }
      return false
    }
    if (tryScroll(fragment)) {
      return
    }
    tryScroll(fragment.toLowerCase())
  }, [])

  useEffect(() => {
    if (!selectedSlug || !paneMarkdown) {
      return
    }
    let cancelled = false
    const run = () => {
      if (!cancelled) {
        scrollNotesPaneToHash()
      }
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run)
    })
    const onHashChange = () => run()
    window.addEventListener("hashchange", onHashChange)
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [selectedSlug, paneMarkdown, scrollNotesPaneToHash])

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      <div
        ref={horizontalScrollRef}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden"
        id="roadmap-horizontal-scroll"
      >
        <div
          className="flex h-[calc(100dvh-env(safe-area-inset-bottom,0px))] min-h-[100dvh] w-max max-w-none flex-row"
          role="region"
          aria-label="Roadmap and notes"
        >
          <div
            className="box-border flex min-h-0 w-[100dvw] shrink-0 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
          >
            <main className="flex-1 px-4 pb-16 lg:px-8">
              <section
                id="roadmap"
                className="mb-8 px-2 pb-10 scroll-mt-28 sm:px-4 lg:mb-10 lg:px-0 lg:pb-12 lg:scroll-mt-40"
              >
                <div className="mx-auto max-w-3xl">
                  <h1 className={`mb-3 ${marketingPageTitleClass}`}>Roadmap</h1>
                  <p className={`mb-7 max-w-[46rem] ${marketingPageLeadClass} lg:mb-9`}>
                    We’re starting with the CLI in alpha, with plans to expand to desktop and mobile apps as the product
                    matures.
                    <br />
                    <br />
                    Connector support is planned for the near future. It will be shipped only with proper sandboxing and a
                    documented threat model that meets our security bar.
                  </p>
                  <p className={`mb-6 ${marketingPageMetaClass}`}>
                    Select an item to open markdown notes in the right-hand panel. Scroll the page horizontally to move
                    between columns.
                  </p>
                  <div className="mb-9">
                    <div
                      className={`mb-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 ${marketingPageMetaClass}`}
                    >
                      {roadmapLegend.map((item) => (
                        <div key={item.label} className="inline-flex items-center gap-2">
                          <span
                            className={`h-4 w-9 border ${getRoadmapItemSwatchClassName(item.status)}`}
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-9 lg:space-y-10">
                      {roadmapTracks.map((track) => (
                        <div key={track.label} className="space-y-4">
                          <h2 className="whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.22em] text-foreground/72 sm:text-[0.74rem]">
                            {track.label}
                          </h2>
                          <div className="pb-1">
                            <div className="flex flex-wrap items-start gap-2.5 lg:gap-2 lg:gap-y-3">
                              {track.items.map((item, itemIndex) => {
                                const slug = roadmapItemSlug(track.label, item.label)
                                const isSelected = selectedSlug === slug
                                return (
                                  <div key={item.label} className="contents">
                                    <button
                                      type="button"
                                      onClick={() => selectItem(slug)}
                                      aria-pressed={isSelected}
                                      title={`Open notes: ${item.label}`}
                                      className={cn(
                                        "inline-flex min-h-[2.8rem] cursor-pointer items-center border px-4 py-2 text-left text-[0.92rem] font-normal tracking-[-0.02em] transition-[box-shadow,transform,background-color,border-color,color,filter] duration-150 ease-out lg:min-h-[2.7rem]",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                        getRoadmapItemClassName(item.status),
                                        isSelected &&
                                          "ring-2 ring-foreground/35 ring-offset-2 ring-offset-background dark:ring-offset-background",
                                      )}
                                    >
                                      {item.label}
                                    </button>
                                    {itemIndex < track.items.length - 1 && (
                                      <div
                                        className="hidden h-[2.7rem] w-6 items-center justify-center text-black/14 dark:text-white/16 lg:flex"
                                        aria-hidden="true"
                                      >
                                        <svg viewBox="0 0 32 12" className="h-2.5 w-6" fill="none">
                                          <path d="M2 6H28" stroke="currentColor" strokeWidth="1.5" />
                                          <path d="M23 2L28 6L23 10" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className={`mb-5 ${marketingPageBodyClass}`}>
                    If you would like to influence how we implement this roadmap, join the discussion in our RFCs.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="https://github.com/orgs/tilesprivacy/projects/4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={roadmapCtaClass}
                    >
                      Track progress
                      <ExternalLinkIcon />
                    </a>
                    <a
                      href="https://github.com/orgs/tilesprivacy/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={roadmapCtaClass}
                    >
                      View the RFCs
                      <ExternalLinkIcon />
                    </a>
                  </div>
                </div>
              </section>
            </main>
            <SiteFooter />
          </div>

          <aside
            className="box-border flex h-full min-h-0 w-[min(100dvw,28rem)] shrink-0 flex-col overflow-hidden border-l border-black/10 bg-background pt-[env(safe-area-inset-top,0px)] dark:border-white/10"
            aria-label="Roadmap item notes"
          >
            {selectedSlug && paneHeading ? (
              <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-black/8 bg-background/95 px-3 py-2 backdrop-blur-sm sm:px-4 dark:border-white/10 dark:bg-background/95">
                <nav
                  aria-label="Roadmap item location"
                  className="min-w-0 flex-1 pr-1"
                >
                  <ol className="flex min-w-0 list-none flex-wrap items-center gap-x-1 gap-y-0.5 p-0 text-[0.7rem] leading-snug">
                    <li className="min-w-0 truncate font-medium text-foreground/75">
                      {paneHeading.track}
                    </li>
                    <li aria-hidden className="shrink-0 text-foreground/30">
                      /
                    </li>
                    <li className="min-w-0 truncate text-foreground/85">
                      {paneHeading.label}
                    </li>
                  </ol>
                </nav>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={roadmapNoteEditUrl(selectedSlug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[11rem] items-center gap-1 truncate text-[0.72rem] font-medium text-foreground/60 underline decoration-foreground/20 underline-offset-[0.2em] transition-colors hover:text-foreground hover:decoration-foreground/40 sm:max-w-none"
                  >
                    <span className="truncate">Edit on GitHub</span>
                    <ExternalLinkIcon />
                  </a>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-foreground/55 transition-colors hover:bg-black/[0.06] hover:text-foreground dark:hover:bg-white/[0.08]"
                    aria-label="Close notes pane"
                  >
                    <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : null}
            <div
              ref={notesPaneScrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-6"
            >
              {selectedSlug && paneMarkdown ? (
                <RoadmapNotesMarkdown content={paneMarkdown} permalinkPrefix={notesPermalinkPrefix} />
              ) : (
                <p className={`${marketingPageBodyClass} text-foreground/70`}>
                  Choose a roadmap item on the left. On desktop, drag or swipe the page horizontally to move between
                  this panel and the roadmap. Press Escape to clear the selection.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
