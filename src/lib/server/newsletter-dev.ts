// Local dev without NEWSLETTER_TOKEN_KEY: a random key for this process, so
// confirmation links work until the dev server restarts. Production never
// uses this; it refuses to send without the real key.
let key: string | undefined

export function devTokenKey(): string {
  key ??= btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  return key
}
