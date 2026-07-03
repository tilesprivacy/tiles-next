import { getPersonById, people, splitPersonDisplayName, type PersonIdentity } from "@/lib/people"

const borisMann = getPersonById("boris-mann")
const dietrichAyala = getPersonById("dietrich-ayala")

export const sponsorPageMaintainers = people.contributorsCore

export const sponsorPageAdvisors = [
  {
    id: "boris-mann",
    name: borisMann?.name ?? "Boris Mann @bmann.ca",
    links: borisMann?.links ?? ["https://bmannconsulting.com/", "https://bsky.app/profile/bmann.ca"],
  },
  {
    id: "dietrich-ayala",
    name: dietrichAyala?.name ?? "Dietrich Ayala @autonome",
    links: dietrichAyala?.links ?? ["https://metafluff.com/", "https://bsky.app/profile/burrito.space"],
  },
  {
    id: "gordon-brander",
    name: "Gordon Brander @gordon",
    links: ["https://gordonbrander.com", "https://bsky.app/profile/gordon.bsky.social"],
  },
] satisfies PersonIdentity[]

function displayName(person: PersonIdentity): string {
  return splitPersonDisplayName(person.name).nameWithoutHandle
}

export function formatPersonList(peopleList: PersonIdentity[]): string {
  const names = peopleList.map(displayName)
  if (names.length <= 2) return names.join(" and ")

  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`
}

export const sponsorPageTeamSentence = `Tiles is maintained by ${formatPersonList(
  sponsorPageMaintainers,
)}. The project is advised by ${formatPersonList(sponsorPageAdvisors)}.`
