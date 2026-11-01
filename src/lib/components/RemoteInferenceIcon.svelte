<script lang="ts">
  let { strokeWidth = 1.75 }: { strokeWidth?: number } = $props()
</script>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} class="!h-5 !w-5" aria-hidden="true">
  <path d="M13.7 5H7.8A2.8 2.8 0 0 0 5 7.8v6.4A2.8 2.8 0 0 0 7.8 17H11" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M19 12V7.8A2.8 2.8 0 0 0 16.2 5H15" stroke-linecap="round" stroke-linejoin="round" />
  <path
    d="M13.6 18h-1.1a3 3 0 0 1 0-6h2M16.4 12h1.1a3 3 0 0 1 0 6h-2M13.8 15h2.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
