# References

- [Connectors without confiding. Conifer](https://confer.to/blog/2026/04/connectors/)
- [Proxy encrypted requests through your backend](https://docs.tinfoil.sh/guides/proxy-server)
- [How We Implemented Private AI Web Search](https://tinfoil.sh/blog/2026-01-22-private-ai-web-search)
# Implementation details 

- We are going to use [Pi extensions](https://pi.dev/docs/latest/extensions) for connectors while [Pi packages](https://pi.dev/docs/latest/packages) for Agent Templates.
- Social features for published Pi skills and extensions with [npmx](https://npmx.dev)

## Core

### Phase 1

1. [pi-mcp-adapter, Token-efficient MCP adapter for Pi coding agent](https://github.com/nicobailon/pi-mcp-adapter)

### Phase 2

1. [pi-btw, A small pi extension that adds a /btw side conversation channel.](https://github.com/dbachelder/pi-btw)

## First party

0. Exa Web Search

There are 3 ways we can add web search to Tiles, from easiest to hardest:

  - Use capyu/pi-exa (requires an API key) [RECOMMENDED FOR DEMO, MINIMAL]
  - Use nicobalion/pi-mcp-adapter + the Exa MCP endpoint (does not require an API key) [IDEAL SETUP]

1. [Tinfoil Private Web Search](https://docs.tinfoil.sh/guides/web-search)
  - Through Private Inference API
    - Cons: No control for tool calls
    - Pros: Usage billed with the base model inference tokens
  - [Through MCP server](https://docs.tinfoil.sh/guides/mcp-websearch)
    - Cons: $20 + usage fees for secure enclave container hosting the MCP server
    - Pros: Ability to control tool calls (perfect for usage with a custom agent harness like ours)