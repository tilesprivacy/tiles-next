<script lang="ts">
  import type { QrMatrix } from "#lib/chat/qr"

  let { qr, url }: { qr: QrMatrix; url: string } = $props()
</script>

<span
  class="absolute right-0 top-0 inline-flex shrink-0 bg-transparent text-black print:static print:float-right dark:text-white"
  title="Scan to open: {url}"
  role="img"
  aria-label="QR code for this share link"
>
  <svg class="block h-auto w-auto max-w-none" width="80" height="80" viewBox="0 0 {qr.size} {qr.size}" xmlns="http://www.w3.org/2000/svg">
    <path d={qr.path} fill="currentColor" />
  </svg>
</span>
