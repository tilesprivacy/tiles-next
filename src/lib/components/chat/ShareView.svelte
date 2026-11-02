<script lang="ts">
  import "katex/dist/katex.min.css"
  import ChatErrorState from "#lib/components/chat/ChatErrorState.svelte"
  import ChatFloatingBar from "#lib/components/chat/ChatFloatingBar.svelte"
  import ChatIcon from "#lib/components/chat/ChatIcon.svelte"
  import ChatMessage from "#lib/components/chat/ChatMessage.svelte"
  import ChatQrCode from "#lib/components/chat/ChatQrCode.svelte"
  import CopyButton from "#lib/components/chat/CopyButton.svelte"
  import { atprotoRecordUrl, bskyProfileUrl, CHAT_SESSION_SNAPSHOT, shortShareLabel } from "#lib/chat/links"
  import type { QrMatrix } from "#lib/chat/qr"
  import type { RenderedSession } from "#lib/chat/render"
  import { sharedByLabel, type SharePageData } from "#lib/chat/share-page"
  import { closeTableMenus, downloadFile, handleTableClick } from "#lib/chat/table-actions"
  import { COPY_ICON, DOWNLOAD_ICON, TABLE_FORMATS } from "#lib/chat/table-icons"
  import { transcriptFilename, transcriptMarkdown } from "#lib/chat/transcript"

  let { data }: { data: SharePageData } = $props()

  const PRIVATE_ERRORS = {
    missing:
      "This is a private link, but its decryption key is missing from the URL. Ask for the full link, including the part after #.",
    "wrong-key": "This private link's key doesn't open this chat. Check that you copied the whole link, including the part after #.",
    unreadable: "This private chat couldn't be read. Ask the person who shared it for a new link.",
  }

  // Public chats arrive rendered; private ones are decrypted here.
  let decrypted = $state<RenderedSession | null>(null)
  let errorMessage = $state<string | null>(null)
  let hash = $state("")
  let hashQr = $state<QrMatrix | null>(null)
  let fullscreenTable = $state<HTMLTableElement | null>(null)

  const session = $derived(data.share.kind === "public" ? data.share.session : decrypted)
  const isPrivate = $derived(data.share.kind === "private")
  // The QR and copied link carry a private link's key, as they always have.
  const href = $derived(data.pageUrl + hash)
  const qr = $derived(hashQr ?? (data.share.kind === "public" ? data.share.qr : null))
  const label = $derived(sharedByLabel(data.sharedBy))
  const handle = $derived(data.sharedBy.handle ? `@${data.sharedBy.handle}` : label)

  $effect(() => {
    const { share, pageUrl } = data
    const fragment = location.hash.slice(1)
    let current = true
    hash = location.hash
    hashQr = null
    decrypted = null
    errorMessage = null
    if (fragment) import("#lib/chat/qr").then(({ qrMatrix }) => current && (hashQr = qrMatrix(pageUrl + location.hash)))

    if (share.kind === "private") {
      if (!fragment) errorMessage = PRIVATE_ERRORS.missing
      else
        import("#lib/chat/private")
          .then(({ openPrivateShare, PrivateShareError }) =>
            openPrivateShare(share.ciphertext, fragment).then(
              (session) => current && (decrypted = session),
              (error: unknown) => current && (errorMessage = PRIVATE_ERRORS[error instanceof PrivateShareError ? error.kind : "unreadable"]),
            ),
          )
          .catch(() => current && (errorMessage = PRIVATE_ERRORS.unreadable))
    }
    return () => (current = false)
  })

  function downloadTranscript() {
    if (!session) return
    const markdown = transcriptMarkdown(session, { sharedBy: label, sourceUri: data.sourceUri, pageUrl: href })
    downloadFile(transcriptFilename(session), markdown, "text/markdown;charset=utf-8")
  }

  // One listener drives the copy, download and fullscreen buttons of every
  // table in the transcript (they're server-rendered HTML).
  function tableControls(node: HTMLElement) {
    const onClick = (event: MouseEvent) => {
      const table = handleTableClick(event)
      if (table) fullscreenTable = table
    }
    node.addEventListener("click", onClick)
    return () => node.removeEventListener("click", onClick)
  }

  function onWindowPointerDown(event: PointerEvent) {
    if (!(event.target instanceof Element) || !event.target.closest("[data-table-menu], [data-table-menu-toggle]")) closeTableMenus()
  }

  // Fullscreen shows a copy of the table over the page, which stops scrolling.
  const showTable = (table: HTMLTableElement) => (node: HTMLElement) => {
    const copy = table.cloneNode(true) as HTMLTableElement
    copy.className = "w-full border-collapse border border-border"
    node.appendChild(copy)
    document.body.style.overflow = "hidden"
    return () => {
      copy.remove()
      document.body.style.overflow = ""
    }
  }
