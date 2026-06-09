'use client'

import { FaPrint } from 'react-icons/fa6'
import { triggerHaptic } from '@/lib/haptics'

const printIconClass =
  'h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5'
const printLabelClass =
  'text-[11px] text-black/50 transition-colors hover:text-black/70 dark:text-white/50 dark:hover:text-white/70 lg:text-xs'

interface ArticlePrintButtonProps {
  className?: string
}

export function ArticlePrintButton({ className = '' }: ArticlePrintButtonProps) {
  const handlePrint = () => {
    triggerHaptic()
    window.print()
  }

  return (
    <div className={`article-print-control inline-flex items-center gap-2 print:hidden ${className}`}>
      <button
        type="button"
        onClick={handlePrint}
        aria-label="Print article"
        className="inline-flex items-center justify-center"
      >
        <FaPrint className={printIconClass} aria-hidden />
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className={`${printLabelClass} leading-none`}
      >
        Print
      </button>
    </div>
  )
}
