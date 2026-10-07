"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, BookOpen, Server } from "lucide-react"
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

export function PluginDetailContent({ plugin, metadata, mcpServers, skills }: PluginDetailContentProps) {
  const [deepLinkFailed, setDeepLinkFailed] = useState(false)
  const [copiedInstallCommand, setCopiedInstallCommand] = useState(false)
  const installHref = `tiles://plugins/${plugin.slug}`

  function copyInstallCommand() {
    copyText(plugin.installCommand)
    setCopiedInstallCommand(true)
    window.setTimeout(() => setCopiedInstallCommand(false), 1400)
  }

  function handleInstallClick() {
    triggerHaptic()

    if (deepLinkFailed) {
      copyInstallCommand()
    }

    let timer = 0
    let settled = false

    function settle(fallback: boolean) {
      if (settled) {
        return
      }

      settled = true
      window.clearTimeout(timer)
      window.removeEventListener("blur", onBlur)
      document.removeEventListener("visibilitychange", onVisibilityChange)

      if (fallback) {
        setDeepLinkFailed(true)
        copyInstallCommand()
      }
    }

    function onBlur() {
      settle(false)
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        settle(false)
      }
    }

    timer = window.setTimeout(() => settle(true), 1500)
    window.addEventListener("blur", onBlur)
    document.addEventListener("visibilitychange", onVisibilityChange)
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

            <div className="mb-7 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-secondary text-foreground ring-1 ring-border/60">
                  <PluginIcon slug={plugin.slug} />
                </span>
                <h1 className={`min-w-0 truncate lg:overflow-visible lg:whitespace-nowrap ${marketingPageTitleClass}`}>
                  {plugin.name}
                </h1>
              </div>

              {!plugin.builtIn ? (
                <a
                  href={installHref}
                  onClick={handleInstallClick}
                  aria-label={
                    deepLinkFailed
                      ? `Install ${plugin.name} in Tiles or copy the install command`
                      : `Install ${plugin.name} in Tiles`
                  }
                  className="inline-flex h-9 shrink-0 items-center justify-center rounded-[8px] bg-foreground px-3 text-xs font-medium sm:h-11 sm:px-5 sm:text-sm text-background transition-opacity hover:opacity-85 cyberpunk:bg-[var(--sponsor-yellow)] cyberpunk:text-black"
                >
                  {copiedInstallCommand ? "Copied" : "Install"}
                </a>
              ) : null}
            </div>

            <div className="mb-10 max-w-3xl">
              <p className="text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
                {plugin.description}
              </p>
              {plugin.requirements ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {plugin.requirements}{" "}
                  {plugin.documentationUrl ? (
                    <a
                      href={plugin.documentationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-foreground underline decoration-current/35 underline-offset-4 transition-opacity hover:opacity-75"
                    >
                      Setup guide
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : null}
                </p>
              ) : null}
              {plugin.showCliInstall || deepLinkFailed ? (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    {deepLinkFailed ? "Tiles didn't open? Install from your terminal instead:" : "Or install from the CLI:"}
                  </p>
                  <pre
                    tabIndex={0}
                    aria-label={`Install ${plugin.name} command`}
                    className="mt-2 overflow-x-auto rounded-[8px] bg-secondary/65 p-4 text-xs leading-6 sm:text-sm"
                  >
                    <code>{plugin.installCommand}</code>
                  </pre>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Restart Tiles, then use <code>@{plugin.slug}</code> in chat.
                  </p>
                </div>
              ) : null}
            </div>

            {mcpServers.length > 0 ? (
              <div className="mb-12">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className={marketingPageSubsectionTitleClass}>
                    MCP <span className="ml-2 text-muted-foreground/55">{mcpServers.length}</span>
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
                  Skills <span className="ml-2 text-muted-foreground/55">{skills.length}</span>
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
