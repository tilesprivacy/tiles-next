/** Public Git edit URL for roadmap note markdown (matches book docsRepositoryBase). */
const REPO_EDIT = "https://github.com/tilesprivacy/tiles-next/edit/main/roadmap-notes"

export function roadmapNoteEditUrl(slug: string): string {
  return `${REPO_EDIT}/${slug}.md`
}
