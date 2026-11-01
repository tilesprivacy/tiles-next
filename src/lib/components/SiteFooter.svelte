<script lang="ts">
  import MinimalDownload from "./MinimalDownload.svelte"
  import MinimalFooter from "./MinimalFooter.svelte"

  let { showDownloadCta = true }: { showDownloadCta?: boolean } = $props()
</script>

<div class="refined-site-footer" data-pagefind-ignore="all">
  {#if showDownloadCta}
    <section class="refined-site-footer-download">
      <h2>Try Tiles now.</h2>
      <MinimalDownload platformSize="footer" />
    </section>
  {/if}
  <MinimalFooter />
</div>
