import { AtpAgent } from "@atproto/api"
import sodium from "libsodium-wrappers"
export type SharedSessionMessageRole = "user" | "assistant"

export interface SharedSessionSkillCall {
  name: string
  params: string
}

export interface SharedSessionMessage {
  role: SharedSessionMessageRole
  content: string
  skillCall?: SharedSessionSkillCall
}

export interface SharedSession {
  sessionId: string
  name: string
  isPrivateLink: boolean
  createdAt: string | null
  sourceUri: string
  modelsUsed: string[]
  sharedBy: {
    did: string
    handle: string | null
    displayName: string | null
    avatarUrl: string | null
  }
  messages: SharedSessionMessage[]
}

export function isEncryptedSharedSessionRecord(
  record: Record<string, unknown>,
): boolean {
  return typeof record.enc_content === "string" && record.enc_content.length > 0
}

interface AtUriParts {
  repo: string
  collection: string
  rkey: string
}

const DEFAULT_ATPROTO_SERVICE = "https://public.api.bsky.app"
const PLC_DIRECTORY_URL = "https://plc.directory"
const TILES_SESSION_COLLECTION = "run.tiles.session"
const DEFAULT_TILES_SESSION_REPO =
  process.env.TILES_DEFAULT_SHARE_REPO ?? "did:plc:mbk6wgmxiatotzy5b3q57naw"

export function createSharedSessionPathFromUri(uri: string): string {
  const { repo, collection } = parseAtUri(uri)

  if (
    repo !== DEFAULT_TILES_SESSION_REPO ||
    collection !== TILES_SESSION_COLLECTION
  ) {
    throw new Error(
      "Short share URLs only support the configured Tiles session repo.",
    )
  }

  const base64UrlToken = Buffer.from(uri, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")

  return `/share/${base64UrlToken}`
}

export function resolveSharedSessionUri(shareToken: string): string {
  const token = decodeURIComponent(shareToken)
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/api\/og$/i, "")
  const normalizedToken = token.replace(/-/g, "+").replace(/_/g, "/")
  const paddedToken = normalizedToken.padEnd(
    normalizedToken.length + ((4 - (normalizedToken.length % 4)) % 4),
    "=",
  )
  const decodedUri = Buffer.from(paddedToken, "base64").toString("utf8")

  if (!decodedUri.startsWith("at://")) {
    throw new Error("Shared session token must be a base64 AT URI.")
  }

  const { collection } = parseAtUri(decodedUri)

  if (collection !== TILES_SESSION_COLLECTION) {
    throw new Error("Shared session URI is not a Tiles session record.")
  }

  return decodedUri
}

