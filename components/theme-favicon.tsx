'use client'

import { useEffect } from 'react'

const BUST = 'v=20260411'

function upsertIconLink(
  marker: string,
  attrs: { rel: string; type?: string; sizes?: string; href: string },
) {
  let el = document.querySelector<HTMLLinkElement>(`link[data-tiles-theme-icon="${marker}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('data-tiles-theme-icon', marker)
    document.head.prepend(el)
  }
  el.rel = attrs.rel
  if (attrs.type) el.type = attrs.type
  if (attrs.sizes) el.setAttribute('sizes', attrs.sizes)
  el.href = attrs.href
}

/**
 * Tab chrome follows the OS (`prefers-color-scheme`), not the in-app theme toggle.
 * Light system UI → dark glyph assets; dark system UI → light glyph assets.
 * Prepends managed links so they take precedence over static metadata icons.
 */
export function ThemeFavicon() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const osDark = mq.matches
      const svg = osDark ? `/icon-mark-dark.svg?${BUST}` : `/icon-mark-light.svg?${BUST}`
      const png96 = osDark ? `/icon-light-96x96.png?${BUST}` : `/icon-dark-96x96.png?${BUST}`
      const png32 = osDark ? `/icon-light-32x32.png?${BUST}` : `/icon-dark-32x32.png?${BUST}`

      // Prepend order (last created ends up first): 32 → 96 → svg gives head order svg, 96, 32.
      upsertIconLink('32', { rel: 'icon', type: 'image/png', sizes: '32x32', href: png32 })
      upsertIconLink('96', { rel: 'icon', type: 'image/png', sizes: '96x96', href: png96 })
      upsertIconLink('svg', { rel: 'icon', type: 'image/svg+xml', href: svg })
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return null
}
