<script lang="ts">
  import ChatIcon from "#lib/components/chat/ChatIcon.svelte"

  let { text, label, class: className }: { text: () => string; label: string; class: string } = $props()

  let copied = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    const value = text()
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    copied = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied = false), 1200)
  }
</script>

<button type="button" onclick={copy} class={className} aria-label={label} title={label}>
  <ChatIcon name={copied ? "check" : "copy"} class="h-3.5 w-3.5" />
</button>
