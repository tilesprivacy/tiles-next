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

    const injectLinks = () => {
      // Find the sidebar element
      const sidebars = document.querySelectorAll(
        'aside, [class*="sidebar"], [class*="Sidebar"], [class*="nextra-sidebar"]'
      )

      sidebars.forEach((sidebar) => {
        const element = sidebar as HTMLElement

        // Check if links already exist
        if (element.querySelector('[data-sidebar-bottom-links]')) {
          return
        }

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
        const currentDisplay = window.getComputedStyle(element).display
        if (currentDisplay !== 'flex') {
          element.style.display = 'flex'
          element.style.flexDirection = 'column'
        }

        // Append container to sidebar
        element.appendChild(linksContainer)
      })
    }

    // Run immediately
    injectLinks()

    // Run after delays to catch dynamically added elements
    const timeout1 = setTimeout(injectLinks, 100)
    const timeout2 = setTimeout(injectLinks, 500)
    const timeout3 = setTimeout(injectLinks, 1000)

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      injectLinks()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })

    // Cleanup
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      observer.disconnect()

      // Remove injected links on cleanup
      const linksContainers = document.querySelectorAll('[data-sidebar-bottom-links]')
      linksContainers.forEach((container) => {
        container.remove()
      })
    }
  }, [])

  return null
}

