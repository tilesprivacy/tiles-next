'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const EXTRA_GAP_PX = 12

function getHeaderOffset() {
  const header = document.querySelector<HTMLElement>('.site-header-chrome')
  if (!header) return 0
  const { bottom } = header.getBoundingClientRect()
  return Math.max(0, bottom + EXTRA_GAP_PX)
}

function scrollHashTargetIntoView() {
  const hash = window.location.hash
  if (!hash) return

  const id = decodeURIComponent(hash.slice(1))
  if (!id) return

  const target =
    document.getElementById(id) ??
    document.querySelector<HTMLElement>(`[name="${CSS.escape(id)}"]`)

  if (!target) return

  const targetTop = target.getBoundingClientRect().top + window.scrollY
  const offsetTop = getHeaderOffset()
  const nextTop = Math.max(0, targetTop - offsetTop)

  window.scrollTo({ top: nextTop, behavior: 'instant' })
}

export function BookHashScrollOffset() {
  const pathname = usePathname()
  const lastAppliedHashRef = useRef<string | null>(null)

  useEffect(() => {
    const scheduleHashOffset = (force = false) => {
      const currentHash = window.location.hash
      if (!currentHash) {
        lastAppliedHashRef.current = null
        return
      }

      if (!force && lastAppliedHashRef.current === currentHash) return
      lastAppliedHashRef.current = currentHash

      // Run after browser/native hash scroll settles.
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollHashTargetIntoView)
      })
    }

    scheduleHashOffset(true)

    const onHashChange = () => {
      // Hash changed explicitly; allow one fresh correction.
      lastAppliedHashRef.current = null
      scheduleHashOffset(true)
    }

    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [pathname])

  return null
}

