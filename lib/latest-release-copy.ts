import type { ChangeSection } from "@/lib/releases"

export const LATEST_RELEASE_VERSION = "0.4.16"

export const LATEST_RELEASE_SECTIONS: ChangeSection[] = [
  {
    title: "Added",
    changes: [
      {
        text: "Peer-to-peer remote inference over Iroh, so linked devices can run models for each other",
      },
    ],
  },
  {
    title: "Changed",
    changes: [
      {
        text: "Unified inference on llama.cpp’s llama-server across supported platforms for a consistent local runtime",
      },
    ],
  },
]
