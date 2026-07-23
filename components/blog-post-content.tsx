'use client'

import Image from "next/image"
import { ReactNode, useEffect, useRef } from 'react'
import { ArticleShareAndNewsletter } from "@/components/article-share-and-newsletter"
import { SiteFooter } from "@/components/site-footer"
import { BlogReference } from "@/components/blog-reference"
import { BlogTableOfContents } from "@/components/blog-table-of-contents"
import { ReadingTime } from "@/components/reading-time"
import { BlogAuthorDisplayName } from "@/components/blog-author-display-name"
import { PersonAvatar } from "@/components/person-avatar"
import { getPersonById } from "@/lib/people"
import { SocialLinks } from "@/components/social-links"
import { blogArticleProseClass } from "@/lib/blog-article-prose-classes"
import { marketingPageArticleTitleClass } from "@/lib/marketing-page-title-classes"

interface BlogPostContentProps {
  title: string
  description: string
  date: string
  /** Person ID from `lib/people.ts` */
  authorId?: string
  coverImage?: string
  coverImageDark?: string
  coverAlt?: string
  coverImageWidth?: number
  coverImageHeight?: number
  standardSiteDocumentUri?: string
  content: string
  /** When false, hides the mobile and desktop table of contents. Defaults to true. */
  showTableOfContents?: boolean
  children: ReactNode
}

