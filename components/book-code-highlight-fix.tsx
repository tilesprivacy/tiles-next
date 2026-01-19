'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function BookCodeHighlightFix() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const applyDarkModeHighlighting = () => {
      const bookSection = document.querySelector('[data-book-section]')
      if (!bookSection) return
      
      const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark')
      if (!isDark) {
        // In light mode, remove our dark mode data attribute to allow normal rendering
        bookSection.querySelectorAll('[data-dark-highlight]').forEach((el) => {
          el.removeAttribute('data-dark-highlight')
        })
        return
      }

      // Find all code blocks in book section - use multiple selectors to catch all
      const codeContainers = bookSection.querySelectorAll(
        'pre code, .nextra-code pre code, pre.shiki code, code.nextra-code, [class*="nextra-code"] code'
      )
      
      codeContainers.forEach((codeEl) => {
        // Find all spans with inline styles (Shiki uses inline styles for token colors)
        const allSpans = codeEl.querySelectorAll('span[style], span[class*="token"], span[class*="line"]')
        
        allSpans.forEach((span) => {
          const style = span.getAttribute('style') || ''
          if (!style.includes('color') && span.className.length === 0) return
          
          // Get classes to determine token type
          const classes = Array.from(span.classList)
          const classStr = classes.join(' ').toLowerCase()
          
          let darkColor = '#E6E6E6' // default
          
          // Check inline style for color first to see if it's already set
          const colorMatch = style.match(/color:\s*([^;]+)/i)
          
          // Determine color based on class patterns (Shiki token classes)
          if (classStr.includes('keyword') || classStr.includes('selector-tag') || classStr.includes('doctag') || classStr.includes('type')) {
            darkColor = '#569CD6'
          } else if (classStr.includes('string') || classStr.includes('char')) {
            darkColor = '#CE9178'
          } else if (classStr.includes('comment') || classStr.includes('prolog') || classStr.includes('cdata')) {
            darkColor = '#6A9955'
          } else if (classStr.includes('function') || classStr.includes('class-name')) {
            darkColor = '#DCDCAA'
          } else if (classStr.includes('number') || classStr.includes('constant')) {
            darkColor = '#B5CEA8'
          } else if (classStr.includes('operator') || classStr.includes('punctuation')) {
            darkColor = '#D4D4D4'
          } else if (classStr.includes('property') || classStr.includes('variable') || classStr.includes('attr-name')) {
            darkColor = '#9CDCFE'
          } else if (classStr.includes('tag')) {
            darkColor = '#569CD6'
          } else if (classStr.includes('regex') || classStr.includes('important')) {
            darkColor = '#D16969'
          } else if (classStr.includes('builtin')) {
            darkColor = '#4EC9B0'
          } else if (classStr.includes('boolean') || classStr.includes('null')) {
            darkColor = '#569CD6'
          }
          
          // Remove inline color style and replace with dark mode color
          const newStyle = style
            .replace(/color:\s*[^;]+/gi, '') // Remove existing color
            .replace(/;\s*;/g, ';') // Clean up double semicolons
            .trim()
            .replace(/;$/, '') // Remove trailing semicolon
          
          // Set new style with dark mode color
          const finalStyle = newStyle 
            ? `${newStyle}; color: ${darkColor}`.replace(/^;/, '')
            : `color: ${darkColor}`
          
          span.setAttribute('style', finalStyle)
          span.setAttribute('data-dark-highlight', 'true') // Mark as processed
        })
      })
    }

    // Initial apply with delay to ensure DOM is ready
    const timeoutId = setTimeout(applyDarkModeHighlighting, 200)
    
    // Also run immediately if DOM seems ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      applyDarkModeHighlighting()
    }

    // Watch for DOM changes (dynamic content, theme changes)
    const observer = new MutationObserver(() => {
      // Debounce to avoid excessive calls
      setTimeout(applyDarkModeHighlighting, 100)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'], // Watch for class changes (like dark mode toggle)
    })

    // Also listen for theme changes on html element
    const htmlObserver = new MutationObserver(() => {
      setTimeout(applyDarkModeHighlighting, 100)
    })

    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      htmlObserver.disconnect()
    }
  }, [resolvedTheme])

  return null
}
