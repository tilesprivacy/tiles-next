<script lang="ts">
  import FaBluesky from "./icons/FaBluesky.svelte"
  import FaDiscord from "./icons/FaDiscord.svelte"
  import FaLinkedinIn from "./icons/FaLinkedinIn.svelte"
  import FaXTwitter from "./icons/FaXTwitter.svelte"
  import SiHuggingface from "./icons/SiHuggingface.svelte"
  import TangledIcon from "./TangledIcon.svelte"
  import FaGithub from "./icons/FaGithub.svelte"

  let { includeGithub = false, onclick }: { includeGithub?: boolean; onclick?: () => void } = $props()
</script>

{#if includeGithub}
  <a href="https://github.com/tilesprivacy/tiles" target="_blank" rel="noopener noreferrer" aria-label="GitHub" {onclick}><FaGithub aria-hidden="true" /></a>
{/if}
<a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" {onclick}><FaXTwitter aria-hidden="true" /></a>
<a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" {onclick}><FaBluesky aria-hidden="true" /></a>
<a href="https://www.linkedin.com/company/tilesprivacy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" {onclick}><FaLinkedinIn aria-hidden="true" /></a>
<a href="https://discord.gg/PPSjcpZzvt" target="_blank" rel="noopener noreferrer" aria-label="Discord" {onclick}><FaDiscord aria-hidden="true" /></a>
<a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" aria-label="Tangled" {onclick}><TangledIcon aria-hidden="true" /></a>
<a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" aria-label="Hugging Face" {onclick}><SiHuggingface aria-hidden="true" /></a>
