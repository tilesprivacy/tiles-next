'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
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
  'text-black underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/75 hover:decoration-black/45 dark:text-white dark:decoration-white/30 dark:hover:text-white/75 dark:hover:decoration-white/45'

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

function DiscussionSummary({
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

  const reposterLinks = namedReposters.map((reposter) => (
    <a
      key={reposter.did}
      href={blueskyProfileWebUrl(reposter.did)}
      target="_blank"
      rel="noopener noreferrer"
      className={discussionLinkClass}
    >
      @{reposter.handle}
    </a>
  ))

  return (
    <>
      <p className="text-base leading-[1.7] text-black/70 dark:text-white/70">
        This post has {countLabel(replyCount, 'reply', 'replies')},{' '}
        {countLabel(quoteCount, 'quote', 'quotes')},{repostCount > 0 ? ' ' : ' and '}
        <a
          href={`${postUrl}/liked-by`}
          target="_blank"
          rel="noopener noreferrer"
          className={discussionLinkClass}
        >
          {countLabel(likeCount, 'like', 'likes')}
        </a>
        {repostCount > 0 ? (
          namedReposters.length > 0 ? (
            <>
              , and has been reposted by{' '}
              {reposterLinks.map((link, index) => (
                <Fragment key={namedReposters[index].did}>
                  {index > 0 &&
                    (index === reposterLinks.length - 1 && otherReposterCount === 0
                      ? reposterLinks.length > 2
                        ? ', and '
                        : ' and '
                      : ', ')}
                  {link}
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
          ) : (
            <>, and {countLabel(repostCount, 'repost', 'reposts')}</>
          )
        ) : null}
        .
      </p>
      <p className="mt-4">
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-base leading-[1.7] ${discussionLinkClass}`}
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
      <div className="flex items-center gap-2.5">
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
              width={36}
              height={36}
              loading="lazy"
              className="h-9 w-9 rounded-full bg-black/5 object-cover dark:bg-white/10"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-sm font-medium uppercase text-black/50 dark:bg-white/10 dark:text-white/50">
              {authorName.slice(0, 1)}
            </span>
          )}
        </a>
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <a
            href={blueskyProfileWebUrl(author.did)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 max-w-full truncate text-base font-semibold text-black hover:text-black/80 dark:text-white dark:hover:text-white/80"
          >
            {authorName}
          </a>
          <a
            href={blueskyProfileWebUrl(author.did)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 max-w-full truncate text-[0.95rem] text-black/45 hover:text-black/65 dark:text-white/45 dark:hover:text-white/65"
          >
            @{author.handle}
          </a>
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words text-base leading-[1.7] text-black/70 dark:text-white/70">
        {post.record.text}
      </p>

      {commentDate ? (
        <p className="mt-2">
          {commentUrl ? (
            <a
              href={commentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black/55 underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-black/40 dark:text-white/55 dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40"
            >
              {commentDate}
            </a>
          ) : (
            <span className="text-sm text-black/55 dark:text-white/55">{commentDate}</span>
          )}
        </p>
      ) : null}

      {replies.length > 0 ? (
        depth < MAX_NESTING_DEPTH ? (
          <div className="ml-1 mt-6 space-y-6 border-l border-black/8 pl-4 dark:border-white/12 sm:pl-5">
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
              className="text-sm text-black/55 underline decoration-black/25 underline-offset-2 hover:text-black/80 dark:text-white/55 dark:decoration-white/25 dark:hover:text-white/80"
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
      className="blog-print-screen-only mt-14 w-full"
      aria-label="Discussion"
    >
      <h2 className="mb-4 text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.02em] text-black dark:text-white lg:text-2xl">
        Discussion
      </h2>

      {status === 'loading' ? (
        <p className="text-sm text-black/42 dark:text-white/42">Loading discussion…</p>
      ) : null}

      {status === 'error' ? (
        <p className="text-base leading-[1.7] text-black/70 dark:text-white/70">
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
        <div className="mt-10 space-y-10">
          {visibleComments.map((comment) => (
            <DiscussionComment key={comment.post.uri} comment={comment} depth={0} />
          ))}
        </div>
      ) : null}

      {status === 'ready' && comments.length > visibleCount ? (
        <p className="mt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE_COMMENTS)}
            className="text-sm text-black/55 underline decoration-black/25 underline-offset-2 hover:text-black/80 dark:text-white/55 dark:decoration-white/25 dark:hover:text-white/80"
          >
            Show more comments
          </button>
        </p>
      ) : null}
    </section>
  )
}
