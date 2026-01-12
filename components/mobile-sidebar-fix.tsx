'use client'

import { useEffect } from 'react'

export function MobileSidebarFix() {
  useEffect(() => {
    // Inject a style tag for mobile sidebar background fix
    const styleId = 'mobile-sidebar-fix-styles'
    if (document.getElementById(styleId)) return
    
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @media (max-width: 768px) {
        [data-book-section] aside {
          background-color: rgb(255, 255, 255) !important;
          background: rgb(255, 255, 255) !important;
        }
        
        .dark [data-book-section] aside {
          background-color: #121212 !important;
          background: #121212 !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const injectedStyle = document.getElementById(styleId)
      if (injectedStyle) {
        injectedStyle.remove()
      }
    }
  }, [])

  return null
}
