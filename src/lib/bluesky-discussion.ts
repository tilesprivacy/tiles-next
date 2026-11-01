/**
 * Helpers for the blog discussion section. Fetching and rendering are handled
 * by the vendored bsky-conversation web component
 * (lib/vendor/bsky-conversation.js), which takes a bsky.app post URL; blog
 * posts store the announcement post as an at:// URI, converted here.
 */

interface BlueskyPostRef {
  did: string;
  rkey: string;
}

/** Parses an `at://did/app.bsky.feed.post/rkey` URI. */
export function parseBlueskyPostUri(uri: string): BlueskyPostRef | null {
  const match = uri.match(/^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/?#]+)$/);
  if (!match) return null;
  return { did: match[1], rkey: match[2] };
}

/** Web permalink on bsky.app for a post's at:// URI. */
export function blueskyPostWebUrl(uri: string): string | null {
  const ref = parseBlueskyPostUri(uri);
  if (!ref) return null;
  return `https://bsky.app/profile/${ref.did}/post/${ref.rkey}`;
}
