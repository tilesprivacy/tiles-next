'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface BlogReferenceProps {
  id: number
  children: React.ReactNode
}

// Global state to track all reference positions for collision detection
interface ReferenceData {
  supElement: HTMLElement | null
  refElement: HTMLElement | null
  baseTop: number
  adjustedTop: number
  height: number
  updateCallback: () => void
}

const referenceData = new Map<number, ReferenceData>()
const MIN_SPACING = 24 // Minimum spacing between references in pixels

// Global function to recalculate all reference positions
function recalculateAllPositions() {
  const referenceContainer = document.querySelector('.blog-reference-container')
  if (!referenceContainer) return

  const containerRect = referenceContainer.getBoundingClientRect()
  const sortedIds = Array.from(referenceData.keys()).sort((a, b) => a - b)

  // First pass: calculate base positions
  for (const id of sortedIds) {
    const data = referenceData.get(id)
    if (!data || !data.supElement) continue

    const supRect = data.supElement.getBoundingClientRect()
    const baseTop = supRect.top - containerRect.top
    data.baseTop = baseTop
  }

  // Second pass: adjust for collisions
  for (let i = 0; i < sortedIds.length; i++) {
    const id = sortedIds[i]
    const data = referenceData.get(id)
    if (!data || !data.refElement) continue

    // Measure actual height
    const height = data.refElement.offsetHeight || data.refElement.scrollHeight || 100
    data.height = height

    // Start with base position
    let adjustedTop = data.baseTop

    // Check collisions with all previous references
    for (let j = 0; j < i; j++) {
      const prevId = sortedIds[j]
      const prevData = referenceData.get(prevId)
      if (!prevData) continue

      const prevBottom = prevData.adjustedTop + prevData.height
      const thisTop = adjustedTop
      const thisBottom = adjustedTop + height

      // If there's overlap or insufficient spacing
      if (thisTop < prevBottom + MIN_SPACING) {
        adjustedTop = prevBottom + MIN_SPACING
      }
    }

    data.adjustedTop = adjustedTop
    data.updateCallback()
  }
}

export function BlogReference({ id, children }: BlogReferenceProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [topPosition, setTopPosition] = useState(0)
  const supRef = useRef<HTMLSpanElement>(null)
  const refElementRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  const updatePosition = useCallback(() => {
    recalculateAllPositions()
  }, [])

  useEffect(() => {
    setIsMounted(true)

    // Register this reference
    referenceData.set(id, {
      supElement: supRef.current,
      refElement: null,
      baseTop: 0,
      adjustedTop: 0,
      height: 0,
      updateCallback: () => {
        const data = referenceData.get(id)
        if (data) {
          setTopPosition(data.adjustedTop)
        }
      }
    })

    // Update ref element when it's available
    const updateRefElement = () => {
      const element = document.querySelector(`[data-ref-sidebar-id="${id}"]`) as HTMLElement
      const data = referenceData.get(id)
      if (data && element) {
        data.refElement = element
        updatePosition()
      }
    }

    // Initial updates with multiple delays to handle all loading stages
    const timeouts = [
      setTimeout(() => {
        const data = referenceData.get(id)
        if (data && supRef.current) {
          data.supElement = supRef.current
        }
        updateRefElement()
        updatePosition()
      }, 50),
      setTimeout(() => {
        updateRefElement()
        updatePosition()
      }, 200),
      setTimeout(() => {
        updateRefElement()
        updatePosition()
      }, 500),
      setTimeout(() => {
        updateRefElement()
        updatePosition()
      }, 1000)
    ]

    // Update on window events
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })

    // Update when fonts load
    if (document.fonts) {
      document.fonts.ready.then(updatePosition)
    }

    return () => {
      timeouts.forEach(clearTimeout)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      // Clean up this reference
      referenceData.delete(id)
      // Recalculate remaining references
      setTimeout(updatePosition, 0)
    }
  }, [id, updatePosition])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Superscript - clickable on mobile, static on desktop */}
      <sup
        ref={supRef}
        className="text-black/40 hover:text-black/50 lg:hover:text-black/40 cursor-pointer lg:cursor-default font-normal text-[0.7em] ml-[0.15em] mr-[0.15em] transition-colors duration-150"
        onClick={toggleExpanded}
      >
        {id}
      </sup>

      {/* Mobile: Expandable reference below text */}
      {isExpanded && (
        <span className="block mt-4 mb-4 text-sm text-black leading-relaxed lg:hidden">
          <sup className="text-black/50 align-super mr-1.5">{id}</sup>
          {children}
        </span>
      )}

      {/* Desktop: Side pane reference - only render after mount to avoid SSR issues */}
      {isMounted && typeof window !== 'undefined' && (
        <>
          {createPortal(
            <div
              ref={(el) => {
                refElementRef.current = el
                const data = referenceData.get(id)
                if (data && el) {
                  data.refElement = el
                  // Trigger recalculation after a brief delay to ensure element is measured
                  setTimeout(() => {
                    recalculateAllPositions()
                  }, 0)
                }
              }}
              className="hidden lg:block absolute left-full pointer-events-auto text-black leading-relaxed ml-12 xl:ml-16 2xl:ml-20 w-64 lg:w-72 xl:w-80 2xl:w-96 text-xs lg:text-sm xl:text-base"
              style={{
                top: `${topPosition}px`
              }}
              data-ref-sidebar-id={id}
            >
              <div className="pr-6 xl:pr-8">
                <sup className="text-black/50 align-super mr-1.5">{id}</sup>
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
