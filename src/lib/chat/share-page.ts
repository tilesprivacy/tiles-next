// What a shared-chat page receives from its server load.
import type { QrMatrix } from "#lib/chat/qr"
import type { RenderedSession } from "#lib/chat/render"

export interface SharedBy {
  did: string
  handle: string | null
  displayName: string | null
  avatarUrl: string | null
}

export interface SharePageData {
  /** chat.tiles.run address of this page; the browser adds the #key of a private link. */
  pageUrl: string
  sourceUri: string
  collection: string
  sharedBy: SharedBy
  meta: { title: string; description: string; image: string }
  share: { kind: "public"; session: RenderedSession; qr: QrMatrix } | { kind: "private"; ciphertext: string }
}

export const sharedByLabel = (sharedBy: SharedBy) => sharedBy.displayName?.trim() || sharedBy.handle?.trim() || sharedBy.did
