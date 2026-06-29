"use client"

import { FaRss } from "react-icons/fa6"
import NewsletterForm from "@/components/newsletter-form"
import { cn } from "@/lib/utils"

interface NewsletterCtaProps {
  surface?: "auto" | "light" | "dark"
  className?: string
  formClassName?: string
}

export function NewsletterCta({ surface = "auto", className, formClassName }: NewsletterCtaProps) {
  const headingClass =
    surface === "dark"
      ? "text-[#e7e7ed]"
      : surface === "light"
        ? "text-black"
        : "text-black dark:text-white"
  const textClass =
    surface === "dark"
      ? "text-[#b8b8c2]"
      : surface === "light"
        ? "text-black/70"
        : "text-black/70 dark:text-[#b8b8c2]"
  const linkClass =
    surface === "dark"
      ? "text-[#e7e7ed] hover:text-[#c6c6cf]"
      : surface === "light"
        ? "text-black hover:text-black/65"
        : "text-black hover:text-black/65 dark:text-[#e7e7ed] dark:hover:text-[#c6c6cf]"

  return (
    <div className={cn("flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-7", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className={cn("text-[0.95rem] font-normal tracking-tight", headingClass)}>
            Stay updated
          </h2>
          <a
            href="/api/rss"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center transition-colors", linkClass)}
            aria-label="RSS Feed for blog posts"
          >
            <FaRss className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <p className={cn("text-[0.84rem] leading-6", textClass)}>
          Follow development in{" "}
          <a href="https://go.tiles.run/discord" className={cn("underline transition-colors", linkClass)}>
            Discord
          </a>{" "}
          or via email.
        </p>
      </div>
      <NewsletterForm surface={surface} className={cn("w-full lg:max-w-[24rem]", formClassName)} />
    </div>
  )
}
