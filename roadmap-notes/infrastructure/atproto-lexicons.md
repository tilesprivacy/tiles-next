# ATproto session Lexicons

## Current finding

The current `run.tiles.chat.sessionSnapshot` record is valid and contains the final assistant answer. The rendering failure found in the public viewer is caused by an ambiguous normalization rule, not missing PDS data.

The affected session stores this ordered sequence:

```text
user
assistant (thinking + tool call)
tool result
assistant (thinking + tool call)
tool result
assistant (final text)
```

The viewer combines consecutive assistant and tool-result events into one display message. It inserts an internal answer boundary only when reasoning and visible text occur inside the same raw assistant message. When the final answer arrives as a later text-only assistant message, the combined display value has a reasoning prefix but no answer boundary. The viewer consequently treats the final text as more reasoning.

The immediate viewer fix belongs in the separate share application. It should preserve the ordered events or insert an explicit answer boundary before appending a text-only assistant message to accumulated reasoning.

## Consumer invariants

Clients reading the current schema should follow these rules:

1. Treat `turns[].messages[]` as an ordered event sequence.
2. Do not infer meaning from two adjacent messages having the same normalized display role.
3. Render every assistant content item with `type: "text"` as visible output, including text in a separate assistant message after tool use.
4. Treat `type: "thinking"`, `type: "toolCall"`, and `role: "toolResult"` as non-answer activity.
5. Correlate tool calls and results when an identifier is available. Do not rely on adjacency once parallel tool calls are supported.
6. Preserve unknown fields and content variants when reading and re-serializing records.

## Backward-compatible additions to the current Lexicon

The published Lexicon can add optional fields without invalidating existing records. Existing fields should keep their current types.

| Location | Field | Purpose |
| --- | --- | --- |
| record | `formatVersion` | Data format version. Treat an absent value as `1`. |
| message | `id` | Stable identifier for ordering, references, and deduplication. |
| message | `parentId` | Optional causal parent when a message is not simply linear. |
| message | `phase` | Open known values such as `analysis`, `tool`, and `final`. |
| message | `createdAt` | ISO 8601 timestamp. Keep the existing integer `timestamp` during migration. |
| content item | `callId` | Correlates a tool call with its result. |
| content item | `mimeType` | Describes non-Markdown text or structured output. |
| content item | `truncated` | Indicates that published content is incomplete. |

`phase: "final"` would resolve the current ambiguity while remaining compatible with old records. It should be treated as a hint during the transition. The content type remains authoritative, so an old producer that omits `phase` still works.

Use `knownValues` rather than `enum` for extensible strings such as roles, phases, stop reasons, providers, and APIs. Consumers must continue accepting unfamiliar values.

## Recommended version 2 shape

A cleaner version should use a new NSID, for example `run.tiles.chat.sessionSnapshotV2`, because changing the existing generic content object into a discriminated union is not a backward-compatible Lexicon evolution.

The main change is to make content semantics explicit through an open union. Every union variant carries a `$type` discriminator, so a client never has to inspect the presence of `text` or `thinking` fields to guess what an item means.

```json
{
  "$type": "run.tiles.chat.sessionSnapshotV2",
  "formatVersion": 2,
  "name": "Example session",
  "sessionId": "01...",
  "createdAt": "2026-08-18T08:56:04.469Z",
  "turns": [
    {
      "id": "turn-1",
      "provider": "tiles",
      "model": "unsloth/gemma-4-12b-it-GGUF:Q4_K_M",
      "api": "open-responses",
      "messages": [
        {
          "id": "message-1",
          "role": "assistant",
          "phase": "analysis",
          "content": [
            {
              "$type": "run.tiles.chat.sessionSnapshotV2#reasoning",
              "text": "Reasoning text"
            },
            {
              "$type": "run.tiles.chat.sessionSnapshotV2#toolCall",
              "callId": "call-1",
              "name": "read",
              "arguments": {
                "path": "/path/to/file"
              }
            }
          ]
        },
        {
          "id": "message-2",
          "role": "tool",
          "phase": "tool",
          "content": [
            {
              "$type": "run.tiles.chat.sessionSnapshotV2#toolResult",
              "callId": "call-1",
              "name": "read",
              "output": "File contents"
            }
          ]
        },
        {
          "id": "message-3",
          "role": "assistant",
          "phase": "final",
          "status": "completed",
          "stopReason": "stop",
          "content": [
            {
              "$type": "run.tiles.chat.sessionSnapshotV2#outputText",
              "text": "The final answer"
            }
          ]
        }
      ]
    }
  ]
}
```

