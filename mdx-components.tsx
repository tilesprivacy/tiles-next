import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { ComponentProps } from 'react'

const docsComponents = getDocsMDXComponents()

// Custom anchor component that adds external link indicator for non-tiles.run links
function CustomAnchor(props: ComponentProps<'a'>) {
  const { href, children, ...rest } = props
  
  // Check if link is external and not a tiles.run domain
  const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
  const isTilesRunDomain = href?.includes('tiles.run') || href?.includes('book.tiles.run')
  const showExternalIndicator = isExternal && !isTilesRunDomain && !href?.startsWith('mailto:')
  
  return (
    <a
      href={href}
      {...(showExternalIndicator && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      {...rest}
      className={`${rest.className || ''} ${showExternalIndicator ? 'external-link' : ''}`.trim()}
    >
      {children}
    </a>
  )
}

export const useMDXComponents = (
  components: Record<string, unknown> = {},
) => ({
  ...docsComponents,
  a: CustomAnchor,
  ...components,
})

