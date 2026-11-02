<script lang="ts">
  import ChatFloatingBar from "#lib/components/chat/ChatFloatingBar.svelte"
  import ChatIcon from "#lib/components/chat/ChatIcon.svelte"

  let { message }: { message: string } = $props()
</script>

<main
  data-shared-session-page
  class="flex h-[100dvh] overflow-hidden bg-[#fbfbfd] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#1d1d1f] dark:bg-[#1f1f1f] dark:text-[#E6E6E8] print:h-auto print:overflow-visible lg:min-h-screen lg:overflow-visible lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]"
>
  <div class="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center px-6 text-center">
    <div
      class="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 bg-black/5 text-black/60 dark:border-white/10 dark:bg-[#101010] dark:text-white/65"
    >
      <ChatIcon name="circle-alert" class="h-4 w-4" />
    </div>
    <h1 class="text-3xl font-semibold leading-tight tracking-tight text-[#1d1d1f] dark:text-[#EDEDEF] sm:text-4xl">Shared session unavailable</h1>
    <p class="mt-3 max-w-md text-sm leading-6 text-[#6b6b6f] dark:text-[#A8A8A8]">{message}</p>
  </div>
  <ChatFloatingBar />
</main>
