/**
 * Primary Download / Sponsor pill colours when the header runs in `themeAware` mode.
 * Keep homepage and download CTAs on this palette so they match the top bar exactly.
 */
export const themeAwareHeaderPrimaryCtaClasses =
  "!bg-foreground !text-background hover:!opacity-90 ring-1 ring-black/5 dark:ring-white/10" as const

export const downloadButtonMotionClasses =
  "transform-gpu shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[transform,box-shadow,opacity] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] focus-visible:-translate-y-px focus-visible:shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.28)] dark:focus-visible:shadow-[0_4px_12px_rgba(0,0,0,0.28)] dark:active:shadow-[0_1px_2px_rgba(0,0,0,0.22)]" as const

export const downloadButtonLabelMotionClasses =
  "shrink-0" as const

export const downloadButtonIconMotionClasses =
  "shrink-0 transform-gpu transition-transform duration-200 ease-out group-hover:translate-y-px group-focus-visible:translate-y-px motion-reduce:transform-none motion-reduce:transition-none" as const
