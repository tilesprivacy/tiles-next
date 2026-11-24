<script lang="ts">
  let {
    sha256, fileName, checksumPath, lastKnown = false,
  }: { sha256: string; fileName: string; checksumPath?: string; lastKnown?: boolean } = $props()

  const label = $derived(`${lastKnown ? "Last verified " : ""}SHA256 checksum for ${fileName}`)
  const checksumUrl = $derived(
    checksumPath ?? `/download/checksums/${sha256}/${encodeURIComponent(fileName)}.sha256`
  )
</script>

{#if /^[a-f0-9]{64}$/i.test(sha256)}
  <a
    class="underline underline-offset-2"
    href={checksumUrl}
    download={`${fileName}.sha256`}
    aria-label={label}
    title={label}
  >SHA256</a> ·
{/if}
