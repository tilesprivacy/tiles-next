<script lang="ts">
  let {
    sha256, fileName, checksumPath, lastKnown = false,
  }: { sha256: string; fileName: string; checksumPath?: string; lastKnown?: boolean } = $props()

  const label = $derived(lastKnown ? "Last verified SHA-256 checksum" : "SHA-256 checksum")
  const checksumUrl = $derived(
    checksumPath ?? `/download/checksums/${sha256}/${encodeURIComponent(fileName)}.sha256`
  )
</script>

{#if /^[a-f0-9]{64}$/i.test(sha256)}
  <details class="minimal-download-size">
    <summary class="cursor-pointer" aria-label={`${label} for ${fileName}`}>{label}</summary>
    <code class="break-all select-all">{sha256}</code>
    <a class="block underline underline-offset-2" href={checksumUrl} download={`${fileName}.sha256`}>
      Download checksum file
    </a>
  </details>
{/if}
