<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    method,
    path,
    title,
    children,
  }: { method: "GET" | "POST" | "PUT"; path: string; title: string; children: Snippet } = $props()
</script>

<details class="tilekit-endpoint">
  <summary>
    <span class="tilekit-method" data-method={method}>{method}</span>
    <code>{path}</code>
    <span class="tilekit-endpoint-title">{title}</span>
    <span class="tilekit-endpoint-toggle" aria-hidden="true">+</span>
  </summary>
  <div class="tilekit-endpoint-body">
    {@render children()}
  </div>
</details>