function parseAtUri(uri: string): AtUriParts {
  const match = uri.match(/^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/)

  if (!match) {
    throw new Error(
      "Shared session URI must look like at://repo/collection/rkey.",
    )
  }

  return {
    repo: match[1],
    collection: match[2],
    rkey: match[3],
  }
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

function normalizeModelsUsed(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((entry) => {
    const model = readString(entry)
    return model ? [model] : []
  })
}

function noStoreFetch(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) {
  return fetch(input, {
    ...init,
    cache: "no-store",
  })
}

function decodeXmlAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

function parseDirectSkillCall(content: string): SharedSessionSkillCall | null {
  const skillTagMatch = content.match(
    /^\s*<skill\b([^>]*)>[\s\S]*?<\/skill>\s*/i,
  )

  if (!skillTagMatch) {
    return null
  }

  const nameMatch = skillTagMatch[1].match(/\sname=(["'])(.*?)\1/i)
  const name = nameMatch?.[2] ? decodeXmlAttribute(nameMatch[2]).trim() : ""

  if (!name) {
    return null
  }

  return {
    name,
    params: content.slice(skillTagMatch[0].length).trim(),
  }
}

function normalizeMessage(
  role: SharedSessionMessageRole,
  content: string,
  shouldParseDirectSkillCall: boolean,
): SharedSessionMessage {
  const directSkillCall = shouldParseDirectSkillCall
    ? parseDirectSkillCall(content)
    : null

  if (!directSkillCall) {
    return { role, content }
  }

  return {
    role,
    content: directSkillCall.params,
    skillCall: directSkillCall,
  }
}

function normalizeMessages(contents: unknown): SharedSessionMessage[] {
  if (!Array.isArray(contents)) {
    return []
  }

  let hasSeenUserMessage = false

  return contents.flatMap((entry): SharedSessionMessage[] => {
    if (!entry || typeof entry !== "object") {
      return []
    }

    const record = entry as Record<string, unknown>
    const role = record.role
    const content = readString(record.content)

    if ((role === "user" || role === "assistant") && content) {
      const message = normalizeMessage(
        role,
        content,
        role === "user" && !hasSeenUserMessage,
      )

      if (role === "user") {
        hasSeenUserMessage = true
      }

      return [message]
    }

    const userContent = readString(record.user)
    const assistantContent = readString(record.assistant)
    const messages: SharedSessionMessage[] = []

    if (userContent) {
      messages.push(normalizeMessage("user", userContent, !hasSeenUserMessage))
      hasSeenUserMessage = true
    }

    if (assistantContent) {
      messages.push(normalizeMessage("assistant", assistantContent, false))
    }

    return messages
  })
}

async function getRecord(uri: string): Promise<Record<string, unknown>> {
  const { repo, collection, rkey } = parseAtUri(uri)
  const service = await resolveAtprotoService(repo)
  const agent = new AtpAgent({
    service,
    fetch: noStoreFetch,
  })

  const response = await agent.com.atproto.repo.getRecord({
    repo,
    collection,
    rkey,
  })
  const body = response.data

  if (!body.value || typeof body.value !== "object") {
    throw new Error("Shared session record did not contain a JSON value.")
  }

  return body.value as Record<string, unknown>
}

async function getActorProfile(repo: string): Promise<{
  did: string
  handle: string | null
  displayName: string | null
  avatarUrl: string | null
}> {
  const agent = new AtpAgent({
    service: DEFAULT_ATPROTO_SERVICE,
    fetch: noStoreFetch,
  })

  try {
    const response = await agent.app.bsky.actor.getProfile({
      actor: repo,
    })
    const profile = response.data

    return {
      did: readString(profile.did) ?? repo,
      handle: readString(profile.handle),
      displayName: readString(profile.displayName),
      avatarUrl: readString(profile.avatar),
    }
  } catch {
    return {
      did: repo,
      handle: null,
      displayName: null,
      avatarUrl: null,
    }
  }
}

async function resolveAtprotoService(repo: string): Promise<string> {
  const configured = process.env.ATPROTO_PUBLIC_SERVICE_URL?.trim()

  if (configured) {
    return configured.replace(/\/$/, "")
  }

  if (!repo.startsWith("did:plc:")) {
    return DEFAULT_ATPROTO_SERVICE
  }

  const response = await noStoreFetch(
    `${PLC_DIRECTORY_URL}/${encodeURIComponent(repo)}`,
    {
      headers: {
        accept: "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `Unable to resolve shared session DID (${response.status}).`,
    )
  }

  const didDocument = (await response.json()) as {
    service?: Array<{
      id?: unknown
      type?: unknown
      serviceEndpoint?: unknown
    }>
  }
  const pds = didDocument.service?.find(
    (service) =>
      service.id === "#atproto_pds" ||
      service.type === "AtprotoPersonalDataServer",
  )
  const endpoint = readString(pds?.serviceEndpoint)

  if (!endpoint) {
    throw new Error("Shared session DID did not advertise an ATProto PDS.")
  }

  return endpoint.replace(/\/$/, "")
}

export async function getAtprotoData(
  sharePath: string,
): Promise<Record<string, any>> {
  const sourceUri = resolveSharedSessionUri(sharePath)
  const { repo } = parseAtUri(sourceUri)
  const record = await getRecord(sourceUri)
  const sharedBy = await getActorProfile(repo)

  return {
    sourceUri,
    repo,
    record,
    sharedBy,
  }
}
export async function getSharedSession(
  sharePath: string,
  fragment: string | null,
): Promise<SharedSession> {
  const at_data = await getAtprotoData(sharePath)
  const record = at_data.record
  const isPrivateLink = isEncryptedSharedSessionRecord(record)
  if (isPrivateLink) {
    console.log("This is an encrypted session")
    if (fragment != null) {
      let fragments = fragment?.split(".")
      let nonce_bytes = sodium.from_base64(
        fragments[0],
        sodium.base64_variants.ORIGINAL,
      )
      let key_bytes = sodium.from_base64(
        fragments[1],
        sodium.base64_variants.ORIGINAL,
      )
      //@ts-ignore
      let ciphertxt = sodium.from_base64(
        record["enc_content"],
        sodium.base64_variants.ORIGINAL,
      )
      const additional_data = null
      const decrypted_data = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null,
        ciphertxt,
        additional_data,
        nonce_bytes,
        key_bytes,
      )
      const text = new TextDecoder().decode(decrypted_data)
      const obj = JSON.parse(text)
      return {
        sessionId: readString(obj.session_id) ?? "shared-session",
        name: readString(obj.name) ?? "Shared session",
        isPrivateLink,
        createdAt: readString(obj.created_at),
        sourceUri: at_data.sourceUri,
        modelsUsed: normalizeModelsUsed(obj.models_used),
        sharedBy: at_data.sharedBy,
        messages: normalizeMessages(obj.contents),
      }
    }
  }

  return {
    sessionId: readString(record.session_id) ?? "shared-session",
    name: readString(record.name) ?? "Shared session",
    isPrivateLink,
    createdAt: readString(record.created_at),
    sourceUri: at_data.sourceUri,
    modelsUsed: normalizeModelsUsed(record.models_used),
    sharedBy: at_data.sharedBy,
    messages: normalizeMessages(record.contents),
  }
}
