export type HapticVariant = "light" | "medium" | "heavy"

const vibrationPatternByVariant: Record<HapticVariant, number | number[]> = {
  light: 8,
  medium: [12, 8, 12],
  heavy: [18, 10, 18],
}

export function triggerHapticFeedback(variant: HapticVariant = "medium") {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return
  }

  const vibrationPattern = vibrationPatternByVariant[variant]

  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(vibrationPattern)
  }
}
