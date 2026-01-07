'use client'

import { useEffect } from 'react'

export function MobileSidebarFix() {
  useEffect(() => {
    // Inject a style tag with maximum priority
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

    // Function to force white background on mobile sidebar
    const fixSidebar = () => {
      // Find all possible sidebar elements
      const sidebars = document.querySelectorAll('aside, [class*="sidebar"], [class*="Sidebar"], [class*="nextra-sidebar"]')
      
      sidebars.forEach((sidebar) => {
        const element = sidebar as HTMLElement
        // Only fix on mobile
        if (window.innerWidth <= 768) {
          // Force white background
          element.style.setProperty('background-color', 'rgb(255, 255, 255)', 'important')
          element.style.setProperty('background', 'rgb(255, 255, 255)', 'important')
          element.style.setProperty('background-image', 'none', 'important')
          element.style.setProperty('opacity', '1', 'important')
          element.style.setProperty('backdrop-filter', 'none', 'important')
          element.style.setProperty('-webkit-backdrop-filter', 'none', 'important')
          
          // Force black text on all children
          const allChildren = element.querySelectorAll('*')
          allChildren.forEach((child) => {
            const childEl = child as HTMLElement
            childEl.style.setProperty('color', 'rgb(15, 23, 42)', 'important')
          })
        }
      })
    }

    // Run immediately
    fixSidebar()

    // Run after delays to catch dynamically added elements
    const timeout1 = setTimeout(fixSidebar, 100)
    const timeout2 = setTimeout(fixSidebar, 500)
    const timeout3 = setTimeout(fixSidebar, 1000)

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      fixSidebar()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    // Also listen for resize to handle mobile/desktop switching
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        fixSidebar()
      }
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return null
}

