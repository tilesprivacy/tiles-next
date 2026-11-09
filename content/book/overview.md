---
title: "Overview"
description: "Tiles, our consumer product, and Tilekit, the SDK for developers."
cardDescription: "Tiles, our consumer product, and Tilekit, the SDK for developers."
lastUpdated: "2026-11-09T10:28:31.000Z"
---

<script>
  import BookFaq from "#lib/components/book/BookFaq.svelte"
  import BookFaqItem from "#lib/components/book/BookFaqItem.svelte"
  import OverviewComparison from "#lib/components/book/OverviewComparison.svelte"
</script>

We make two things: Tiles, our consumer product, a local-first AI assistant; and Tilekit, the SDK for developers to build on the infrastructure behind Tiles.

**Status: Alpha**

Tiles is currently alpha-quality software. It is usable for everyday tasks, though you may encounter bugs and performance issues. Tilekit, the developer SDK, is experimental, not a current priority, and intended for exploratory use, not production.

<div id="private-ai-comparison"></div>

## What makes Tiles different

Tiles is built around a narrow bet: one well-integrated model at a time, optimized for credible local inference on Apple Silicon while balancing privacy, capability, and everyday usability.

<OverviewComparison />

Plugins are supported only in [Tiles Canary](/download).

## Appendix

### Technical Architecture

<div class="not-prose my-5">
  <img
    src="/architecture-2026-09.png"
    alt="Technical architecture diagram for Tiles"
    width="1836"
    height="1276"
    class="w-full"
    style="width:100%;height:auto"
    loading="lazy"
    decoding="async"
  />
  <div class="mt-3 w-full text-center text-sm italic leading-snug text-black/55 dark:text-[#A3A3A3]">Technical architecture of Tiles.</div>
</div>

### Shared Links

View this public shared chat example at [chat.tiles.run/YXQ6Ly9k...ZTJr](https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOnZreGY2aTY1a2VoZmY2a2p3cjNjaDJ2eC9ydW4udGlsZXMuc2Vzc2lvbi8zbW9vYmNjeXNnZTJr), or this private shared chat example at [chat.tiles.run/YXQ6Ly9k...DTBVLJ](https://chat.tiles.run/YXQ6Ly9kaWQ6cGxjOnZreGY2aTY1a2VoZmY2a2p3cjNjaDJ2eC9ydW4udGlsZXMuc2Vzc2lvbi8zbXBvcWd0d3p5ZzJ6#kUU4azu7HkPh7eqq5TQ8/YnAKHsBLIri.9wFnPDTBVLJDrOOkhidewMzYzZS8QAPkeQW7ozlYGVU=). Tiles supports public and private shared chat links. Public links resolve to a chat record on the user's ATproto personal data server (PDS). Private links store an encrypted transcript on the user's PDS; the decryption key is appended to the share URL and is not sent to the server. In both cases, Tiles does not store a copy of the shared conversation on our servers.

## Frequently asked questions

<div class="mt-4 mb-5">

Short answers drawn from our [security documentation](/book/security). For full context and limits, read that page.

</div>

<BookFaq class="mt-0">
  <BookFaqItem question="What is the current maturity level of Tiles and Tilekit?">

Tiles is currently alpha-quality software. It is usable for everyday tasks, though you may encounter bugs and
performance issues. Tilekit, the developer SDK, is experimental, not a current priority, and intended for
exploratory use, not production.

  </BookFaqItem>
  <BookFaqItem question="What does local-first mean for Tiles?">

Tiles is designed so the default experience runs on-device. The local server binds to <code>localhost</code>,
which limits exposed network surface during normal use. Configuration and application data live in standard
local directories, and you can change the user data path when needed.

  </BookFaqItem>
  <BookFaqItem question="Are chat and account databases stored as plain SQLite files?">

No. Application state is persisted locally with encryption at rest. The Rust build uses SQLCipher-enabled
SQLite, and database connections use a passkey from secure storage. That raises the bar against casual
inspection of copied files, though it does not remove all local risk.

  </BookFaqItem>
  <BookFaqItem question="How does Tiles handle identity and secret material?">

Public identity is separated from private keys. Device and account identity use <code>did:key</code> identifiers
from Ed25519 keys. Private keys and database passkeys are stored in the operating system's secure credential
store, not in plaintext app configuration files.

  </BookFaqItem>
  <BookFaqItem question="How does device linking and chat sync work?">

Peer-to-peer linking is user-mediated, not automatic. One device shows a ticket or local code; the other enters
it and explicitly accepts or rejects. In release builds, endpoints derive from your stored secret key, and peer
identity is checked against the delivered public key. Sync includes defensive controls, including a maximum size
cap for downloaded deltas before they are applied.

Sync uses [Iroh](https://www.iroh.computer/) for device-to-device networking. When a direct path is not practical, Iroh's public relays can help establish
the connection; we list that relay use on our [sub-processors](/sub-processors) page.

  </BookFaqItem>
  <BookFaqItem question="Does Tiles include product analytics, and what is logged locally?">

The product does not currently bundle obvious analytics SDKs such as Sentry, PostHog, Segment, Mixpanel, or
similar telemetry. There is still local logging: the Python server may log request metadata and bodies to files
under the Tiles data directory, so prompt content can appear in local logs unless logging changes.

  </BookFaqItem>
  <BookFaqItem question="How do updates, signing, and bundled dependencies relate to trust?">

Updates can check GitHub releases and install via the hosted installer script, which depends on release and
hosting integrity rather than a stronger built-in end-user verification workflow. Dependencies are pinned and
reviewed. The macOS package is code signed, notarized, and stapled. Bundled dependencies are self-contained so
normal installation and use do not require live package downloads from the internet.

  </BookFaqItem>
  <BookFaqItem question="How do I report a security vulnerability?">

Use the published security policy and private disclosure path. Researchers can use GitHub Security Advisories or
email [security@tiles.run](mailto:security@tiles.run), with expectations for acknowledgement, triage,
and coordinated disclosure. See [SECURITY.md](https://github.com/tilesprivacy/tiles/blob/main/SECURITY.md).

  </BookFaqItem>
</BookFaq>
