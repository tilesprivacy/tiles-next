// Tracks which "On this page" heading the reader is in: the last heading whose
// top has scrolled past the line just under the fixed header (or, on small
// screens, under the sticky book bar). One IntersectionObserver does it.

const MOBILE = "(max-width: 1023px)"

function readingLine() {
  if (matchMedia(MOBILE).matches) {
    const bar = document.querySelector(".book-mobile-breadcrumb")
    return Math.ceil((bar?.getBoundingClientRect().bottom ?? 96) + 12)
  }
  const header = document.querySelector("header.minimal-topbar")
  return Math.ceil((header?.getBoundingClientRect().bottom ?? 88) + 16)
}

export class ActiveHeading {
  id = $state("")

  /** Starts tracking the given heading ids; returns a cleanup function. */
  track(ids: string[]): () => void {
    const headings = ids.map((id) => document.getElementById(id)).filter((el) => el !== null)
    if (headings.length === 0) {
      this.id = ""
      return () => {}
    }

    const passed = new Set<string>()
    let observer: IntersectionObserver | undefined

    const start = () => {
      observer?.disconnect()
      passed.clear()
      const line = readingLine()
      // The root box runs from the reading line to far below the viewport, so a
      // heading's state flips exactly when its top crosses the line, even on jumps.
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.boundingClientRect.top <= line + 1) passed.add(entry.target.id)
            else passed.delete(entry.target.id)
          }
          this.id = headings.findLast((el) => passed.has(el.id))?.id ?? headings[0].id
        },
        { rootMargin: `-${line}px 0px 100000px 0px`, threshold: [0, 1] },
      )
      for (const heading of headings) observer.observe(heading)
    }

    start()
    const media = matchMedia(MOBILE)
    media.addEventListener("change", start)
    return () => {
      media.removeEventListener("change", start)
      observer?.disconnect()
    }
  }
}
