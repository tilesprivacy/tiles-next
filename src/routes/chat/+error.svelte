<script lang="ts">
  import { page } from "$app/state"
  import ChatErrorState from "#lib/components/chat/ChatErrorState.svelte"

  // Load errors carry a message written for people; anything else gets a generic one.
  const message = $derived(
    page.status < 500 || page.status === 502
      ? (page.error?.message ?? "This shared chat couldn't be loaded.")
      : "Something went wrong loading this shared chat. Try again in a moment.",
  )
</script>

<svelte:head>
  <title>Shared chat session | Tiles</title>
</svelte:head>

<ChatErrorState {message} />
