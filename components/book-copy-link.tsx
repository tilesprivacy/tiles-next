'use client'

import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { FaLink } from 'react-icons/fa6'

const copyIconClass =
  'h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5'
const copyLabelClass =
  'text-[11px] text-black/50 dark:text-white/50 lg:text-xs'

function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof window === 'undefined') return

    const url = window.location.href
    if (!url) return

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
    } else {
      // Fallback: open URL so user can copy manually
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="book-copy-link-control inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="inline-flex items-center justify-center"
      >
        <FaLink className={copyIconClass} aria-hidden />
      </button>
      <span className={`${copyLabelClass} leading-none`}>{copied ? 'Copied' : 'Copy link'}</span>
    </div>
  )
}

export function BookCopyLink() {
  const pathname = usePathname()
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [headerBottom, setHeaderBottom] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const style: CSSProperties | null = useMemo(() => {
    if (!anchorRect) return null
    const safeTop = Math.max(0, headerBottom) + 8
    // Hide the control as soon as its anchor reaches the top header zone.
    if (anchorRect.top <= safeTop) return null
    const isMobile = viewportWidth > 0 && viewportWidth <= 1023
    const preferredLeft = anchorRect.left - 12
    const hasRoomOnLeft = preferredLeft >= 160

    // Keep a consistent "attached companion control" appearance:
    // prefer left side of Copy page control; if no room (narrow viewports), drop below.
    if (!isMobile && hasRoomOnLeft) {
      return {
        position: 'fixed',
        top: `${Math.max(safeTop, anchorRect.top + anchorRect.height / 2)}px`,
        left: `${Math.max(8, preferredLeft)}px`,
        transform: 'translate(-100%, -50%)',
        zIndex: 30,
        pointerEvents: 'auto',
      }
    }

    return {
      position: 'fixed',
      top: `${Math.max(safeTop, anchorRect.bottom + 14)}px`,
      left: `${Math.max(8, anchorRect.left)}px`,
      zIndex: 30,
      pointerEvents: 'auto',
    }
  }, [anchorRect, headerBottom, viewportWidth])

  useEffect(() => {
    const isVisible = (el: Element | null) => {
      if (!(el instanceof HTMLElement)) return false
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return false
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
    }

    const findCopyPageContainer = () => {
      const article = document.querySelector('[data-book-section] article')
      if (!article) return null

      // Nextra CopyPage renders a `div.nextra-border` with a float-end class.
      // We avoid `:has(...)` selectors (spotty support across browsers) and instead
      // locate the right container by class + text content.
      const candidates = Array.from(
        article.querySelectorAll('div.nextra-border')
      ) as HTMLElement[]

      return (
        candidates.find((el) => el.className.includes('float-end')) ??
        candidates.find((el) => {
          const text = (el.textContent || '').toLowerCase()
          return text.includes('copy page') || text.includes('copied')
        }) ??
        null
      )
    }

    const isMobileMenuOpen = () => {
      const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[]
      const navButtons = buttons.filter((btn) => {
        const label = (btn.getAttribute('aria-label') || '').toLowerCase()
        return label.includes('navigation menu')
      })

      // Primary signal: visible "close navigation menu" button
      if (
        navButtons.some((btn) => {
          const label = (btn.getAttribute('aria-label') || '').toLowerCase()
          return label.includes('close navigation menu') && isVisible(btn)
        })
      ) {
        return true
      }

      // Secondary signal: visible expanded nav toggle
      if (
        navButtons.some(
          (btn) => btn.getAttribute('aria-expanded') === 'true' && isVisible(btn)
        )
      ) {
        return true
      }

      return false
    }

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const mobileMenuOpen = isMobileMenuOpen()
        setMenuOpen(mobileMenuOpen)
        if (mobileMenuOpen) {
          setAnchorRect(null)
          return
        }

        const copyPageContainer = findCopyPageContainer()
        if (!copyPageContainer) {
          setAnchorRect(null)
          return
        }
        const header = document.querySelector('[data-book-section] header')
        if (header instanceof HTMLElement) {
          setHeaderBottom(header.getBoundingClientRect().bottom)
        } else {
          setHeaderBottom(0)
        }
        setViewportWidth(window.innerWidth)
        setAnchorRect(copyPageContainer.getBoundingClientRect())
      })
    }

    update()
    const t = setTimeout(update, 150)
    const t2 = setTimeout(update, 400)

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    document.addEventListener('click', update, true)
    document.addEventListener('touchstart', update, true)
    document.addEventListener('keydown', update, true)

    // Observe whole body so menu open/close mutations outside article are captured.
    const observer = new MutationObserver(update)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-expanded', 'aria-label', 'class', 'style'],
    })

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      clearTimeout(t2)
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      document.removeEventListener('click', update, true)
      document.removeEventListener('touchstart', update, true)
      document.removeEventListener('keydown', update, true)
      observer.disconnect()
    }
  }, [pathname])

  if (!style || menuOpen) return null

  return createPortal(
    <div
      className="book-copy-link-floating inline-flex items-center"
      style={style}
    >
      <CopyLinkButton />
    </div>,
    document.body
  )
}
