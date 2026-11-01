<script lang="ts">
  import type { SVGAttributes } from "svelte/elements"

  // Same markup react-icons renders, so sizes and alignment match.
  let { size = "1em", ...rest }: SVGAttributes<SVGSVGElement> & { size?: string | number } = $props()
</script>

<svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" {...rest} height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"></path></svg>
