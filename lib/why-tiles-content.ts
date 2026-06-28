import { SHOW_REMOTE_LINK } from "@/lib/feature-flags"

export const WHY_TILES_TAGLINE =
  "Sensitive knowledge work stays private on your machines, with secure collaboration built in."

const REMOTE_LINK_BULLET =
  "Use local assistant from a mobile device or other machine over a secure remote link." as const

export const whyTilesBullets = [
  "Out-of-the-box experience, ready on first open without API keys, model or harness selection.",
  ...(SHOW_REMOTE_LINK ? [REMOTE_LINK_BULLET] : []),
  "Sync sessions and work across devices without leaking data to a cloud vendor.",
  "Share chats publicly or privately without copy-pasting the thread elsewhere.",
  "Sovereignty over your online identity and data: DID and UCAN for local control, ATProto for social features.",
  "Offline Installer bundles the model for air-gapped use.",
] as const
