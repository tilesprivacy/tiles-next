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
      { label: "Open Responses", status: "shipped" },
      { label: "Harmony renderer", status: "shipped" },
      { label: "Pi Agent Harness", status: "shipped" },
      { label: "Connectors", status: "active" },
      { label: "Memory", status: "active" },
      { label: "Agent Templates", status: "planned" },
      { label: "Agent to Agent communication", status: "planned" },
      { label: "Automatic LoRA adapter training", status: "planned" },
    ],
  },
  {
    label: "Inference",
    items: [
      { label: "Mac backend with MLX", status: "shipped" },
      { label: "Modelfile", status: "shipped" },
      { label: "Linux backend with llama.cpp", status: "active" },
      { label: "Apple Foundation Model", status: "planned" },
      { label: "TEE-based cloud models", status: "planned" },
      { label: "MIR integration", status: "planned" },
      { label: "Modelfile deduplication and caching", status: "planned" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Offline Installer", status: "shipped" },
      { label: "Tilekit App Server", status: "active" },
      { label: "ATproto Lexicons", status: "active" },
      { label: "Hosted Iroh Relay", status: "planned" },
    ],
  },
  {
    label: "Identity",
    items: [
      { label: "DID:key based local accounts", status: "shipped" },
      { label: "ATproto accounts", status: "shipped" },
      { label: "Agent Addresses", status: "planned" },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { label: "E2E encrypted P2P sync", status: "shipped" },
      { label: "Shared Links", status: "shipped" },
      { label: "Remote Link", status: "active" },
      { label: "Group Chats", status: "planned" },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Notarized builds", status: "shipped" },
      { label: "Encrypted SQLite database", status: "shipped" },
      { label: "Sandbox", status: "active" },
      { label: "Privacy Filter for shared sessions", status: "planned" },
      { label: "Runtime hardening", status: "planned" },
    ],
  },
]
