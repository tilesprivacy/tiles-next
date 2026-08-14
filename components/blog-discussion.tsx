'use client'

import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import {
  BlueskyAuthor,
  BlueskyThreadViewPost,
  blueskyPostWebUrl,
  blueskyProfileWebUrl,
  blueskyRepostedByApiUrl,
  blueskyThreadApiUrl,
  isThreadViewPost,
  parseBlueskyPostUri,
  sortDiscussionReplies,
} from '@/lib/bluesky-discussion'

interface BlogDiscussionProps {
  /** at:// URI of the Bluesky post whose replies act as comments. */
  blueskyPostUri: string
}

const INITIAL_VISIBLE_COMMENTS = 8
const MAX_NESTING_DEPTH = 3
const MAX_NAMED_REPOSTERS = 3

const discussionLinkClass =
  'text-black underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-black/40 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40'

function formatCommentDate(createdAt?: string): string | null {
  if (!createdAt) return null
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Exported for tests; rendered by BlogDiscussion below. */
export function DiscussionSummary({
  thread,
  reposters,
  postUrl,
}: {
  thread: BlueskyThreadViewPost
  reposters: BlueskyAuthor[]
  postUrl: string
}) {
  const replyCount = thread.post.replyCount ?? 0
  const quoteCount = thread.post.quoteCount ?? 0
  const likeCount = thread.post.likeCount ?? 0
  const repostCount = thread.post.repostCount ?? 0
  const namedReposters = reposters.slice(0, MAX_NAMED_REPOSTERS)
  const otherReposterCount = Math.max(0, repostCount - namedReposters.length)
  // The "has been reposted by @a, @b" clause needs at least one name; without
  // names, reposts fall back to a plain count alongside the other stats.
  const hasRepostedByClause = repostCount > 0 && namedReposters.length > 0

  const statParts: ReactNode[] = []
  if (replyCount > 0) statParts.push(countLabel(replyCount, 'reply', 'replies'))
  if (quoteCount > 0) statParts.push(countLabel(quoteCount, 'quote', 'quotes'))
  if (likeCount > 0) {
    statParts.push(
      <a
        href={`${postUrl}/liked-by`}
        target="_blank"
        rel="noopener noreferrer"
        className={discussionLinkClass}
      >
        {countLabel(likeCount, 'like', 'likes')}
      </a>,
    )
  }
  if (repostCount > 0 && !hasRepostedByClause) {
    statParts.push(countLabel(repostCount, 'repost', 'reposts'))
  }

  const hasAnyStats = statParts.length > 0 || hasRepostedByClause

  return (
    <>
      {hasAnyStats ? (
        <p className="text-xs leading-6 text-black/54 dark:text-white/54 lg:text-sm">
          This post has{' '}
          {statParts.map((part, index) => (
            <Fragment key={index}>
              {index > 0 &&
                (index === statParts.length - 1 && !hasRepostedByClause
                  ? statParts.length > 2
                    ? ', and '
                    : ' and '
                  : ', ')}
              {part}
            </Fragment>
          ))}
          {hasRepostedByClause ? (
            <>
              {statParts.length > 0
                ? statParts.length > 1
                  ? ', and has '
                  : ' and has '
                : ''}
              been reposted by{' '}
              {namedReposters.map((reposter, index) => (
                <Fragment key={reposter.did}>
                  {index > 0 &&
                    (index === namedReposters.length - 1 && otherReposterCount === 0
                      ? namedReposters.length > 2
                        ? ', and '
                        : ' and '
                      : ', ')}
                  <a
                    href={blueskyProfileWebUrl(reposter.did)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={discussionLinkClass}
                  >
                    @{reposter.handle}
                  </a>
                </Fragment>
              ))}
              {otherReposterCount > 0 ? (
                <>
                  , and{' '}
                  <a
                    href={`${postUrl}/reposted-by`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={discussionLinkClass}
                  >
                    {otherReposterCount} other {otherReposterCount === 1 ? 'person' : 'people'}
                  </a>
                </>
              ) : null}
            </>
          ) : null}
          .
        </p>
      ) : null}
      <p className={hasAnyStats ? 'mt-2' : undefined}>
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs leading-6 lg:text-sm ${discussionLinkClass}`}
        >
          Add your thoughts on Bluesky
        </a>
      </p>
    </>
  )
}

function DiscussionComment({
  comment,
  depth,
}: {
  comment: BlueskyThreadViewPost
  depth: number
}) {
  const { post } = comment
  const author = post.author
  const authorName = author.displayName?.trim() || author.handle
  const commentUrl = blueskyPostWebUrl(post.uri)
  const commentDate = formatCommentDate(post.record.createdAt)
  const replies = sortDiscussionReplies(comment.replies)

  return (
    <div>
      <div className="flex items-center gap-2">
        <a
          href={blueskyProfileWebUrl(author.did)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label={`${authorName} on Bluesky`}
        >
          {author.avatar ? (
            // Comment avatars are third-party runtime content from Bluesky's CDN,
            // so a plain img avoids routing them through Next image optimization.
            <img
              src={author.avatar}
              alt=""
              width={28}
              height={28}
              loading="lazy"
              className="h-7 w-7 rounded-full bg-black/5 object-cover dark:bg-white/10"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-[0.65rem] font-medium uppercase text-black/50 dark:bg-white/10 dark:text-white/50">
              {authorName.slice(0, 1)}
            </span>
          )}
        </a>
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <a
            href={blueskyProfileWebUrl(author.did)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 max-w-full truncate text-xs font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80 lg:text-sm"
          >
            {authorName}
          </a>
          <a
            href={blueskyProfileWebUrl(author.did)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 max-w-full truncate text-xs text-black/45 hover:text-black/65 dark:text-white/45 dark:hover:text-white/65 lg:text-sm"
          >
            @{author.handle}
          </a>
        </span>
      </div>

      <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-black/54 dark:text-white/54 lg:text-sm">
        {post.record.text}
      </p>

      {commentDate ? (
        <p className="mt-1.5">
          {commentUrl ? (
            <a
              href={commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/45 underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/35 dark:text-white/45 dark:decoration-white/20 dark:hover:text-white/70 dark:hover:decoration-white/35"
            >
              {commentDate}
            </a>
          ) : (
            <span className="text-xs text-black/45 dark:text-white/45">{commentDate}</span>
          )}
        </p>
      ) : null}

      {replies.length > 0 ? (
        depth < MAX_NESTING_DEPTH ? (
          <div className="ml-1 mt-5 space-y-5 border-l border-black/8 pl-4 dark:border-white/12 sm:pl-5">
            {replies.map((reply) => (
              <DiscussionComment key={reply.post.uri} comment={reply} depth={depth + 1} />
            ))}
          </div>
        ) : commentUrl ? (
          <p className="mt-2">
            <a
              href={commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/45 underline decoration-black/20 underline-offset-2 hover:text-black/70 dark:text-white/45 dark:decoration-white/20 dark:hover:text-white/70 lg:text-sm"
            >
              Continue this thread on Bluesky
            </a>
          </p>
        ) : null
      ) : null}
    </div>
  )
}

export function BlogDiscussion({ blueskyPostUri }: BlogDiscussionProps) {
  const [thread, setThread] = useState<BlueskyThreadViewPost | null>(null)
  const [reposters, setReposters] = useState<BlueskyAuthor[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COMMENTS)

  const postUrl = useMemo(() => blueskyPostWebUrl(blueskyPostUri), [blueskyPostUri])

  useEffect(() => {
    if (!parseBlueskyPostUri(blueskyPostUri)) {
      setStatus('error')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setThread(null)
    setReposters([])
    setVisibleCount(INITIAL_VISIBLE_COMMENTS)

    const fetchJson = (url: string) =>
      fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } }).then(
        (response) => {
          if (!response.ok) throw new Error(`Bluesky request failed: ${response.status}`)
          return response.json()
        },
      )

    // The reposter list only decorates the summary sentence, so its failure
    // must not take down the whole discussion.
    Promise.allSettled([
      fetchJson(blueskyThreadApiUrl(blueskyPostUri)),
      fetchJson(blueskyRepostedByApiUrl(blueskyPostUri, MAX_NAMED_REPOSTERS)),
    ]).then(([threadResult, repostersResult]) => {
      if (controller.signal.aborted) return

      if (
        threadResult.status === 'fulfilled' &&
        isThreadViewPost(threadResult.value?.thread)
      ) {
        setThread(threadResult.value.thread)
        setStatus('ready')
      } else {
        setStatus('error')
        return
      }

      if (repostersResult.status === 'fulfilled') {
        const repostedBy = repostersResult.value?.repostedBy
        if (Array.isArray(repostedBy)) {
          setReposters(
            repostedBy.filter(
              (profile): profile is BlueskyAuthor =>
                Boolean(profile && typeof profile === 'object' && profile.did && profile.handle),
            ),
          )
        }
      }
    })

    return () => controller.abort()
  }, [blueskyPostUri])

  const comments = useMemo(() => sortDiscussionReplies(thread?.replies), [thread])
  const visibleComments = comments.slice(0, visibleCount)

  if (!postUrl) return null

  return (
    <section
      data-blog-discussion
      className="blog-print-screen-only mt-10 w-full border-t border-black/8 pt-5 dark:border-white/10"
      aria-label="Discussion"
    >
      <h2 className="mb-3 text-sm font-semibold text-black dark:text-white lg:text-base">
        Discussion
      </h2>

      {status === 'loading' ? (
        <p className="text-xs leading-6 text-black/42 dark:text-white/42 lg:text-sm">Loading discussion…</p>
      ) : null}

      {status === 'error' ? (
        <p className="text-xs leading-6 text-black/54 dark:text-white/54 lg:text-sm">
          Couldn’t load the discussion right now.{' '}
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={discussionLinkClass}
          >
            View it on Bluesky
          </a>
          .
        </p>
      ) : null}

      {status === 'ready' && thread ? (
        <DiscussionSummary thread={thread} reposters={reposters} postUrl={postUrl} />
      ) : null}

      {status === 'ready' && comments.length > 0 ? (
        <div className="mt-7 space-y-7">
          {visibleComments.map((comment) => (
            <DiscussionComment key={comment.post.uri} comment={comment} depth={0} />
          ))}
        </div>
      ) : null}

      {status === 'ready' && comments.length > visibleCount ? (
        <p className="mt-6">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COMMENTS)}
            className="text-xs text-black/45 underline decoration-black/20 underline-offset-2 hover:text-black/70 dark:text-white/45 dark:decoration-white/20 dark:hover:text-white/70 lg:text-sm"
          >
            Show more comments
          </button>
        </p>
      ) : null}
    </section>
  )
}
