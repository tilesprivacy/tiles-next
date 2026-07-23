"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronRight, Plus } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { PluginIcon } from "@/components/plugin-icon"
import { marketingPageTitleClass } from "@/lib/marketing-page-title-classes"
import type { TilesPlugin } from "@/lib/plugins"

interface PluginsContentProps {
  plugins: TilesPlugin[]
}

export function PluginsContent({ plugins }: PluginsContentProps) {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLowerCase()

  const filteredPlugins = useMemo(() => {
    if (!normalizedQuery) {
      return plugins
    }

    return plugins.filter((plugin) =>
      [plugin.name, plugin.description, plugin.fileName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [normalizedQuery, plugins])

  const showMakeYourOwnPluginCard =
    !normalizedQuery ||
    "make your own plugin build your own plugin using the package layout".includes(
      normalizedQuery,
    )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 px-5 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-[768px]">
          <section className="min-w-0">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h1 className={marketingPageTitleClass}>Extend the Agent</h1>
              </div>

              <label className="relative block w-full md:mt-1.5 md:w-[18.75rem]">
                <span className="sr-only">Search plugins</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search plugins"
                  className="h-10 w-full rounded-full border-0 bg-secondary/65 px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/75 focus:bg-secondary"
                />
              </label>
            </div>

            <div id="all-plugins" className="grid gap-3 sm:max-w-[48rem] sm:grid-cols-2">
              {filteredPlugins.map((plugin) => (
                <Link
                  key={plugin.downloadUrl}
                  href={`/plugins/${plugin.slug}`}
                  className="group flex h-[75px] items-center gap-3 overflow-hidden rounded-[8px] bg-secondary/65 px-4 py-4 text-card-foreground transition-colors hover:bg-secondary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-foreground shadow-sm ring-1 ring-border/60">
                    <PluginIcon slug={plugin.slug} />
                  </span>
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-medium leading-[21px] text-foreground">{plugin.name}</span>
                    <span className="mt-0.5 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 text-muted-foreground">{plugin.description}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
                </Link>
              ))}
              {showMakeYourOwnPluginCard ? (
                <Link
                  href="/book/manual#plugin-package-layout"
                  className="group flex h-[75px] items-center gap-3 overflow-hidden rounded-[8px] bg-secondary/65 px-4 py-4 text-card-foreground transition-colors hover:bg-secondary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-background text-foreground shadow-sm ring-1 ring-border/60">
                    <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 overflow-hidden">
                    <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-medium leading-[21px] text-foreground">
                      Make your own plugin
                    </span>
                    <span className="mt-0.5 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5 text-muted-foreground">
                      Build your own plugin using the package layout.
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
                </Link>
              ) : null}
            </div>

            {filteredPlugins.length === 0 && !showMakeYourOwnPluginCard ? (
              <div className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
                No plugins match that search.
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
