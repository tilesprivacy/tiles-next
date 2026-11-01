import { buildLlmsFull, textResponse } from "#lib/server/llms"

export const prerender = true

export const GET = async () => textResponse(await buildLlmsFull())
