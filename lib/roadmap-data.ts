export type RoadmapStatus = "shipped" | "active" | "planned"

export interface RoadmapItem {
  label: string
  status: RoadmapStatus
}

export interface RoadmapTrack {
  label: string
  items: RoadmapItem[]
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function roadmapItemSlug(trackLabel: string, itemLabel: string): string {
  return `${slugPart(trackLabel)}/${slugPart(itemLabel)}`
}

export const roadmapTracks: RoadmapTrack[] = [
  {
    label: "Harness",
    items: [
      { label: "Pi integration", status: "shipped" },
      { label: "Connectors", status: "active" },
      { label: "Memory", status: "planned" },
      { label: "Agent Templates", status: "planned" },
      { label: "Agent to Agent communication", status: "planned" },
      { label: "Automatic LoRA adapter training", status: "planned" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Mac backend with MLX", status: "shipped" },
      { label: "Modelfile", status: "shipped" },
      { label: "Offline Installer", status: "shipped" },
      { label: "Hosted Iroh Relay", status: "planned" },
      { label: "Tilekit App Server", status: "planned" },
      { label: "Inference performance improvements", status: "planned" },
      { label: "Apple Foundation Model", status: "planned" },
      { label: "MIR integration", status: "planned" },
      { label: "TEE-based cloud models", status: "planned" },
      { label: "Modelfile deduplication and caching", status: "planned" },
    ],
  },
  {
    label: "Identity",
    items: [
      { label: "DID:key based local accounts", status: "shipped" },
      { label: "ATProto accounts", status: "shipped" },
      { label: "Agent Addresses", status: "planned" },
    ],
  },
  {
    label: "Sync",
    items: [
      { label: "E2E encrypted P2P sync", status: "shipped" },
      { label: "Shared Links", status: "shipped" },
      { label: "Remote Link", status: "planned" },
      { label: "Group Chats", status: "planned" },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Notarized builds", status: "shipped" },
      { label: "Encrypted SQLite database", status: "shipped" },
      { label: "Agent Sandbox", status: "active" },
      { label: "Inference runtime hardening", status: "planned" },
    ],
  },
]