</script>

<svelte:window
  onpointerdown={onWindowPointerDown}
  onkeydown={(event) => {
    if (event.key === "Escape") fullscreenTable = null
  }}
/>

{#if errorMessage}
  <ChatErrorState message={errorMessage} />
{:else if !session}
  <main
    data-shared-session-page
    class="flex h-[100dvh] overflow-hidden bg-[#fbfbfd] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#1d1d1f] dark:bg-[#1f1f1f] dark:text-[#E6E6E8] print:h-auto print:overflow-visible sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]"
  >
    <section class="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
      <div class="flex min-h-0 flex-1 items-center justify-center">
        <p class="w-full text-center text-sm text-black/55 dark:text-white/55">
          <span class="inline-flex max-w-full items-center whitespace-nowrap"><span>Loading shared chat...</span></span>
        </p>
        <noscript>
          <p class="text-center text-sm text-black/55 dark:text-white/55">Private chats are decrypted in your browser, which needs JavaScript.</p>
        </noscript>
      </div>
    </section>
    <ChatFloatingBar />
  </main>
{:else}
  <main
    data-shared-session-page
    class="flex h-[100dvh] overflow-hidden bg-[#fbfbfd] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#1d1d1f] dark:bg-[#1f1f1f] dark:text-[#E6E6E8] print:h-auto print:overflow-visible print:pb-0 sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]"
  >
    <section class="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden">
      <div
        class="native-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] [scrollbar-gutter:stable] print:overflow-visible print:pb-4"
      >
        <div class="mx-auto flex min-h-full w-full max-w-3xl flex-col overflow-x-hidden">
          <header
            class="relative flex flex-col gap-3 px-4 pb-7 pt-4 pr-[5.75rem] print:flex-row print:flex-nowrap print:items-start print:justify-between print:gap-x-6 print:px-2 print:pr-2 sm:px-5 sm:pb-8 sm:pr-[6.25rem] sm:pt-4"
          >
            {#if qr}<ChatQrCode {qr} url={href} />{/if}
            <div
              class="flex min-w-0 max-w-full items-center justify-start gap-2.5 text-left text-xs leading-5 text-black/68 dark:text-white/72 print:max-w-[42%] sm:gap-2"
            >
              <span class="min-w-0 truncate font-medium" title={href}>{shortShareLabel(data.pageUrl)}</span>
              <span
                class="shrink-0 rounded-sm border border-black/12 px-1.5 py-0.5 text-[0.65rem] font-medium leading-4 text-black/66 dark:border-white/16 dark:text-white/72"
                >{isPrivate ? "Private link" : "Public link"}</span
              >
              <CopyButton
                text={() => href}
                label="Copy link"
                class="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/62 transition-colors hover:text-black dark:text-white/62 dark:hover:text-white"
              />
              <button
                type="button"
                onclick={downloadTranscript}
                class="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/62 transition-colors hover:text-black dark:text-white/62 dark:hover:text-white"
                aria-label="Download transcript as Markdown"
                title="Download transcript"
              >
                <ChatIcon name="download" class="h-3.5 w-3.5" />
              </button>
            </div>
            <p class="max-w-full text-left text-xs leading-5 text-black/60 dark:text-white/65 sm:text-[0.8rem] print:max-w-none print:whitespace-nowrap">
              This is a {isPrivate ? "private" : "public"} copy of a conversation between Tiles and
              <span class="inline-flex max-w-full items-center gap-1.5 align-[-0.2em] whitespace-nowrap">
                {#if data.sharedBy.avatarUrl}
                  <img
                    src={data.sharedBy.avatarUrl}
                    alt={label}
                    class="h-4 w-4 rounded-full object-cover"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                  />
                {:else}
                  <span class="h-4 w-4 rounded-full bg-black/15 dark:bg-white/25" aria-hidden="true"></span>
                {/if}
                <a
                  href={bskyProfileUrl(data.sharedBy.handle, data.sharedBy.did)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-black/65 underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/85 hover:decoration-black/35 dark:text-white/75 dark:decoration-white/25 dark:hover:text-white dark:hover:decoration-white/40"
                  title="Open Bluesky profile">{handle}</a
                >
              </span>
            </p>
          </header>

          {#if session.messages.length}
            <div class="flex min-w-0 flex-col gap-6 py-5 sm:gap-7 sm:py-3" {@attach tableControls}>
              {#each session.messages as message, index (index)}
                <ChatMessage {message} defaultModel={session.modelsUsed[0] ?? null} />
              {/each}
            </div>
          {:else}
            <div class="flex min-h-0 flex-1 items-center justify-center rounded-sm border border-dashed border-black/12 px-6 text-center dark:border-white/12">
              <p class="max-w-sm text-sm leading-6 text-[#6b6b6f] dark:text-[#A8A8A8]">
                This shared session was found, but it does not contain displayable user or assistant messages yet.
              </p>
            </div>
          {/if}

          <footer class="mt-auto pt-5">
            <div class="border-t border-black/10 pt-3 dark:border-white/10">
              <p class="text-left text-[0.68rem] leading-4 text-black/55 dark:text-white/55 sm:text-[0.72rem]">
                <span class="block">We do not store a copy of the shared conversation on our servers.</span>
                <span class="mt-1 block">
                  For private links, the key stays in the URL and is never sent to the server. It's used to decrypt the chat transcript
                  stored on the user's PDS.
                </span>
                <span class="mt-1 block">
                  <span
                    >{data.collection === CHAT_SESSION_SNAPSHOT
                      ? "Data is fetched from the user's PDS as a Tiles lexicon record "
                      : "Data is fetched from the user's PDS "}</span
                  ><a
                    href={atprotoRecordUrl(data.sourceUri)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/40 dark:decoration-white/25 dark:hover:text-white/70 dark:hover:decoration-white/40"
                    >{data.sourceUri}</a
                  ><span>.</span>
                </span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </section>
    <ChatFloatingBar />
  </main>
{/if}

{#if fullscreenTable}
  <div
    aria-label="View fullscreen"
    aria-modal="true"
    class="fixed inset-0 z-50 flex flex-col bg-background"
    data-streamdown="table-fullscreen"
    role="dialog"
    {@attach tableControls}
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-end gap-1 p-4">
        {#each [["copy", "Copy table", 14, COPY_ICON], ["download", "Download table", 16, DOWNLOAD_ICON]] as const as [action, title, size, icon] (action)}
          <div class="relative">
            <button
              class="cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground"
              {title}
              type="button"
              data-table-menu-toggle={action}
            >
              <svg color="currentColor" height={size} stroke-linejoin="round" viewBox="0 0 16 16" width={size} aria-hidden="true">
                <path clip-rule="evenodd" d={icon} fill="currentColor" fill-rule="evenodd" />
              </svg>
            </button>
            <div
              class="absolute top-full right-0 z-20 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg"
              hidden
              data-table-menu={action}
            >
              {#each TABLE_FORMATS[action] as [format, label] (format)}
                <button class="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40" type="button" data-table-action={action} data-format={format}
                  >{label}</button
                >
              {/each}
            </div>
          </div>
        {/each}
        <button
          class="rounded-md p-1 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          onclick={() => (fullscreenTable = null)}
          title="Exit fullscreen"
          type="button"
        >
          <svg color="currentColor" height="20" stroke-linejoin="round" viewBox="0 0 16 16" width="20" aria-hidden="true">
            <path
              clip-rule="evenodd"
              d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-auto p-4 pt-0 [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10" {@attach showTable(fullscreenTable)}></div>
    </div>
  </div>
{/if}
