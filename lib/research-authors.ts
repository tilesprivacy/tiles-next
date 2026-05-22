import { getPersonById, type PersonIdentity } from "@/lib/people"
import type { ResearchLogEntry } from "@/lib/research-log"

export type ResearchAuthor = PersonIdentity

export function getResearchAuthors(entry: Pick<ResearchLogEntry, "authorIds">): ResearchAuthor[] {
  return entry.authorIds.flatMap((id) => {
    const person = getPersonById(id)
    if (!person) return []

    return person
  })
}
