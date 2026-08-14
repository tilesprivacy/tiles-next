'use client'

import { useEffect, useMemo, useState } from 'react'
import { FaBluesky, FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa6'
import {
  BlueskyThreadViewPost,
  blueskyPostWebUrl,
  blueskyProfileWebUrl,
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

function formatCommentDate(createdAt?: string): string | null {
  if (!createdAt) return null
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return null
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

function CommentStat({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode
  count: number
  label: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-black/42 dark:text-white/42"
      aria-label={`${count} ${label}`}
    >
      {icon}
      {count > 0 ? <span>{count}</span> : null}
    </span>
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
    <div className={depth > 0 ? 'mt-4 border-l border-black/8 pl-4 dark:border-white/12 sm:pl-5' : ''}>
      <div className="flex items-start gap-3">
        <a
          href={blueskyProfileWebUrl(author.did)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 shrink-0"
          aria-label={`${authorName} on Bluesky`}
        >
          {author.avatar ? (
            // Comment avatars are third-party runtime content from Bluesky's CDN,
            // so a plain img avoids routing them through Next image optimization.
            <img
              src={author.avatar}
              alt=""
              width={32}
              height={32}
              loading="lazy"
              className="h-8 w-8 rounded-full bg-black/5 object-cover dark:bg-white/10"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-xs font-medium uppercase text-black/50 dark:bg-white/10 dark:text-white/50">
              {authorName.slice(0, 1)}
            </span>
          )}
        </a>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <a
              href={blueskyProfileWebUrl(author.did)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 max-w-full truncate text-sm font-medium text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
            >
              {authorName}
            </a>
            <a
              href={blueskyProfileWebUrl(author.did)}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 max-w-full truncate text-xs text-black/42 hover:text-black/60 dark:text-white/42 dark:hover:text-white/60"
            >
              @{author.handle}
            </a>
            {commentDate ? (
              <>
                <span className="text-xs text-black/25 dark:text-white/25" aria-hidden>
                  ·
                </span>
                {commentUrl ? (
                  <a
                    href={commentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-black/42 hover:text-black/60 dark:text-white/42 dark:hover:text-white/60"
                  >
                    {commentDate}
                  </a>
                ) : (
                  <span className="text-xs text-black/42 dark:text-white/42">{commentDate}</span>
                )}
              </>
            ) : null}
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-[0.92rem] leading-[1.6] text-black/70 dark:text-white/70">
            {post.record.text}
          </p>

          <div className="mt-2 flex items-center gap-4">
            <CommentStat
              icon={<FaRegComment className="h-3 w-3" aria-hidden />}
              count={post.replyCount ?? 0}
              label="replies"
            />
            <CommentStat
              icon={<FaRetweet className="h-3.5 w-3.5" aria-hidden />}
              count={(post.repostCount ?? 0) + (post.quoteCount ?? 0)}
              label="reposts"
            />
            <CommentStat
              icon={<FaRegHeart className="h-3 w-3" aria-hidden />}
              count={post.likeCount ?? 0}
              label="likes"
            />
            {commentUrl ? (
              <a
                href={commentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black/42 underline decoration-black/20 underline-offset-2 hover:text-black/65 dark:text-white/42 dark:decoration-white/20 dark:hover:text-white/65"
              >
                Reply
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {replies.length > 0 ? (
        depth < MAX_NESTING_DEPTH ? (
          <div className="ml-4 sm:ml-5">
            {replies.map((reply) => (
              <DiscussionComment key={reply.post.uri} comment={reply} depth={depth + 1} />
            ))}
          </div>
        ) : commentUrl ? (
          <div className="ml-11 mt-2">
            <a
              href={commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black/42 underline decoration-black/20 underline-offset-2 hover:text-black/65 dark:text-white/42 dark:decoration-white/20 dark:hover:text-white/65"
            >
              Continue this thread on Bluesky
            </a>
          </div>
        ) : null
      ) : null}
    </div>
  )
}

export function BlogDiscussion({ blueskyPostUri }: BlogDiscussionProps) {
  const [thread, setThread] = useState<BlueskyThreadViewPost | null>(null)
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
    setVisibleCount(INITIAL_VISIBLE_COMMENTS)

    fetch(blueskyThreadApiUrl(blueskyPostUri), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Bluesky thread request failed: ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (controller.signal.aborted) return
        if (isThreadViewPost(data?.thread)) {
          setThread(data.thread)
          setStatus('ready')
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error')
      })

    return () => controller.abort()
  }, [blueskyPostUri])

  const comments = useMemo(() => sortDiscussionReplies(thread?.replies), [thread])
  const visibleComments = comments.slice(0, visibleCount)

  if (!postUrl) return null

  return (
    <section
      data-blog-discussion
      className="blog-print-screen-only mx-auto mt-10 w-full max-w-[44rem] lg:mt-12"
      aria-label="Discussion"
    >
      <h2 className="text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.02em] text-black dark:text-white lg:text-2xl">
        Discussion
      </h2>

      {status === 'ready' && thread ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <a
            href={`${postUrl}/liked-by`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black/80 dark:text-white/55 dark:hover:text-white/80"
          >
            <FaRegHeart className="h-3.5 w-3.5" aria-hidden />
            <span>{thread.post.likeCount ?? 0} likes</span>
          </a>
          <a
            href={`${postUrl}/reposted-by`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black/80 dark:text-white/55 dark:hover:text-white/80"
          >
            <FaRetweet className="h-4 w-4" aria-hidden />
            <span>{(thread.post.repostCount ?? 0) + (thread.post.quoteCount ?? 0)} reposts</span>
          </a>
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black/80 dark:text-white/55 dark:hover:text-white/80"
          >
            <FaRegComment className="h-3.5 w-3.5" aria-hidden />
            <span>{thread.post.replyCount ?? 0} replies</span>
          </a>
        </div>
      ) : null}

      <p className="mt-3 text-sm leading-[1.65] text-black/55 dark:text-white/55">
        Join the discussion by{' '}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-baseline gap-1 text-black underline decoration-black/25 underline-offset-2 hover:text-black/80 hover:decoration-black/40 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40"
        >
          <FaBluesky className="h-3 w-3 self-center" aria-hidden />
          replying on Bluesky
        </a>
        . Replies to the announcement post appear here.
      </p>

      {status === 'loading' ? (
        <p className="mt-6 text-sm text-black/42 dark:text-white/42">Loading discussion…</p>
      ) : null}

      {status === 'error' ? (
        <p className="mt-6 text-sm text-black/42 dark:text-white/42">
          Couldn’t load the discussion right now.{' '}
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 underline decoration-black/25 underline-offset-2 hover:text-black/80 dark:text-white/60 dark:decoration-white/25 dark:hover:text-white/80"
          >
            View it on Bluesky
          </a>
          .
        </p>
      ) : null}

      {status === 'ready' && comments.length > 0 ? (
        <div className="mt-7 space-y-7">
          {visibleComments.map((comment) => (
            <DiscussionComment key={comment.post.uri} comment={comment} depth={0} />
          ))}
        </div>
      ) : null}

      {status === 'ready' && comments.length > visibleCount ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COMMENTS)}
          className="mt-6 text-sm text-black/55 underline decoration-black/25 underline-offset-2 hover:text-black/80 dark:text-white/55 dark:decoration-white/25 dark:hover:text-white/80"
        >
          Show more comments
        </button>
      ) : null}

      {status === 'ready' && comments.length === 0 ? (
        <p className="mt-6 text-sm text-black/42 dark:text-white/42">
          No comments yet. Be the first to reply.
        </p>
      ) : null}
    </section>
  )
}
