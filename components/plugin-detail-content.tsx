"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Copy } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { PluginIcon } from "@/components/plugin-icon"
import { triggerHaptic } from "@/lib/haptics"
import {
  marketingPageSubsectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import type { TilesPlugin, TilesPluginSkill } from "@/lib/plugins"

interface PluginDetailContentProps {
  plugin: TilesPlugin
  skills: TilesPluginSkill[]
}

export function PluginDetailContent({ plugin, skills }: PluginDetailContentProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedUsageCommand, setCopiedUsageCommand] = useState(false)
  const primarySkillName = skills[0]?.name || plugin.slug
  const usageCommand = `/ $${primarySkillName}`
  const usageCommandClipboardText = `$${primarySkillName}`

  function copyText(text: string) {
    const copyWithTextArea = () => {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    if (!navigator.clipboard?.writeText) {
      copyWithTextArea()
      return
    }

    void navigator.clipboard.writeText(text).catch(copyWithTextArea)
  }

  function copyCommand() {
    triggerHaptic()
    setCopiedCommand(true)
    window.setTimeout(() => setCopiedCommand(false), 1400)
    copyText(plugin.installCommand)
  }

  function copyUsageCommand() {
    triggerHaptic()
    setCopiedUsageCommand(true)
    window.setTimeout(() => setCopiedUsageCommand(false), 1400)
    copyText(usageCommandClipboardText)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 px-5 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-[768px]">
          <section className="min-w-0">
            <Link
              href="/plugins"
              className="mb-8 inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
              Back
            </Link>

            <div className="mb-7 flex flex-col gap-4">
              <div className="flex shrink-0 items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-secondary text-foreground ring-1 ring-border/60">
                  <PluginIcon slug={plugin.slug} />
                </span>
                <h1 className={`truncate lg:overflow-visible lg:whitespace-nowrap ${marketingPageTitleClass}`}>
                  {plugin.name}
                </h1>
              </div>

              <div className="w-full min-w-0">
                <div className="relative h-10 overflow-hidden rounded-[8px] border border-border bg-secondary/45 lg:flex lg:items-stretch">
                  <code className="flex h-full items-center overflow-x-auto whitespace-nowrap px-4 pr-12 font-mono text-sm leading-5 text-foreground [-webkit-overflow-scrolling:touch] lg:min-w-0 lg:flex-1 lg:pr-4">
                    {plugin.installCommand}
                  </code>
                  <button
                    type="button"
                    onClick={copyCommand}
                    aria-label={copiedCommand ? "Install command copied" : `Copy install command for ${plugin.name}`}
                    className="absolute inset-y-0 right-0 z-10 flex items-center bg-background/90 px-3.5 text-muted-foreground transition-colors hover:text-foreground lg:static lg:z-auto lg:shrink-0 lg:border-l lg:border-border lg:bg-transparent lg:px-4"
                  >
                    {copiedCommand ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              </div>
            </div>

            <p className="mb-10 max-w-3xl text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
              {plugin.slug === "caldir" ? (
                <>
                  <a
                    href="https://caldir.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                  >
                    Caldir
                  </a>{" "}
                  is a tool for storing your calendar as a directory of ICS files.
                </>
              ) : (
                plugin.description
              )}
            </p>

            <div className="mb-12">
              <h2 className={`mb-3 ${marketingPageSubsectionTitleClass}`}>Usage</h2>
              <div className="relative flex h-10 items-center overflow-hidden rounded-[8px] bg-secondary/65">
                <code className="block flex-1 overflow-x-auto whitespace-nowrap px-4 pr-12 font-mono text-sm leading-5 text-foreground [-webkit-overflow-scrolling:touch]">
                  {usageCommand}
                </code>
                <button
                  type="button"
                  onClick={copyUsageCommand}
                  aria-label={copiedUsageCommand ? "Usage command copied" : `Copy usage command for ${plugin.name}`}
                  className="absolute inset-y-0 right-0 z-10 flex items-center bg-background/90 px-3.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copiedUsageCommand ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                </button>
              </div>
            </div>

            {skills.length > 0 ? (
              <div>
                <h2 className={`mb-4 ${marketingPageSubsectionTitleClass}`}>
                  Skills <span className="text-muted-foreground/55">{skills.length}</span>
                </h2>
                <div className="overflow-hidden rounded-[8px] bg-secondary/65">
                  {skills.map((skill, index) => (
                    <a
                      key={skill.sourceUrl}
                      href={skill.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-[75px] items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-muted-foreground/55 shadow-sm ring-1 ring-border/60">
                        {plugin.slug === "caldir" || plugin.slug === "youtube-transcript" ? (
                          <PluginIcon slug={plugin.slug} />
                        ) : (
                          <BookOpen className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[17px] font-medium leading-[21px] text-foreground">
                          {plugin.slug === "caldir" ? "caldir" : skill.name}
                        </span>
                        {skill.description && plugin.slug !== "caldir" ? (
                          <span className="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">{skill.description}</span>
                        ) : null}
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/55 transition-colors group-hover:text-foreground" aria-hidden />
                      {index < skills.length - 1 ? <span className="sr-only">Skill</span> : null}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
