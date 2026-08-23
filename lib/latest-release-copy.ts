import type { ChangeSection } from "@/lib/releases"

export const LATEST_RELEASE_VERSION = "0.4.17"
export const LATEST_RELEASE_TITLE = "Alpha 21"

export const LATEST_RELEASE_SECTIONS: ChangeSection[] = [
  {
    title: "Added",
    changes: [
      {
        text: "Quantization selection in Modelfiles with Ollama-style tags, defaulting to Q4_K_M when no quantization is specified",
      },
      {
        text: "MTP speculative decoding now enables automatically when a model includes an MTP head",
      },
      {
        text: "Linux release builds now attach x86_64 tarballs and SHA256 checksums to tagged GitHub releases",
      },
      {
        text: "Scripted offline-installer builds that bundle the default Gemma GGUF and MTP head",
      },
    ],
  },
  {
    title: "Changed",
    changes: [
      {
        text: "Default model switched to Unsloth’s Gemma 4 12B GGUF at Q4_K_M",
      },
      {
        text: "Pi upgraded to v0.84.2 from the upstream badlogic/pi-mono project",
      },
    ],
  },
  {
    title: "Fixed",
    changes: [
      {
        text: "macOS notarization for Pi’s bundled native modules",
      },
      {
        text: "Incomplete cached model snapshots now re-download a missing GGUF instead of failing",
      },
    ],
  },
]
