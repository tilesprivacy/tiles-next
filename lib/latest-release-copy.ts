import type { ChangeSection } from "@/lib/releases"

export const LATEST_RELEASE_VERSION = "0.4.19"
export const LATEST_RELEASE_TITLE = "Alpha 23"
export const LATEST_RELEASE_DATE_ISO = "2026-08-31"
export const LATEST_RELEASE_DATE_LABEL = "Aug 31, 2026"

export const LATEST_RELEASE_SECTIONS: ChangeSection[] = [
  {
    title: "Added",
    changes: [
      {
        text: "--mtp flag for tiles run to enable or disable MTP speculative decoding, persisted to config.toml like the other llama flags",
      },
      {
        text: "Model-load warnings from the inference server, such as MTP requested but no MTP head GGUF found, now surface in the CLI as yellow WARNING: lines before the input prompt",
      },
    ],
  },
  {
    title: "Changed",
    changes: [
      {
        text: "MTP speculative decoding is now opt-in: it no longer auto-enables when an MTP head GGUF is detected next to the model. Enable it with mtp = true under [llama] in config.toml or per-run with tiles run --mtp",
      },
    ],
  },
  {
    title: "Fixed",
    changes: [
      {
        text: "Chances of installing multiple versions of Tiles during tiles update",
      },
    ],
  },
]
