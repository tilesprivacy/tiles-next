/**
 * Primary Download / Sponsor pill colours when the header runs in `themeAware` mode.
 * Keep homepage and download CTAs on this palette so they match the top bar exactly.
 */
export const themeAwareHeaderPrimaryCtaClasses =
  "!bg-foreground !text-background hover:!opacity-90 ring-1 ring-black/5 dark:ring-white/10" as const

export const downloadButtonMotionClasses =
  "transform-gpu transition-[transform,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)] focus-visible:-translate-y-[1px] focus-visible:shadow-[0_10px_24px_rgba(0,0,0,0.14)] active:translate-y-0 active:shadow-[0_6px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.34)] dark:focus-visible:shadow-[0_12px_28px_rgba(0,0,0,0.34)] dark:active:shadow-[0_8px_18px_rgba(0,0,0,0.28)]" as const

export const downloadButtonLabelMotionClasses =
  "transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform backface-hidden group-hover:translate-x-[1px] group-focus-visible:translate-x-[1px] motion-reduce:transform-none motion-reduce:transition-none" as const

export const downloadButtonIconMotionClasses =
  "shrink-0 transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform backface-hidden group-hover:translate-x-[1px] group-focus-visible:translate-x-[1px] motion-reduce:transform-none motion-reduce:transition-none" as const
