# References

- Implementation note: We are going to use [Pi extensions](https://pi.dev/docs/latest/extensions) for connectors while [Pi packages](https://pi.dev/docs/latest/packages) for Agent Templates.

## Core

### Phase 1

1. [pi-mcp-adapter, Token-efficient MCP adapter for Pi coding agent](https://github.com/nicobailon/pi-mcp-adapter)

### Phase 2

1. [pi-btw, A small pi extension that adds a /btw side conversation channel.](https://github.com/dbachelder/pi-btw)

## First party

1. [Tinfoil Private Web Search](https://docs.tinfoil.sh/guides/web-search)
  - Through Private Inference API
    - Cons: No control for tool calls
    - Pros: Usage billed with the base model inference tokens
  - [Through MCP server](https://docs.tinfoil.sh/guides/mcp-websearch)
    - Cons: $20 + usage fees for secure enclave container hosting the MCP server
    - Pros: Ability to control tool calls (perfect for usage with a custom agent harness like ours)
  - Implementation detail:
    - [Proxy encrypted requests through your backend](https://docs.tinfoil.sh/guides/proxy-server)
    - [How We Implemented Private AI Web Search](https://tinfoil.sh/blog/2026-01-22-private-ai-web-search)