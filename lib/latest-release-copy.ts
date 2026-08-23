import type { ChangeSection } from "@/lib/releases"

export const LATEST_RELEASE_VERSION = "0.4.18"
export const LATEST_RELEASE_TITLE = "Alpha 22"
export const LATEST_RELEASE_DATE_ISO = "2026-08-23"
export const LATEST_RELEASE_DATE_LABEL = "Aug 23, 2026"

export const LATEST_RELEASE_SECTIONS: ChangeSection[] = [
  {
    title: "Added",
    changes: [
      {
        text: "Vulkan support for llama.cpp, enabling GPU acceleration beyond NVIDIA across vendors on Linux",
      },
    ],
  },
  {
    title: "Fixed",
    changes: [
      {
        text: "MTP speculative decoding being disabled by a hardcoded symlink",
      },
      {
        text: "Tool calls on Linux returning 422 errors after the openresponses-types version bump",
      },
      {
        text: "OAuth callback occasionally failing during ATproto login while waiting on the browser child process",
      },
    ],
  },
]
