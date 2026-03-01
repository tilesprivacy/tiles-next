export function triggerHaptic(pattern: number | number[] = 30) {
  if (typeof window === "undefined") return

  const nav = window.navigator as any
  if (typeof nav.vibrate === "function") {
    nav.vibrate(pattern)
  }
}

