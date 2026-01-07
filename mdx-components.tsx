import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import type { ComponentProps } from 'react'

const docsComponents = getDocsMDXComponents()

// SVG icon for external links
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-2.5 w-2.5 inline-block ml-0.5 align-baseline"
    style={{ verticalAlign: 'baseline' }}
  >
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

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
      className={`${rest.className || ''} ${showExternalIndicator ? 'external-link inline-flex items-center gap-0.5' : ''}`.trim()}
    >
      {children}
      {showExternalIndicator && <ExternalLinkIcon />}
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

