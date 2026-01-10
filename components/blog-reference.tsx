'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface BlogReferenceProps {
  id: number
  children: React.ReactNode
}

export function BlogReference({ id, children }: BlogReferenceProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const supRef = useRef<HTMLSpanElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const updatePosition = () => {
      if (!supRef.current) return

      const referenceContainer = document.querySelector('.blog-reference-container')
      if (!referenceContainer) return

      // Get viewport positions
      const supRect = supRef.current.getBoundingClientRect()
      const containerRect = referenceContainer.getBoundingClientRect()

      // Calculate position relative to the container
      // Since container is at top-0 of article, this gives us the correct offset
      const relativeTop = supRect.top - containerRect.top

      setTopPosition(relativeTop)
    }

    // Initial updates with multiple delays to handle all loading stages
    const timeouts = [
      setTimeout(updatePosition, 50),
      setTimeout(updatePosition, 200),
      setTimeout(updatePosition, 500),
      setTimeout(updatePosition, 1000)
    ]

    // Update on window events
    window.addEventListener('resize', updatePosition)

    // Also update on scroll to keep references aligned during scrolling
    window.addEventListener('scroll', updatePosition, { passive: true })

    // Update when fonts load
    if (document.fonts) {
      document.fonts.ready.then(updatePosition)
    }

    return () => {
      timeouts.forEach(clearTimeout)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Superscript - clickable on mobile, static on desktop */}
      <sup
        ref={supRef}
        className="text-black/40 hover:text-black/50 lg:hover:text-black/40 cursor-pointer lg:cursor-default font-normal text-[0.7em] ml-[0.15em] transition-colors duration-150"
        onClick={toggleExpanded}
        data-ref-id={id}
      >
        {id}
      </sup>

      {/* Mobile: Expandable reference below text */}
      {isExpanded && (
        <span className="block mt-4 mb-4 text-sm text-black/50 leading-relaxed lg:hidden">
          <span className="text-black/50 mr-1.5">{id}</span>
          {children}
        </span>
      )}

      {/* Desktop: Side pane reference - only render after mount to avoid SSR issues */}
      {isMounted && typeof window !== 'undefined' && (
        <>
          {createPortal(
            <div
              className="hidden lg:block absolute left-full pointer-events-auto text-black/45 leading-relaxed ml-12 xl:ml-16 2xl:ml-20 w-64 lg:w-72 xl:w-80 2xl:w-96 text-xs lg:text-sm xl:text-base"
              style={{
                top: `${topPosition}px`
              }}
              data-ref-id={id}
            >
              <div className="pr-6 xl:pr-8">
                <span className="text-black/50 mr-1.5">{id}</span>
                {children}
              </div>
            </div>,
            document.querySelector('.blog-reference-container') || document.body
          )}
        </>
      )}
    </>
  )
}
