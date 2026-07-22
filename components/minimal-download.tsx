"use client"

import { Check, ChevronDown, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const linuxCommand = "curl -LsSf https://www.tiles.run/install.sh | sh"

export function MinimalDownload({ macDownloadUrl }: { macDownloadUrl: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [])

  const copyLinuxCommand = async () => {
    await navigator.clipboard.writeText(linuxCommand)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="minimal-download" ref={rootRef}>
      <div className="minimal-download-buttons">
        <a href="/download">Download free for Mac and Linux</a>
        <button
          type="button"
          aria-label="Other downloads"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="minimal-download-menu">
          <strong>Quick install for Linux</strong>
          <span>Or open the download page for every installer option.</span>
          <button type="button" onClick={copyLinuxCommand}>
            <code>{linuxCommand}</code>
            {copied ? <Check aria-label="Copied" /> : <Copy aria-label="Copy Linux install command" />}
          </button>
        </div>
      ) : null}
    </div>
  )
}
