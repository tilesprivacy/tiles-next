export const INDIAFOSS_GIVEAWAY_PATH = "/indiafoss-2026-giveaway"

export const INDIAFOSS_GIVEAWAY_TRACKS = {
  travel: {
    label: "Ticket + $100 travel grant",
    description: "Five selected applicants receive an IndiaFOSS ticket and $100 toward travel or attendance expenses.",
  },
  ticket: {
    label: "Conference ticket",
    description: "Five selected applicants receive an IndiaFOSS ticket.",
  },
} as const

export type IndiaFossGiveawayTrack = keyof typeof INDIAFOSS_GIVEAWAY_TRACKS

export const INDIAFOSS_DEVICE_OPTIONS = [
  "macOS",
  "Windows",
  "Linux (Ubuntu)",
  "Linux (Fedora)",
  "Linux (Arch)",
  "iPhone",
  "iPad",
  "Android",
  "Apple Watch",
] as const

export const isIndiaFossGiveawayTrack = (
  value: unknown,
): value is IndiaFossGiveawayTrack =>
  typeof value === "string" && value in INDIAFOSS_GIVEAWAY_TRACKS
