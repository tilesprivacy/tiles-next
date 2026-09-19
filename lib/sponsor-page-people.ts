import { getPersonById, people, splitPersonDisplayName, type PersonIdentity } from "@/lib/people"

export interface SponsorPageAdvisor extends PersonIdentity {
  roles: string[]
}

const borisMann = getPersonById("boris-mann")
const dietrichAyala = getPersonById("dietrich-ayala")

export const sponsorPageMaintainers = people.contributorsCore

export const sponsorPageAdvisors = [
  {
    id: "boris-mann",
    name: borisMann?.name ?? "Boris Mann @bmann.ca",
    links: borisMann?.links ?? ["https://bmannconsulting.com/", "https://bsky.app/profile/bmann.ca"],
    roles: [
      "COO, Ink & Switch",
      "Project Lead, AT Community Fund",
      "Co-founder & CEO, Fission Labs",
    ],
  },
  {
    id: "dietrich-ayala",
    name: dietrichAyala?.name ?? "Dietrich Ayala @autonome",
    links: dietrichAyala?.links ?? ["https://metafluff.com/", "https://bsky.app/profile/burrito.space"],
    roles: [
      "Co-founder, Users & Agents",
      "Founder, Web Transitions",
      "Ecosystem Lead and Advisor, Protocol Labs",
      "Developer Advocate, Mozilla",
    ],
  },
  {
    id: "gordon-brander",
    name: "Gordon Brander @gordon",
    links: ["https://gordonbrander.com", "https://bsky.app/profile/gordon.bsky.social"],
    roles: [
      "Research Fellow, Future of Life Foundation",
      "Research Fellow, Cosmos Institute",
      "Founder and CEO, Subconscious",
      "Web Platform Designer, Google",
      "Design Engineer, Mozilla",
    ],
  },
] satisfies SponsorPageAdvisor[]

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
