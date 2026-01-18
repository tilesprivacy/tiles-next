'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function BookDatestampMover() {
  const pathname = usePathname()
  
  useEffect(() => {
    const moveDatestamp = () => {
      // Only run on desktop
      if (window.innerWidth < 1024) return

      // Find the article element
      const article = document.querySelector('[data-book-section] article')
      if (!article) return

      // Find the datestamp div - it contains a time element
      const datestampDiv = article.querySelector(':scope > div:has(time)')
      if (!datestampDiv) return

      // Check if already moved (has a data attribute)
      if (datestampDiv.hasAttribute('data-moved')) return

      // Find the h1 title inside main
      const h1 = article.querySelector('main h1:first-of-type')
      if (!h1) return

      // Move datestamp right after h1
      if (h1.parentNode) {
        h1.parentNode.insertBefore(datestampDiv, h1.nextSibling)
        datestampDiv.setAttribute('data-moved', 'true')
      }

      // Style the datestamp
      const div = datestampDiv as HTMLElement
      div.style.marginTop = '0.5rem'
      div.style.marginBottom = '1.5rem'
      div.style.textAlign = 'left'
      div.style.fontSize = '0.875rem'
      div.style.color = '#8A8A8A'

      // Style the time element inside
      const timeEl = div.querySelector('time') as HTMLElement
      if (timeEl) {
        timeEl.style.textAlign = 'left'
        timeEl.style.whiteSpace = 'nowrap'
      }
    }

    // Try immediately
    moveDatestamp()

    // Also try after a short delay to handle SSR hydration
    const timeoutId = setTimeout(moveDatestamp, 100)
    
    // And observe for DOM changes
    const observer = new MutationObserver(() => {
      moveDatestamp()
    })
    
    const article = document.querySelector('[data-book-section] article')
    if (article) {
      observer.observe(article, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
