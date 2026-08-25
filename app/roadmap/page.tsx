import { notFound } from "next/navigation"

// The roadmap is hidden from the public site. Restore this page from git
// history to bring it back (components/roadmap-content.tsx and the
// roadmap-notes data are still in the repo).
export default function RoadmapPage() {
  notFound()
}
