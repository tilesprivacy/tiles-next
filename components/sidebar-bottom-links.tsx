'use client'

import { useEffect } from 'react'

export function SidebarBottomLinks() {
  useEffect(() => {
    // Inject styles for sidebar bottom links
    const styleId = 'sidebar-bottom-links-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .sidebar-bottom-links-container {
          padding: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .sidebar-bottom-links-container {
            padding: 0.75rem 1rem;
            gap: 0.5rem;
          }
        }
        
        .dark .sidebar-bottom-links-container {
          border-top-color: rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-bottom-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(51, 65, 85);
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .sidebar-bottom-link:hover {
          color: rgb(15, 23, 42);
        }
        
        .dark .sidebar-bottom-link {
          color: rgb(203, 213, 225);
        }
        
        .dark .sidebar-bottom-link:hover {
          color: rgb(241, 245, 249);
        }
      `
      document.head.appendChild(style)
    }

    let observer: MutationObserver | null = null
    let timeoutId: NodeJS.Timeout | null = null

    const injectLinks = () => {
      // Find sidebar elements that don't have links yet
      const allSidebars = document.querySelectorAll(
        'aside, [class*="sidebar"], [class*="Sidebar"], [class*="nextra-sidebar"]'
      )

      // Filter out sidebars that already have links
      const sidebars = Array.from(allSidebars).filter((sidebar) => {
        return !sidebar.querySelector('[data-sidebar-bottom-links]')
      })

      if (sidebars.length === 0) return

      // Temporarily disconnect observer to avoid triggering on our changes
      if (observer) observer.disconnect()

      sidebars.forEach((sidebarElement) => {
        const sidebar = sidebarElement as HTMLElement
        // Create container for bottom links
        const linksContainer = document.createElement('div')
        linksContainer.setAttribute('data-sidebar-bottom-links', 'true')
        linksContainer.className = 'sidebar-bottom-links-container'
        
        // Create Tiles link
        const tilesLink = document.createElement('a')
        tilesLink.href = 'https://tiles.run'
        tilesLink.target = '_blank'
        tilesLink.rel = 'noopener noreferrer'
        tilesLink.textContent = 'Tiles'
        tilesLink.className = 'sidebar-bottom-link'

        // Create Blog link
        const blogLink = document.createElement('a')
        blogLink.href = 'https://www.tiles.run/blog'
        blogLink.target = '_blank'
        blogLink.rel = 'noopener noreferrer'
        blogLink.textContent = 'Blog'
        blogLink.className = 'sidebar-bottom-link'

        // Append links to container
        linksContainer.appendChild(tilesLink)
        linksContainer.appendChild(blogLink)

        // Make sidebar a flex container if it isn't already
        const currentDisplay = window.getComputedStyle(sidebar).display
        if (currentDisplay !== 'flex') {
          sidebar.style.display = 'flex'
          sidebar.style.flexDirection = 'column'
        }

        // Append container to sidebar
        sidebar.appendChild(linksContainer)
      })

      // Reconnect observer after a delay
      timeoutId = setTimeout(() => {
        if (observer) {
          observer.observe(document.body, {
            childList: true,
            subtree: false, // Only watch direct children, not entire subtree
            attributes: false,
          })
        }
      }, 200)
    }

    // Initial injection
    injectLinks()

    // Delayed injections for dynamically added elements
    const timeout1 = setTimeout(injectLinks, 100)
    const timeout2 = setTimeout(injectLinks, 500)
    const timeout3 = setTimeout(injectLinks, 1000)

    // Watch only for new elements being added to body
    observer = new MutationObserver((mutations) => {
      // Only react to actual new nodes being added
      const hasNewNodes = mutations.some((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added node is or contains a sidebar
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i]
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element
              if (el.matches?.('aside, [class*="sidebar"], [class*="Sidebar"], [class*="nextra-sidebar"]') ||
                  el.querySelector?.('aside, [class*="sidebar"], [class*="Sidebar"], [class*="nextra-sidebar"]')) {
                return true
              }
            }
          }
        }
        return false
      })
      
      if (hasNewNodes) {
        // Debounce the injection
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(injectLinks, 300)
      }
    })

    // Only observe direct children of body, not entire subtree
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
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (observer) {
        observer.disconnect()
      }

      // Remove injected links on cleanup
      const linksContainers = document.querySelectorAll('[data-sidebar-bottom-links]')
      linksContainers.forEach((container) => {
        container.remove()
      })
    }
  }, [])

  return null
}

