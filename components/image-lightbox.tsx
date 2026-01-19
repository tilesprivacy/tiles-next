'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  src: string | null
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!src) return

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [src, onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking directly on the backdrop (not on image content)
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  if (!src || !mounted) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="image-lightbox-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 dark:bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Full screen image viewer"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
        aria-label="Close image viewer"
      >
        <X 
          className="h-6 w-6 text-white" 
          strokeWidth={2}
        />
      </button>

      {/* Image container */}
      <div 
        className="image-lightbox-content relative max-h-[90vh] max-w-[90vw] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            style={{ height: 'auto', width: 'auto' }}
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
