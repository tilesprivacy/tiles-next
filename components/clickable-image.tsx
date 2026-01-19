'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { Maximize2 } from 'lucide-react'
import { ImageLightbox } from './image-lightbox'

interface ClickableImageProps extends ComponentProps<typeof Image> {
  // Allow all Image props
}

export function ClickableImage({ src, alt, onClick, style, className, ...props }: ClickableImageProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e)
    }
    
    // Open lightbox
    if (src && typeof src === 'string') {
      setLightboxSrc(src)
    } else if (src && typeof src === 'object' && 'src' in src) {
      setLightboxSrc(src.src as string)
    }
  }

  const handleCloseLightbox = () => {
    setLightboxSrc(null)
  }

  // Extract borderRadius from style to match the image
  const borderRadius = style?.borderRadius || '8px'

  return (
    <>
      <div
        className="relative inline-block group"
        style={{ display: 'inline-block' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={src}
          alt={alt || ''}
          style={{
            ...style,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          className={className}
          onClick={handleImageClick}
          {...props}
        />
        {/* Overlay hint */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/30 transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            borderRadius: borderRadius,
          }}
        >
          <div className="flex items-center gap-2 bg-white/90 dark:bg-black/90 px-3 py-2 rounded-full shadow-lg">
            <Maximize2 className="h-4 w-4 text-black dark:text-white" strokeWidth={2} />
            <span className="text-xs font-medium text-black dark:text-white">Click to expand</span>
          </div>
        </div>
      </div>
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt={alt || ''}
          onClose={handleCloseLightbox}
        />
      )}
    </>
  )
}
