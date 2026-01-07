'use client'

import { useState, useEffect } from 'react'

export function BookHamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check sidebar state periodically and on mutations
    const checkSidebarState = () => {
      if (typeof window === 'undefined') return
      
      // Look for Nextra's sidebar with multiple selectors
      const sidebar = document.querySelector(
        'aside[class*="nextra"], [class*="nextra-sidebar"], aside[class*="Sidebar"], aside[class*="sidebar"], nav[class*="sidebar"], nav[class*="nextra"]'
      ) as HTMLElement | null

      if (sidebar) {
        const computedStyle = window.getComputedStyle(sidebar)
        const isVisible = 
          computedStyle.display !== 'none' && 
          computedStyle.visibility !== 'hidden' &&
          !sidebar.hasAttribute('hidden') &&
          sidebar.getAttribute('aria-hidden') !== 'true'
        setIsOpen(isVisible)
      } else {
        // Check for overlay/backdrop which indicates menu is open
        const overlay = document.querySelector('[data-book-overlay], .nextra-sidebar-overlay, [class*="overlay"], [class*="backdrop"], [class*="mask"]') as HTMLElement | null
        if (overlay) {
          const overlayStyle = window.getComputedStyle(overlay)
          setIsOpen(overlayStyle.display !== 'none' && overlayStyle.opacity !== '0')
        } else {
          setIsOpen(false)
        }
      }
    }

    // Initial check with multiple attempts
    const timeout1 = setTimeout(checkSidebarState, 50)
    const timeout2 = setTimeout(checkSidebarState, 200)
    const timeout3 = setTimeout(checkSidebarState, 500)

    // Watch for changes
    const observer = new MutationObserver(() => {
      checkSidebarState()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-expanded', 'aria-hidden', 'hidden', 'data-open', 'data-state'],
    })

    // Also listen for resize events
    window.addEventListener('resize', checkSidebarState)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      observer.disconnect()
      window.removeEventListener('resize', checkSidebarState)
    }
  }, [])

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      const overlay = document.querySelector('[data-book-overlay]') as HTMLElement | null
      if (overlay) {
        overlay.remove()
      }
    }
  }, [])

  const handleClick = () => {
    if (typeof window === 'undefined') return

    // First, try to find and click Nextra's built-in menu button (even if hidden)
    // This is the most reliable way if Nextra's button exists
    const nextraMenuButton = document.querySelector(
      'button[aria-label*="menu" i], button[aria-label*="Menu" i], button[aria-expanded], [class*="menu-button"], button[class*="menu"]'
    ) as HTMLButtonElement | null

    if (nextraMenuButton) {
      // Try clicking it even if it's visually hidden
      // Temporarily enable pointer events and click
      const originalPointerEvents = nextraMenuButton.style.pointerEvents
      const originalOpacity = nextraMenuButton.style.opacity
      nextraMenuButton.style.pointerEvents = 'auto'
      nextraMenuButton.style.opacity = '0'
      nextraMenuButton.style.position = 'absolute'
      nextraMenuButton.style.width = '1px'
      nextraMenuButton.style.height = '1px'
      
      try {
      nextraMenuButton.click()
        // Reset styles after a brief delay
        setTimeout(() => {
          nextraMenuButton.style.pointerEvents = originalPointerEvents
          nextraMenuButton.style.opacity = originalOpacity
          nextraMenuButton.style.position = ''
          nextraMenuButton.style.width = ''
          nextraMenuButton.style.height = ''
        }, 50)
      return
      } catch (e) {
        // If click fails, continue to manual toggle
      }
    }

    // Manual toggle: find sidebar and toggle it
    const sidebar = document.querySelector(
      'aside[class*="nextra"], [class*="nextra-sidebar"], aside[class*="Sidebar"], aside[class*="sidebar"], nav[class*="sidebar"], nav[class*="nextra"], aside'
    ) as HTMLElement | null

    if (sidebar) {
      const computedStyle = window.getComputedStyle(sidebar)
      const hasHiddenAttr = sidebar.hasAttribute('hidden') || sidebar.getAttribute('aria-hidden') === 'true'
      const isVisible = 
        computedStyle.display !== 'none' && 
        computedStyle.visibility !== 'hidden' &&
        !hasHiddenAttr &&
        computedStyle.opacity !== '0'

      if (isVisible) {
        // Close sidebar
        sidebar.setAttribute('aria-hidden', 'true')
        sidebar.setAttribute('hidden', '')
        sidebar.style.display = 'none'
        sidebar.style.visibility = 'hidden'
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        
        // Remove overlay/backdrop
        const overlays = document.querySelectorAll('.nextra-sidebar-overlay, [class*="overlay"], [class*="backdrop"], [class*="mask"]')
        overlays.forEach((overlay) => {
          const el = overlay as HTMLElement
          el.style.display = 'none'
          el.style.opacity = '0'
        })
        
        setIsOpen(false)
      } else {
        // Open sidebar
        sidebar.removeAttribute('aria-hidden')
        sidebar.removeAttribute('hidden')
        sidebar.style.display = 'flex'
        sidebar.style.visibility = 'visible'
        sidebar.style.opacity = '1'
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        
        // Add or show overlay/backdrop
        let overlay = document.querySelector('.nextra-sidebar-overlay') as HTMLElement | null
        if (!overlay) {
          overlay = document.createElement('div')
          overlay.className = 'nextra-sidebar-overlay'
          overlay.setAttribute('data-book-overlay', 'true')
          document.body.appendChild(overlay)
        }
        overlay.style.display = 'block'
        overlay.style.opacity = '1'
        overlay.style.pointerEvents = 'auto'
        
        // Make overlay clickable to close
        overlay.onclick = () => {
          handleClick()
        }
        
        setIsOpen(true)
      }
    } else {
      // Fallback: dispatch custom event
      const event = new CustomEvent('nextra:toggle-menu', { bubbles: true, cancelable: true })
      document.dispatchEvent(event)
    }
  }

  return (
    <button
      onClick={handleClick}
      data-book-hamburger
      className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 p-1.5 rounded-md hover:bg-foreground/5 active:bg-foreground/10 transition-colors touch-manipulation"
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      type="button"
    >
      <span
        className={`block w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}
      />
      <span
        className={`block w-5 h-0.5 bg-foreground transition-all duration-300 origin-center ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  )
}

