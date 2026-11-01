<script lang="ts">
  // The GitHub / Discord sign-off shared by the legal pages.
  let { lead }: { lead: string } = $props()
</script>

<div class="space-y-4 pt-4">
  <p class="contact-info">
    {lead}
    <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" class="underline">GitHub</a>
    or
    <a href="https://discord.gg/PPSjcpZzvt" target="_blank" rel="noopener noreferrer" class="underline">Discord</a>.
  </p>
</div>
