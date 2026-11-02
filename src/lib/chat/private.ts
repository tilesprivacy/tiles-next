// Opens a private share in the browser. The record holds XChaCha20-Poly1305
// ciphertext; the nonce and key travel only in the URL fragment
// ("#<nonce>.<key>", base64), which browsers never send to a server.
// Loaded on demand, so public shares never download it.
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js"
import { mayContainMath } from "#lib/chat/markdown"
import { renderSession, type RenderedSession } from "#lib/chat/render"
import { normalizeSession, sessionTexts, type ChatSession } from "#lib/chat/session"

export class PrivateShareError extends Error {
  readonly kind: "wrong-key" | "unreadable"

  constructor(kind: PrivateShareError["kind"]) {
    super(kind)
    this.kind = kind
  }
}

function base64Bytes(value: string): Uint8Array {
  const standard = value.trim().replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "")
  if (!/^[A-Za-z0-9+/]*$/.test(standard)) throw new PrivateShareError("wrong-key")
  const binary = atob(standard.padEnd(standard.length + ((4 - (standard.length % 4)) % 4), "="))
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

export async function openPrivateShare(ciphertext: string, fragment: string): Promise<RenderedSession> {
  let plaintext: Uint8Array
  try {
    const [nonce, key, extra] = decodeURIComponent(fragment).split(".")
    if (!nonce || !key || extra !== undefined) throw new PrivateShareError("wrong-key")
    const nonceBytes = base64Bytes(nonce)
    const keyBytes = base64Bytes(key)
    if (nonceBytes.length !== 24 || keyBytes.length !== 32) throw new PrivateShareError("wrong-key")
    plaintext = xchacha20poly1305(keyBytes, nonceBytes).decrypt(base64Bytes(ciphertext))
  } catch {
    // A wrong or damaged key fails the authentication tag; say so plainly.
    throw new PrivateShareError("wrong-key")
  }

  let session: ChatSession
  try {
    session = normalizeSession(JSON.parse(new TextDecoder().decode(plaintext)))
  } catch {
    throw new PrivateShareError("unreadable")
  }
  // KaTeX is most of the weight, so it only loads for chats with math.
  const katex = sessionTexts(session).some(mayContainMath) ? (await import("katex")).default : null
  // Images stay links here, so opening a private chat contacts no third party.
  return renderSession(session, { remoteImages: false, katex })
}
