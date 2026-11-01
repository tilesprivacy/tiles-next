<script lang="ts">
  import { onMount } from "svelte"
  import {
    loadDiscussion,
    type Discussion,
    type DiscussionPost,
    type DiscussionReply,
    type TextSegment,
  } from "#lib/bluesky-discussion"

  // Replies to the post's Bluesky announcement, shown as comments. Loaded in
  // the browser so it stays current; left out if Bluesky can't be reached.
  let { blueskyPostUri }: { blueskyPostUri: string } = $props()

  const ENGAGE_TEXT = "Add your thoughts on Bluesky"

  let status = $state<"idle" | "loading" | "ready" | "failed">("idle")
  let discussion = $state<Discussion | null>(null)

  onMount(() => {
    status = "loading"
    let cancelled = false
    loadDiscussion(blueskyPostUri).then((result) => {
      if (cancelled) return
      discussion = result
      status = result ? "ready" : "failed"
    })
    return () => {
      cancelled = true
    }
  })

  const count = (n: number) => n.toLocaleString("en-US")
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  /** "@a, @b, and 3 other people", as linked segments. */
  function repostedBy(d: Discussion): TextSegment[] {
    const names: TextSegment[] = d.reposters.map((r) => ({ text: `@${r.handle}`, href: r.profileUrl }))
    const others = d.repostCount - names.length
    if (others > 0) {
      const rest = { text: `${count(others)} other people`, href: `${d.postUrl}/reposted-by` }
      if (names.length === 0) return [rest]
      return [...joined(names), { text: names.length === 1 ? " and " : ", and " }, rest]
    }
    if (names.length === 2) return [names[0], { text: " and " }, names[1]]
    return [...joined(names.slice(0, -1)), ...(names.length > 1 ? [{ text: ", and " }] : []), ...names.slice(-1)]
  }

  function joined(names: TextSegment[]): TextSegment[] {
    return names.flatMap((name, i) => (i === 0 ? [name] : [{ text: ", " }, name]))
  }
</script>

{#snippet text(segments: TextSegment[])}
  {#each segments as segment, i (i)}
    {#each segment.text.split("\n") as line, j (j)}
      {#if j > 0}<br />{/if}
      {#if segment.href}<a href={segment.href} target="_blank" rel="noopener noreferrer">{line}</a>{:else}{line}{/if}
    {/each}
  {/each}
{/snippet}

{#snippet post(item: DiscussionPost)}
  <a class="author" href={item.author.profileUrl} target="_blank" rel="noopener noreferrer">
    {#if item.author.avatar}
      <img class="avatar" src={item.author.avatar} alt="" width="24" height="24" loading="lazy" decoding="async" />
    {/if}
    <strong class="displayname">{item.author.name}</strong>
    <span class="handle">@{item.author.handle}</span>
  </a>
  <p>{@render text(item.text)}</p>
  <footer>
    <a href={item.url} title="View on Bluesky" target="_blank" rel="noopener noreferrer">
      <time datetime={item.createdAt}>{formatDate(item.createdAt)}</time>
    </a>
  </footer>
{/snippet}

{#snippet reply(item: DiscussionReply)}
  <li class="reply">
    {@render post(item)}
    {#if item.continueUrl}
      <p class="depth-cutoff">
        <a href={item.continueUrl} target="_blank" rel="noopener noreferrer">More of the conversation on Bluesky &rarr;</a>
      </p>
    {:else if item.replies.length > 0}
      <ol class="thread">
        {#each item.replies as nested, i (i)}{@render reply(nested)}{/each}
      </ol>
    {/if}
  </li>
{/snippet}

{#if status === "loading" || status === "ready"}
  <section
    data-blog-discussion
    class="blog-print-screen-only mt-10 w-full border-t border-black/8 pt-5 text-xs leading-6 text-black/54 dark:border-white/10 dark:text-white/54 lg:mt-12 lg:text-sm"
    aria-label="Discussion"
  >
    <h2 class="mb-3 text-sm font-semibold text-black dark:text-white lg:text-base">Discussion</h2>
    <div class="bsky-conversation">
      {#if !discussion}
        <p>Loading conversation…</p>
      {:else}
        <header>
          <ul>
            {#if discussion.replyCount > 0}
              <li>{count(discussion.replyCount)} {plural(discussion.replyCount, "reply", "replies")}</li>
            {/if}
            {#if discussion.quoteCount > 0}
              <li>
                <a href="{discussion.postUrl}/quotes" target="_blank" rel="noopener noreferrer">
                  {count(discussion.quoteCount)} {plural(discussion.quoteCount, "quote", "quotes")}
                </a>
              </li>
            {/if}
            {#if discussion.repostCount > 0}
              <li>reposted by {@render text(repostedBy(discussion))}</li>
            {/if}
            <li class="engage">
              <a href={discussion.postUrl} target="_blank" rel="noopener noreferrer">{ENGAGE_TEXT}</a>
            </li>
          </ul>
        </header>
        {#if discussion.timeline.length > 0}
          <ol class="timeline">
            {#each discussion.timeline as item, i (i)}
              {#if item.kind === "reply"}
                {@render reply(item)}
              {:else}
                <li class="quote">{@render post(item)}</li>
              {/if}
            {/each}
          </ol>
          <footer class="continue">
            <a href={discussion.postUrl} target="_blank" rel="noopener noreferrer">{ENGAGE_TEXT}</a>
          </footer>
        {/if}
      {/if}
    </div>
  </section>
{/if}

<style>
  /* Colours come from the --bsky-* properties set in app.css. */
  .bsky-conversation a {
    color: var(--bsky-link-color);
    text-decoration: underline;
    text-decoration-color: var(--bsky-link-underline);
    font-weight: 400;
    transition:
      color 150ms,
      text-decoration-color 150ms;
  }
  .bsky-conversation a:hover {
    color: var(--bsky-link-hover);
    text-decoration-color: var(--bsky-link-underline-hover);
  }
  header {
    margin-bottom: 1em;
  }
  header ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25em 1em;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: smaller;
  }
  .engage {
    flex-basis: 100%;
    margin-top: 0.25em;
  }
  .timeline,
  .thread {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .reply,
  .quote {
    padding: 1.25em 0;
  }
  .bsky-conversation .author {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    color: inherit;
    text-decoration-line: none;
    margin-bottom: 0.25em;
  }
  .author:hover .displayname {
    text-decoration: underline;
  }
  .avatar {
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .displayname {
    font-weight: 600;
  }
  .handle {
    color: var(--bsky-muted-color);
  }
  .reply > p,
  .quote > p {
    margin: 0.25em 0 0;
  }
  footer {
    display: flex;
    gap: 0.75em;
    margin-top: 0.25em;
    font-size: smaller;
    color: var(--bsky-muted-color);
  }
  .thread {
    padding-left: 1.5em;
    margin-top: 0.5em;
    border-left: 2px solid var(--bsky-border-color);
  }
  .thread .reply {
    padding: 0.5em 0;
  }
  .depth-cutoff {
    margin: 0.5em 0 0;
    font-size: smaller;
  }
  .continue {
    text-align: center;
    padding: 1em 0 0.5em;
  }
</style>
