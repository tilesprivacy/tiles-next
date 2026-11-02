// Dev-only test pages for the viewer (404 in production builds):
//   /chat/dev/xss      a public chat full of hostile markdown, which must render inert
//   /chat/dev/private  a real public chat, encrypted, opened with the key below
import { error } from "@sveltejs/kit"
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js"
import katex from "katex"
import { dev } from "$app/env"
import { renderSession } from "#lib/chat/render"
import { normalizeSession } from "#lib/chat/session"
import { loadShare, sharePageData, type LoadedShare } from "#lib/server/chat/share"

// Test values, not secrets: open /chat/dev/private#AAECAwQFBgcICQoLDA0ODxAREhMUFRYX.ICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj8=
const NONCE = Uint8Array.from({ length: 24 }, (_, i) => i)
const KEY = Uint8Array.from({ length: 32 }, (_, i) => 32 + i)
const SAMPLE = "YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuY2hhdC5zZXNzaW9uU25hcHNob3QvM21xamdheHR6c3kyZA=="
const SAMPLE_PDS = "https://shimeji.us-east.host.bsky.network/xrpc/com.atproto.repo.getRecord?repo=did:plc:mbk6wgmxiatotzy5b3q57naw&collection=run.tiles.chat.sessionSnapshot&rkey=3mqjgaxtzsy2d"

const HOSTILE = [
  "<script>alert(1)</script><img src=x onerror=alert(1)> <svg onload=alert(1)></svg>",
  "",
  '[javascript link](javascript:alert(1)) [data link](data:text/html,<b>x</b>) <a href="javascript:alert(1)">raw link</a> <a href="https://example.com" onclick="alert(1)" style="color:red">styled</a>',
  "",
  '<iframe src="https://example.com"></iframe><form action="https://example.com"><input name="q"><button>go</button></form><style>body{display:none}</style>',
  "",
  "![tracker](https://example.com/pixel.png) $\\href{javascript:alert(1)}{math link}$",
].join("\n")

function sessionFor(text: string) {
  return { name: "Fixture", sessionId: "fixture", createdAt: "2026-11-01T00:00:00Z", turns: [{ model: "fixture/model", messages: [
    { role: "user", content: [{ type: "text", text }] },
    { role: "assistant", content: [{ type: "thinking", thinking: text }, { type: "toolCall", name: "bash", arguments: JSON.stringify({ command: text }) }] },
    { role: "toolResult", toolName: "bash", content: [{ type: "text", text }] },
    { role: "assistant", content: [{ type: "text", text }] },
  ] }] }
}

export async function load({ params, url, fetch }) {
  if (!dev) error(404, "Not found")

  const base = await loadShare(SAMPLE)
  let share: LoadedShare
  if (params.fixture === "xss") {
    share = { ...base, kind: "public", session: renderSession(normalizeSession(sessionFor(HOSTILE)), { remoteImages: true, katex }) }
  } else if (params.fixture === "private") {
    const record = (await (await fetch(SAMPLE_PDS)).json()) as { value: unknown }
    const sealed = xchacha20poly1305(KEY, NONCE).encrypt(new TextEncoder().encode(JSON.stringify(record.value)))
    share = { uri: base.uri, collection: base.collection, sharedBy: base.sharedBy, kind: "private", ciphertext: btoa(String.fromCharCode(...sealed)) }
  } else {
    error(404, "No such fixture")
  }
  return sharePageData(share, url, SAMPLE)
}
