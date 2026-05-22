import fs from "node:fs"
import path from "node:path"
import { roadmapItemSlug, roadmapTracks } from "@/lib/roadmap-data"

const CONTENT_DIR = path.join(process.cwd(), "roadmap-notes")

export function getRoadmapNotesMap(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const track of roadmapTracks) {
    for (const item of track.items) {
      const slug = roadmapItemSlug(track.label, item.label)
      const filePath = path.join(CONTENT_DIR, `${slug}.md`)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing roadmap note file for ${slug}: ${filePath}`)
      }
      map[slug] = fs.readFileSync(filePath, "utf8")
    }
  }
  return map
}
