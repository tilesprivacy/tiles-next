export interface PersonIdentity {
  /** Stable ID used for cross-page references (e.g. blog author field). */
  id: string
  /** Display name (optionally includes a handle suffix like " @handle"). */
  name: string
  /** Social/profile links. */
  links: string[]
}

export const people = {
  contributorsCore: [
    {
      id: "ankesh-bharti",
      name: "Ankesh Bharti @feynon",
      links: [
        "https://ankeshbharti.com",
        "https://x.com/feynon_",
        "https://bsky.app/profile/ankeshbharti.com",
        "https://github.com/feynon",
      ],
    },
    {
      id: "anandu-pavanan",
      name: "Anandu Pavanan @madclaws",
      links: ["https://github.com/madclaws", "https://bsky.app/profile/madcla.ws"],
    },
  ],
  contributorsCommunity: [],
  sponsorsActive: [
    { id: "luke-hubbard", name: "Luke Hubbard @lukeinth", links: ["https://bsky.app/profile/lukeinth.bsky.social"] },
    {
      id: "dietrich-ayala",
      name: "Dietrich Ayala @autonome",
      links: ["https://metafluff.com/", "https://bsky.app/profile/burrito.space", "https://github.com/autonome"],
    },
    { id: "xi-zhang", name: "Xi Zhang @aefhm", links: ["https://www.xizhang.page", "https://x.com/aefhm"] },
    { id: "hugo-duprez", name: "Hugo Duprez @HugoDuprez", links: ["https://www.hugoduprez.com/", "https://x.com/HugoDuprez"] },
    { id: "utkarsh-saxena", name: "Utkarsh Saxena @saxenauts", links: ["https://saxenauts.io/", "https://x.com/saxenauts"] },
  ],
  sponsorsPast: [
    { id: "boris-mann", name: "Boris Mann @bmann.ca", links: ["https://bmannconsulting.com/", "https://bsky.app/profile/bmann.ca"] },
    { id: "seref-yarar", name: "Seref Yarar @hyperseref", links: ["https://x.com/hyperseref", "https://github.com/serefyarar"] },
    { id: "curran-dwyer", name: "Curran Dwyer @currandwyer", links: ["https://x.com/CurranDwyer"] },
    {
      id: "rashid-aziz",
      name: "Rashid Aziz @razberry",
      links: ["https://www.raz.lol", "https://x.com/RazberryChai", "https://bsky.app/profile/raz.lol", "https://github.com/hellorashid"],
    },
    {
      id: "goblin-oats",
      name: "Goblin Oats @goblinoats",
      links: ["https://goblinoats.com/", "https://x.com/goblinoats", "https://bsky.app/profile/goblinoats.com", "https://github.com/goblinoats"],
    },
  ],
} satisfies Record<string, PersonIdentity[]>

export function getPersonById(id: string): PersonIdentity | null {
  for (const group of Object.values(people)) {
    const match = group.find((p) => p.id === id)
    if (match) return match
  }
  return null
}
