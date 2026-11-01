<!-- Shown at /research/inference-time-memory-module. Title, description and authors live in src/lib/research-log.ts. -->

<script>
  import ClickableImage from "#lib/components/ClickableImage.svelte"
</script>

## Design

An extremely simple inference-time memory module that treats memory management as a series of LLM calls and agent loops over a markdown-based file tree. We plan to build it around the Pi agent harness and package the [nanomem](https://github.com/openanonymity/nanomem) project as an integrated [Pi extension](https://pi.dev/docs/latest/extensions). The memory state is stored locally and encrypted on-device, and all user queries can be augmented with the minimal relevant context before being sent to the model.

## Selective memory

This setup supports selective disclosure of memory content, giving users control over what information is shared with the model. Rather than injecting a persistent global memory into every interaction, memory is retrieved at inference time and only the minimal relevant context is surfaced.

<figure>
  <ClickableImage src="/oamemory.png" alt="Memory agent revising a user prompt with minimal added context before model inference." width={2254} height={1956} style="border-radius: 12px; border: 1px solid var(--nextra-border-color, rgba(0,0,0,0.1)); width: 100%; height: auto" />
  <figcaption class="research-figure-caption">User queries can be revised to add the minimally necessary context before the request is processed by the model, from <a href="https://openanonymity.ai/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-underline-offset: 2px">The Open Anonymity Project</a>.</figcaption>
</figure>

## P2P Memory Sync

The memory files stay local on the user’s machine as a markdown tree. If the user chooses to sync these memory trees peer to peer, they can be semantically merged across devices using a local model driven by agents, keeping user memory consistent across machines without compromising data ownership or requiring centralized management.
