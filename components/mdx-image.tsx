'use client'

import { useState } from 'react'
import type { ComponentProps } from 'react'
import NextImage from 'next/image'
import { ImageLightbox } from './image-lightbox'

export function MDXImage(props: ComponentProps<'img'>) {
  const { src, alt, style, ...rest } = props
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  if (!src) return null

  // Extract width/height from style if provided, otherwise use defaults
  const maxWidth = style?.maxWidth
    ? typeof style.maxWidth === 'string'
      ? parseInt(style.maxWidth) || 800
      : style.maxWidth
    : 800

  const handleImageClick = () => {
    setLightboxSrc(src)
  }

  const handleCloseLightbox = () => {
    setLightboxSrc(null)
  }

  return (
    <>
      <NextImage
        src={src}
        alt={alt || ''}
        width={maxWidth}
        height={Math.round(maxWidth * 0.75)}
        style={{
          width: '100%',
          height: 'auto',
          cursor: 'pointer',
          ...style,
        }}
        onClick={handleImageClick}
        {...rest}
      />
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
