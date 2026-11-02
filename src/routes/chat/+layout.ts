// Shared chats are fetched per request, and a prerendered file would skip the
// host redirect and noindex header in hooks.server.ts.
export const prerender = false
