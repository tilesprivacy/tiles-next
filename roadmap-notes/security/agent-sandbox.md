# Implementation

We are adopting a hybrid sandboxing approach. Agent-level sandboxing will be used for external isolation, enabling capability-based UCAN communication between agents, session snapshotting to resume agentic sessions and their environments across platforms, and collaborative workflows through synchronized session state. Nested sandboxing will be used for internal isolation to secure agent-to-tool communication.

# References

- [microsandbox, Rust based secure, local and programmable sandboxes for AI agents](https://github.com/superradcompany/microsandbox)
- [Where Should the Agent(s) Live?, Opencomputer](https://opencomputer.dev/blog/where-should-the-agent-live/)