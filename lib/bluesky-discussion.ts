/**
 * Helpers for the blog discussion section, which uses replies to a Bluesky
 * announcement post as comments (fetched from the public AppView API).
 */

export const BLUESKY_PUBLIC_API_BASE = "https://public.api.bsky.app";

export interface BlueskyAuthor {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

export interface BlueskyPost {
  uri: string;
  cid: string;
  author: BlueskyAuthor;
  record: {
    text?: string;
    createdAt?: string;
  };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  quoteCount?: number;
}

export interface BlueskyThreadViewPost {
  $type?: string;
  post: BlueskyPost;
  replies?: BlueskyThreadViewPost[];
}

export function isThreadViewPost(value: unknown): value is BlueskyThreadViewPost {
  if (!value || typeof value !== "object") return false;
  const candidate = value as BlueskyThreadViewPost;
  // Blocked/not-found placeholders carry a different $type and no post body.
  if (
    candidate.$type &&
    candidate.$type !== "app.bsky.feed.defs#threadViewPost"
  ) {
    return false;
  }
  return Boolean(candidate.post?.uri && candidate.post?.author?.handle);
}

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

export function blueskyProfileWebUrl(didOrHandle: string): string {
  return `https://bsky.app/profile/${didOrHandle}`;
}

export function blueskyThreadApiUrl(uri: string, depth = 8): string {
  const params = new URLSearchParams({ uri, depth: String(depth) });
  return `${BLUESKY_PUBLIC_API_BASE}/xrpc/app.bsky.feed.getPostThread?${params.toString()}`;
}

export function blueskyRepostedByApiUrl(uri: string, limit = 3): string {
  const params = new URLSearchParams({ uri, limit: String(limit) });
  return `${BLUESKY_PUBLIC_API_BASE}/xrpc/app.bsky.feed.getRepostedBy?${params.toString()}`;
}

/** Replies sorted the way the discussion renders them: most liked first, then oldest first. */
export function sortDiscussionReplies(
  replies: BlueskyThreadViewPost[] | undefined,
): BlueskyThreadViewPost[] {
  if (!replies) return [];
  return replies.filter(isThreadViewPost).sort((a, b) => {
    const likeDelta = (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
    if (likeDelta !== 0) return likeDelta;
    const aDate = a.post.record.createdAt ?? "";
    const bDate = b.post.record.createdAt ?? "";
    return aDate.localeCompare(bDate);
  });
}