function buildAtprotoAtUriUrl(sourceUri: string): string | null {
  if (!sourceUri.startsWith("at://")) {
    return null
  }

  const viewerUri = sourceUri.replace(/^at:\/\//, "")
  return `https://atproto.at/viewer?uri=${encodeURIComponent(viewerUri)}`
}

export function BlogPostContent({ 
  title, 
  description, 
  date, 
  authorId,
  coverImage, 
  coverImageDark,
  coverAlt, 
  coverImageWidth = 1200,
  coverImageHeight = 600,
  standardSiteDocumentUri,
  content,
  showTableOfContents = true,
  children 
}: BlogPostContentProps) {
  const articleRef = useRef<HTMLElement>(null)
  const author = authorId ? getPersonById(authorId) : null
  const standardSiteDocumentUrl = standardSiteDocumentUri
    ? buildAtprotoAtUriUrl(standardSiteDocumentUri)
    : null

  useEffect(() => {
    const jsonTokenPattern = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
    const article = articleRef.current

    article?.querySelectorAll<HTMLElement>("code.language-json:not([data-syntax-highlighted])").forEach((code) => {
      const source = code.textContent ?? ""
      const fragment = document.createDocumentFragment()
      let cursor = 0

      for (const match of source.matchAll(jsonTokenPattern)) {
        const index = match.index ?? 0
        fragment.append(document.createTextNode(source.slice(cursor, index)))

        const token = document.createElement("span")
        if (match[1]) {
          token.className = match[2] ? "syntax-json-key" : "syntax-json-string"
          token.textContent = match[1]
          fragment.append(token)
          if (match[2]) fragment.append(document.createTextNode(match[2]))
        } else {
          token.className = match[3] ? "syntax-json-literal" : "syntax-json-number"
          token.textContent = match[0]
          fragment.append(token)
        }

        cursor = index + match[0].length
      }

      fragment.append(document.createTextNode(source.slice(cursor)))
      code.replaceChildren(fragment)
      code.dataset.syntaxHighlighted = "true"
    })

    article?.querySelectorAll<HTMLElement>("code.language-json").forEach((code) => {
      const pre = code.parentElement
      if (!(pre instanceof HTMLPreElement) || pre.dataset.wrapControl === "true") return

      const shell = document.createElement("div")
      shell.className = "article-code-block-shell"
      pre.before(shell)
      shell.append(pre)

      const toggle = document.createElement("button")
      toggle.type = "button"
      toggle.className = "article-code-wrap-toggle blog-print-screen-only"
      toggle.setAttribute("aria-pressed", "false")

      const setWrapped = (wrapped: boolean) => {
        pre.dataset.codeWrap = wrapped ? "true" : "false"
        toggle.setAttribute("aria-pressed", String(wrapped))
        toggle.textContent = wrapped ? "Unwrap" : "Wrap"
        toggle.setAttribute(
          "aria-label",
          wrapped ? "Show JSON without line wrapping" : "Wrap JSON lines",
        )
        if (wrapped) pre.scrollLeft = 0
      }

      toggle.addEventListener("click", () => {
        setWrapped(pre.dataset.codeWrap !== "true")
      })

      pre.dataset.wrapControl = "true"
      setWrapped(false)
      shell.prepend(toggle)
    })
  }, [content])

  return (
    <div data-blog-page data-blog-article className="relative flex min-h-screen flex-col bg-background">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center gap-6 overflow-x-clip px-6 pb-20 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 lg:gap-12 lg:px-10 lg:pb-24 lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] xl:overflow-visible xl:px-12">
        {/* Bottom Card - Blog Post Content */}
        <div className="blog-article-column relative w-full max-w-[90rem] py-8 lg:py-14 xl:grid xl:grid-cols-[minmax(14rem,1fr)_minmax(0,44rem)_minmax(14rem,1fr)] xl:gap-x-10">
          <div className="mx-auto w-full max-w-[44rem] overflow-x-clip xl:col-start-2 xl:row-start-1 xl:mx-0 xl:max-w-none xl:overflow-visible">
          <div
            data-blog-print-masthead
            className="mb-0 hidden print:flex print:items-center print:gap-2.5"
            aria-hidden
          >
            {/* Native img keeps print/PDF output reliable across browsers. */}
            <img
              src="/lighticon.png"
              alt=""
              width={48}
              height={48}
              className="h-8 w-8 print:h-11 print:w-11"
            />
            <span className="text-[1.15rem] font-semibold tracking-[-0.02em] text-black print:text-[2.35rem] print:leading-none">
              Tiles
            </span>
          </div>

          {/* Blog Title */}
          <div data-blog-print-header className="mb-8 lg:mb-12">
            <h1 className={`mb-4 lg:mb-4 ${marketingPageArticleTitleClass}`}>
              {title}
            </h1>
            <p
              data-blog-print-subtitle
              className="mb-4 text-[0.98rem] leading-[1.65] text-black/56 dark:text-white/56 lg:mb-4 lg:text-[1.06rem]"
            >
              {description}
            </p>
            <div data-blog-print-meta className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm text-black/42 dark:text-white/42 lg:text-[0.95rem]">{date}</p>
                <span className="text-black/20 dark:text-white/20" aria-hidden>
                  ·
                </span>
                <ReadingTime
                  content={content}
                  className="text-sm text-black/42 dark:text-white/42 lg:text-[0.95rem]"
                />
              </div>
              {author && (
                <div className="mt-0.5 flex items-center gap-1.5">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <PersonAvatar
                      name={author.name}
                      links={author.links}
                      variant="blog"
                      loading="eager"
                      className="inline-flex shrink-0"
                    />
                    <BlogAuthorDisplayName
                      fullName={author.name}
                      className="whitespace-nowrap text-sm text-black/58 dark:text-white/58 lg:text-[0.95rem]"
                      handleClassName="text-black/44 dark:text-white/44"
                    />
                  </div>
                  <SocialLinks
                    name={author.name}
                    links={author.links}
                    className="blog-print-screen-only flex shrink-0 items-center gap-0"
                    linkClassName="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/70 dark:focus-visible:outline-white/60"
                    iconClassName="h-3.5 w-3.5 lg:h-4 lg:w-4"
                  />
                </div>
              )}
            </div>
          </div>

          {coverImage ? (
            <div className="blog-print-screen-only mb-8 lg:mb-16">
              {coverImageDark ? (
                <>
                  <Image
                    src={coverImage}
                    alt={coverAlt ?? title}
                    width={coverImageWidth}
                    height={coverImageHeight}
                    className="w-full h-auto rounded-lg dark:hidden"
                  />
                  <Image
                    src={coverImageDark}
                    alt={coverAlt ?? title}
                    width={coverImageWidth}
                    height={coverImageHeight}
                    className="hidden w-full h-auto rounded-lg dark:block"
                  />
                </>
              ) : (
                <Image
                  src={coverImage}
                  alt={coverAlt ?? title}
                  width={coverImageWidth}
                  height={coverImageHeight}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
          ) : null}

          {showTableOfContents ? (
            <div className="blog-print-screen-only mb-8 lg:mb-16 xl:hidden">
              <BlogTableOfContents mode="mobile" />
            </div>
          ) : null}
          </div>

          {showTableOfContents ? (
            <aside className="blog-print-screen-only hidden xl:col-start-1 xl:row-start-2 xl:block xl:min-h-0 xl:self-stretch">
              <BlogTableOfContents />
            </aside>
          ) : null}

          <article ref={articleRef} className="blog-article-container relative mx-auto w-full max-w-[44rem] xl:col-start-2 xl:row-start-2 xl:mx-0 xl:max-w-none">
              {/* Container for side references on desktop */}
              <div className="blog-reference-container hidden xl:block absolute left-0 top-0 w-full h-full pointer-events-none" />

              <div className={blogArticleProseClass}>
                {children}
              </div>
              {standardSiteDocumentUri ? (
                <div className="blog-print-screen-only mt-10 border-t border-black/8 pt-5 text-xs leading-6 text-black/54 dark:border-white/10 dark:text-white/54 lg:text-sm">
                  <span>Published on ATproto: </span>
                  {standardSiteDocumentUrl ? (
                    <a
                      href={standardSiteDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-black underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-black/40 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40"
                    >
                      {standardSiteDocumentUri}
                    </a>
                  ) : (
                    <span className="break-all">{standardSiteDocumentUri}</span>
                  )}
                  <span>.</span>
                </div>
              ) : null}
          </article>

          <div className="hidden xl:col-start-3 xl:row-start-2 xl:block" aria-hidden="true" />

          <div className="mx-auto w-full max-w-[44rem] xl:col-start-2 xl:row-start-3 xl:mx-0 xl:max-w-none">
            <div data-blog-article-footer>
              <ArticleShareAndNewsletter
                title={title}
                moreLinkHref="/blog"
                moreLinkLabel="more posts"
              />
            </div>

            <p data-blog-print-footer className="mt-0 hidden print:block">
              © 2026 <a href="https://www.tilesprivacy.org">Tiles Privacy</a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