The corresponding Lexicon should define `content` as an open union:

```json
{
  "type": "array",
  "items": {
    "type": "union",
    "closed": false,
    "refs": [
      "#inputText",
      "#outputText",
      "#reasoning",
      "#toolCall",
      "#toolResult"
    ]
  }
}
```

Recommended variant responsibilities:

- `inputText`: visible text supplied by a user or another input source.
- `outputText`: visible assistant output. A viewer always renders this outside the reasoning disclosure.
- `reasoning`: optional reasoning or a reasoning summary. A viewer may collapse or omit it.
- `toolCall`: tool name, stable `callId`, and structured `arguments` stored as `unknown`, not JSON encoded inside a string.
- `toolResult`: matching `callId`, tool name, output, truncation state, and optional content type.

The union should remain open so later versions can add attachments, citations, generated UI, audio, or other content without making older consumers reject the record.

## Tool calls and results

Tool calls need stable correlation identifiers. Adjacency is insufficient when a model issues several calls in parallel or when results arrive out of order.

```text
toolCall.callId = "call-1"
        ↓
toolResult.callId = "call-1"
```

Store `arguments` as structured ATproto data with the Lexicon `unknown` type. Keep a text fallback only when the source provider supplies malformed or non-JSON arguments.

For tool results, distinguish these cases explicitly:

- complete inline output;
- truncated inline output, with `truncated: true`;
- large output stored as a blob, with a blob reference, media type, byte count, and optional digest;
- unavailable output, with a reason rather than an empty string.

This prevents large command output from consuming most of the repository record limit and makes omission intentional rather than ambiguous.

## Publishing and privacy

Raw reasoning and tool results can include local paths, source files, personal data, or secrets. The publisher should decide what is included before writing a public record.

Add a record-level `shareMode` with open known values such as:

- `answersOnly`;
- `withReasoning`;
- `fullTranscript`.

This field documents the publisher's choice, but it is not an access-control mechanism. Anything written to a public PDS record must be treated as public.

For encrypted sessions, use a typed encrypted envelope rather than placing undeclared `enc_content` beside plaintext fields. A future envelope should declare:

- plaintext Lexicon type and format version;
- authenticated-encryption algorithm;
- nonce;
- ciphertext as bytes or a blob;
- optional authenticated metadata.

The nonce is not secret and can live in the record. Only the decryption key needs to remain in the URL fragment. A separate envelope NSID also lets clients validate encrypted and plaintext records independently.

## Migration plan

1. Fix the viewer so current records render ordered text items correctly without requiring schema changes.
2. Add optional `formatVersion`, message IDs, phases, and tool-call IDs to the current Lexicon and producer.
3. Make consumers prefer explicit fields while retaining the current fallback parser.
4. Publish a V2 Lexicon with open, `$type`-discriminated content variants.
5. Dual-read V1 and V2 in the viewer.
6. Dual-write only during a short test period if necessary. Prefer publishing one canonical record and linking to its replacement to avoid permanent duplication.
7. Add conformance fixtures for text-only answers, reasoning plus answer in one message, multi-step tool loops, parallel tools, unknown content variants, truncated output, and encrypted envelopes.

## References

- [Lexicon specification](https://atproto.com/specs/lexicon)
- [Lexicon style guide](https://atproto.com/guides/lexicon-style-guide)
- [ATproto data model](https://atproto.com/specs/data-model)
- [Data validation and record-size guidance](https://atproto.com/guides/data-validation)
- [Published Tiles session Lexicon](https://lexicon.garden/lexicon/did:plc:mqmcsjuerbjhu65mpmvkcuw2/run.tiles.chat.sessionSnapshot)
- [Happyview: a Lexicon-driven AppView for ATproto](https://github.com/gamesgamesgamesgamesgames/happyview)
- [MCP integration, Lexicon Garden](https://lexicon.garden/help/mcp)
- [Structured LLM output from ATproto Lexicons](https://cameron.stream/blog/lexicons-and-ai/)
- [The vCon conversation data container overview](https://www.ietf.org/archive/id/draft-ietf-vcon-vcon-overview-00.html)
- [Groundmist, AT Protocol meets local-first software](https://groundmist.xyz)
- [Lexicon Lenses Working Group formation](https://github.com/lexicon-community/governance/issues/14)
