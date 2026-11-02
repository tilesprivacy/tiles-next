<script lang="ts">
  import ChatIcon, { type ChatIconName } from "#lib/components/chat/ChatIcon.svelte"
  import ChatMarkdown from "#lib/components/chat/ChatMarkdown.svelte"
  import CopyButton from "#lib/components/chat/CopyButton.svelte"
  import { huggingFaceModelUrl } from "#lib/chat/links"
  import type { RenderedMessage, RenderedReasoning, ToolIcon } from "#lib/chat/render"
  import { splitReasoning } from "#lib/chat/session"

  let { message, defaultModel }: { message: RenderedMessage; defaultModel: string | null } = $props()

  const isAssistant = $derived(message.role === "assistant")
  const model = $derived(message.role === "assistant" ? (message.model ?? defaultModel) : null)
  const toolIcon: Record<ToolIcon, ChatIconName> = { terminal: "terminal", file: "file-text", tool: "wrench" }

  // Copy gives the answer without the reasoning, as it always has.
  const copyText = () => splitReasoning(message.source).answer.trim() || message.source
</script>

{#snippet toolCall(item: Extract<RenderedReasoning, { type: "toolCall" }>)}
  <div class="min-w-0 py-1 text-black/68 dark:text-white/68">
    <div class="flex min-w-0 items-start gap-2.5">
      <span class="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center text-black/48 dark:text-white/48">
        <ChatIcon name={toolIcon[item.icon]} class="h-3.5 w-3.5" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="text-[0.82rem] font-medium leading-6 text-black/70 dark:text-white/72">{item.label}</span>
          <span class="font-mono text-[0.76rem] leading-6 text-black/52 dark:text-white/52">{item.detail}</span>
        </div>
        {#if item.details}
          <div class="mt-1.5">
            <div class="text-[0.72rem] font-medium leading-5 text-black/42 dark:text-white/42">Invocation details</div>
            {#if "rows" in item.details}
              <div
                class="mt-1.5 grid max-w-full gap-2 rounded-md bg-black/[0.035] p-2.5 text-[0.76rem] leading-5 text-black/62 dark:bg-white/[0.055] dark:text-white/62"
              >
                {#each item.details.rows as [key, value], index (index)}
                  <div class="grid min-w-0 gap-1 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-3">
                    <div class="font-mono text-black/42 dark:text-white/42">{key}</div>
                    <pre class="min-w-0 whitespace-pre-wrap break-words font-mono text-black/68 dark:text-white/68">{value}</pre>
                  </div>
                {/each}
              </div>
            {:else}
              <pre
                class="mt-1.5 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-black/[0.035] p-2.5 font-mono text-[0.72rem] leading-5 text-black/58 dark:bg-white/[0.055] dark:text-white/58">{item
                  .details.raw}</pre>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/snippet}

{#snippet toolResult(item: Extract<RenderedReasoning, { type: "toolResult" }>)}
  <div class="min-w-0 py-1 text-black/68 dark:text-white/68">
    <div class="mb-1 flex min-w-0 items-center gap-2 text-[0.82rem] leading-6 text-black/58 dark:text-white/62">
      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center text-black/48 dark:text-white/48">
        <ChatIcon name={toolIcon[item.icon]} class="h-3.5 w-3.5" />
      </span>
      <span class="font-medium">Tool result</span>
      {#if item.toolName}
        <span class="font-mono text-[0.76rem] text-black/48 dark:text-white/48">{item.toolName}</span>
      {/if}
      <ChatIcon name="check" class="h-3.5 w-3.5 shrink-0 text-black/40 dark:text-white/42" />
    </div>
    {#if item.events || item.markdown}
      <div class="pl-7">
        <div
          data-tool-result-scroll-block={item.long ? "" : undefined}
          class="min-w-0 rounded-md border border-black/10 bg-black/[0.025] p-3 dark:border-white/10 dark:bg-black/20 {item.long
            ? 'max-h-72 overflow-auto overscroll-contain [scrollbar-gutter:stable] print:max-h-none print:overflow-visible'
            : ''}"
        >
          {#if item.events}
            <div class="grid gap-3">
              <div class="flex items-center gap-2 text-[0.82rem] font-medium text-black/65 dark:text-white/70">
                <ChatIcon name="calendar-days" class="h-4 w-4 text-black/48 dark:text-white/48" />
                <span>Caldir events</span>
              </div>
              <div class="grid gap-2">
                {#each item.events as event, index (index)}
                  <div
                    class="grid min-w-0 gap-1 rounded-md border border-black/8 bg-white/55 px-3 py-2 dark:border-white/10 dark:bg-white/[0.035] sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-start sm:gap-3"
                  >
                    <div class="text-[0.76rem] leading-5 text-black/48 dark:text-white/48">
                      <div>{event.date}</div>
                      <div class="font-mono">{event.time}</div>
                    </div>
                    <div class="min-w-0">
                      <div class="break-words text-[0.84rem] leading-5 text-black/75 dark:text-white/75">{event.title}</div>
                      {#if event.calendar}
                        <div class="mt-0.5 break-all text-[0.72rem] leading-5 text-black/42 dark:text-white/42">{event.calendar}</div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {:else if item.markdown}
            <ChatMarkdown markdown={item.markdown} />
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/snippet}

<div class="flex w-full min-w-0 print:px-2 {isAssistant ? 'justify-start' : 'justify-end'}">
  <div
    class="min-w-0 max-w-[calc(100vw-2rem)] break-inside-avoid rounded-2xl px-4 py-3 text-sm leading-7 print:max-w-[94%] print:break-inside-auto sm:max-w-[78%] sm:px-5 sm:text-[0.95rem] {isAssistant
      ? 'bg-transparent text-[#2e2f33] print:bg-transparent dark:text-[#E6E6E8]'
      : 'bg-black/[0.045] text-[#2b2c31] print:bg-black/[0.045] dark:bg-white/[0.085] dark:text-[#EDEDEF] dark:print:bg-white/[0.085]'}"
  >
    {#if message.role === "user" && message.skill}
      <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.95rem] leading-7">
        <span class="inline-flex min-w-0 items-center gap-2 font-medium text-[#2f80df] dark:text-[#72a8ff]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M19 21C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5303 5 19 5H13.1C12.7655 5.00328 12.4355 4.92261 12.1403 4.76538C11.8451 4.60815 11.594 4.37938 11.41 4.1L10.6 2.9C10.4179 2.62347 10.17 2.39648 9.8785 2.2394C9.58702 2.08231 9.26111 2.00005 8.93 2H5C4.46957 2 3.96086 2.21071 3.58579 2.58579C3.21071 2.96086 3 3.46957 3 4V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19Z"
            />
            <path d="M3 9H21" />
            <path d="M8 13H8.01" />
            <path d="M12 13H12.01" />
            <path d="M16 13H16.01" />
            <path d="M8 17H8.01" />
            <path d="M12 17H12.01" />
          </svg>
          <span class="truncate">{message.skill.label}</span>
        </span>
        {#if message.skill.params}
          <span class="min-w-0 break-words text-[#2b2c31] dark:text-[#EDEDEF]">{message.skill.params}</span>
        {/if}
      </div>
    {:else}
      <div class="space-y-6">
        {#if message.role === "assistant" && message.reasoning.length}
          <details class="group/reasoning">
            <summary
              class="group flex w-full cursor-default list-none items-center gap-2 text-left text-[0.95rem] font-medium leading-6 text-black/60 transition-colors hover:text-black/80 dark:text-white/60 dark:hover:text-white/80 [&::-webkit-details-marker]:hidden"
            >
              <ChatIcon name="brain" class="h-4 w-4 shrink-0" />
              <span>Reasoning details</span>
              <ChatIcon
                name="chevron-down"
                class="h-4 w-4 transition-transform group-hover:text-black/70 group-open/reasoning:rotate-180 dark:group-hover:text-white/60"
              />
            </summary>
            <div class="mt-4 border-l-2 border-black/20 pl-5 text-[0.95rem] leading-7 text-black/75 dark:border-white/24 dark:text-white/70">
              <div class="grid gap-4">
                {#each message.reasoning as item, index (index)}
                  {#if item.type === "toolCall"}
                    {@render toolCall(item)}
                  {:else if item.type === "toolResult"}
                    {@render toolResult(item)}
                  {:else}
                    <ChatMarkdown markdown={item.markdown} />
                  {/if}
                {/each}
              </div>
            </div>
          </details>
        {/if}
        {#if message.markdown}
          <ChatMarkdown markdown={message.markdown} />
        {/if}
      </div>
    {/if}

    {#if message.role === "assistant"}
      <div class="mt-3 flex items-center gap-2 text-[0.78rem] text-black/60 dark:text-white/65">
        <CopyButton
          text={copyText}
          label="Copy response"
          class="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/60 transition-colors hover:text-black/80 dark:text-white/65 dark:hover:text-white/80"
        />
        {#if model}
          <span class="truncate">
            Generated with
            <a
              href={huggingFaceModelUrl(model)}
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/35 dark:decoration-white/20 dark:hover:text-white/70 dark:hover:decoration-white/35"
              >{model}</a
            >
          </span>
        {/if}
      </div>
    {/if}
  </div>
</div>
