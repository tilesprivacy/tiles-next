// Confirmation links carry the address encrypted with AES-GCM: nothing has to
// be stored before someone confirms, the URL doesn't reveal the address, and
// a link can't be forged or edited without failing to decrypt.

export const CONFIRM_LINK_TTL_DAYS = 7
const TTL_MS = CONFIRM_LINK_TTL_DAYS * 24 * 60 * 60 * 1_000
const MAX_TOKEN_LENGTH = 1_024

const keys = new Map<string, Promise<CryptoKey>>()

/** The secret is 32 random bytes, base64-encoded (`openssl rand -base64 32`). */
function importKey(secret: string): Promise<CryptoKey> {
  let key = keys.get(secret)
  if (!key) {
    const bytes = Uint8Array.from(atob(secret), (c) => c.charCodeAt(0))
    if (bytes.length !== 32) throw new Error("NEWSLETTER_TOKEN_KEY must be 32 bytes, base64-encoded")
    key = crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"])
    keys.set(secret, key)
  }
  return key
}

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

const fromBase64Url = (value: string) =>
  Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))

export async function createConfirmToken(email: string, secret: string, now = Date.now()): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const payload = new TextEncoder().encode(JSON.stringify({ e: email, x: now + TTL_MS }))
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await importKey(secret), payload))
  const token = new Uint8Array(iv.length + sealed.length)
  token.set(iv)
  token.set(sealed, iv.length)
  return toBase64Url(token)
}

/** The address in a valid, unexpired token, or null for anything else. */
export async function readConfirmToken(token: string, secret: string, now = Date.now()): Promise<string | null> {
  if (!token || token.length > MAX_TOKEN_LENGTH || !/^[A-Za-z0-9_-]+$/.test(token)) return null
  try {
    const bytes = fromBase64Url(token)
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.slice(0, 12) },
      await importKey(secret),
      bytes.slice(12),
    )
    const { e, x } = JSON.parse(new TextDecoder().decode(plain)) as { e?: unknown; x?: unknown }
    return typeof e === "string" && typeof x === "number" && x > now ? e : null
  } catch {
    return null
  }
}
