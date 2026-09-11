"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Copy, Server } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { PluginIcon } from "@/components/plugin-icon"
import { triggerHaptic } from "@/lib/haptics"
import {
  marketingPageSubsectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import type {
  TilesPlugin,
  TilesPluginMcpServer,
  TilesPluginMetadata,
  TilesPluginSkill,
} from "@/lib/plugins"

interface PluginDetailContentProps {
  plugin: TilesPlugin
  metadata: TilesPluginMetadata | null
  mcpServers: TilesPluginMcpServer[]
  skills: TilesPluginSkill[]
}

function metadataLabel(key: string) {
  if (key === "$schema") {
    return "Schema"
  }

  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase())
}

function mcpTypeLabel(type: string) {
  return type
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => (part.toLowerCase() === "http" ? "HTTP" : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ")
}

export function PluginDetailContent({ plugin, metadata, mcpServers, skills }: PluginDetailContentProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedUsageCommand, setCopiedUsageCommand] = useState(false)
  const usageCommand = `@${plugin.slug}`

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
    copyText(usageCommand)
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

            <div className="mb-7 flex flex-col gap-6">
              <div className="flex shrink-0 items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-secondary text-foreground ring-1 ring-border/60">
                  <PluginIcon slug={plugin.slug} />
                </span>
                <h1 className={`truncate lg:overflow-visible lg:whitespace-nowrap ${marketingPageTitleClass}`}>
                  {plugin.name}
                </h1>
              </div>

              {!plugin.builtIn ? (
                <div className="w-full min-w-0">
                  <button
                    type="button"
                    onClick={copyCommand}
                    aria-label={copiedCommand ? "Install command copied" : `Copy install command for ${plugin.name}`}
                    className="minimal-command plugin-command"
                  >
                    <code className="min-w-0">
                      <span className="mr-2 select-none text-muted-foreground" aria-hidden>$</span>
                      {plugin.installCommand}
                    </code>
                    {copiedCommand ? <Check aria-hidden /> : <Copy aria-hidden />}
                  </button>
                </div>
              ) : null}
            </div>

            <p className="mb-10 max-w-3xl text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
              {plugin.description}
            </p>

            <div className="mb-12">
              <h2 className={`mb-3 ${marketingPageSubsectionTitleClass}`}>Usage</h2>
              <button
                type="button"
                onClick={copyUsageCommand}
                aria-label={copiedUsageCommand ? "Usage command copied" : `Copy usage command for ${plugin.name}`}
                className="minimal-command plugin-command"
              >
                <code className="min-w-0">
                  <span className="mr-2 select-none text-muted-foreground" aria-hidden>&gt;</span>
                  {usageCommand}
                </code>
                {copiedUsageCommand ? <Check aria-hidden /> : <Copy aria-hidden />}
              </button>
            </div>

            {mcpServers.length > 0 ? (
              <div className="mb-12">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className={marketingPageSubsectionTitleClass}>
                    MCP <span className="text-muted-foreground/55">{mcpServers.length}</span>
                  </h2>
                  <a
                    href={mcpServers[0].sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View mcp.json
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <div className="overflow-hidden rounded-[8px] bg-secondary/65">
                  {mcpServers.map((server) => (
                    <div key={server.name} className="flex min-h-[75px] items-center gap-3 border-b border-border/55 px-4 py-4 last:border-b-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-muted-foreground/55 shadow-sm ring-1 ring-border/60">
                        <Server className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[17px] font-medium leading-[21px] text-foreground">{server.name}</span>
                        <span className="mt-0.5 block truncate text-sm leading-5 text-muted-foreground">
                          {[mcpTypeLabel(server.type), server.endpoint].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {skills.length > 0 ? (
              <div className={metadata ? "mb-12" : undefined}>
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
                        {plugin.slug === "caldir" ? <PluginIcon slug={plugin.slug} /> : <BookOpen className="h-5 w-5" aria-hidden />}
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

            {metadata ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className={marketingPageSubsectionTitleClass}>Plugin metadata</h2>
                  <a
                    href={metadata.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View plugin.json
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <dl className="overflow-hidden rounded-[8px] bg-secondary/65">
                  {metadata.fields.map((field) => (
                    <div
                      key={field.key}
                      className="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-border/55 px-4 py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
                    >
                      <dt className="text-sm font-medium text-muted-foreground">{metadataLabel(field.key)}</dt>
                      <dd className="min-w-0 break-words text-sm text-foreground">
                        {field.href ? (
                          <a
                            href={field.href}
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                          >
                            {field.value}
                          </a>
                        ) : (
                          field.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
