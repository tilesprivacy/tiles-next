'use client'

import { useEffect } from 'react'

export function MobileSidebarFix() {
  useEffect(() => {
    // Inject a style tag with maximum priority - CSS handles most of the work
    const styleId = 'mobile-sidebar-fix-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @media (max-width: 768px) {
          aside,
          aside[class],
          aside[class*="sidebar"],
          aside[class*="Sidebar"],
          aside[class*="nextra"],
          [class*="nextra-sidebar"],
          [class*="nextra-Sidebar"] {
            background-color: rgb(255, 255, 255) !important;
            background: rgb(255, 255, 255) !important;
            background-image: none !important;
            opacity: 1 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          
          aside *,
          aside a,
          aside span,
          aside div,
          aside p,
          aside li,
          aside button,
          [class*="nextra-sidebar"] * {
            color: rgb(15, 23, 42) !important;
          }
        }
      `
      document.head.appendChild(style)
    }

    // CSS handles most of the styling, so we only need minimal JS
    // Just mark elements to avoid any potential conflicts
    const markSidebars = () => {
      if (window.innerWidth > 768) return

      const sidebars = document.querySelectorAll('aside:not([data-mobile-fixed]), [class*="sidebar"]:not([data-mobile-fixed]), [class*="Sidebar"]:not([data-mobile-fixed]), [class*="nextra-sidebar"]:not([data-mobile-fixed])')
      
      sidebars.forEach((sidebar) => {
        sidebar.setAttribute('data-mobile-fixed', 'true')
      })
    }

    // Run a few times to catch dynamically added elements
    markSidebars()
    const timeout1 = setTimeout(markSidebars, 100)
    const timeout2 = setTimeout(markSidebars, 500)
    const timeout3 = setTimeout(markSidebars, 1000)

    // Minimal observer - only watch for new sidebar elements
    let observer: MutationObserver | null = null
    let debounceTimer: NodeJS.Timeout | null = null

    observer = new MutationObserver(() => {
      // Debounce to avoid excessive calls
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(markSidebars, 300)
    })

    // Only observe direct children of body
    observer.observe(document.body, {
      childList: true,
      subtree: false,
      attributes: false,
    })

    // Cleanup
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  return null
}

