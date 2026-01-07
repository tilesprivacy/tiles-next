'use client'

import { useEffect } from 'react'

export function BookBreadcrumbLink() {
  useEffect(() => {
    // Find the breadcrumb container
    const breadcrumb = document.querySelector('.nextra-breadcrumb')
    if (!breadcrumb) return

    // Find the last span in the breadcrumb (the current page)
    const lastSpan = breadcrumb.querySelector('span:last-child')
    if (!lastSpan) return

    // Find the H1 title on the page
    const h1 = document.querySelector('article h1')
    if (!h1) return

    // Make the breadcrumb span clickable and scroll to H1
    const span = lastSpan as HTMLElement
    
    // Add styling to indicate it's clickable
    span.style.cursor = 'pointer'
    span.style.textDecoration = 'underline'
    span.style.textDecorationStyle = 'dotted'
    span.style.textUnderlineOffset = '0.25em'
    span.setAttribute('role', 'button')
    span.setAttribute('aria-label', `Scroll to page title: ${span.textContent}`)
    span.setAttribute('tabIndex', '0')
    
    const handleClick = () => {
      h1.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Focus the H1 for accessibility
      ;(h1 as HTMLElement).focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    }

    // Add hover effect
    const handleMouseEnter = () => {
      span.style.opacity = '0.8'
    }
    
    const handleMouseLeave = () => {
      span.style.opacity = '1'
    }
    
    span.addEventListener('click', handleClick)
    span.addEventListener('keydown', handleKeyDown)
    span.addEventListener('mouseenter', handleMouseEnter)
    span.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      span.removeEventListener('click', handleClick)
      span.removeEventListener('keydown', handleKeyDown)
      span.removeEventListener('mouseenter', handleMouseEnter)
      span.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return null
}

