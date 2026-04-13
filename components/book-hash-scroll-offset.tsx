'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    const applyHashOffset = () => {
      // Run after browser/native hash scroll settles.
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollHashTargetIntoView)
      })
    }

    applyHashOffset()
    window.addEventListener('hashchange', applyHashOffset)
    window.addEventListener('resize', applyHashOffset)

    return () => {
      window.removeEventListener('hashchange', applyHashOffset)
      window.removeEventListener('resize', applyHashOffset)
    }
  }, [])

  return null
}

