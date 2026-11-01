<script lang="ts">
  import RiOpenSourceLine from "./icons/RiOpenSourceLine.svelte"

  // Takes strokeWidth like the lucide icons it sits beside, but has no stroke.
  let {}: { strokeWidth?: number } = $props()
</script>

<RiOpenSourceLine style="width:0.9375rem;height:0.9375rem" />
