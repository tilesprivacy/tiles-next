export interface PersonIdentity {
  /** Stable ID used for cross-page references (e.g. blog author field). */
  id: string
  /** Display name (optionally includes a handle suffix like " @handle"). */
  name: string
  /** Social/profile links. */
  links: string[]
  /** When true, render as an anonymous sponsor with no identifying links. */
  anonymous?: boolean
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
      name: "Anandu Pavanan @madcla.ws",
      links: ["https://bsky.app/profile/madcla.ws"],
    },
    {
      id: "prashant-mishra",
      name: "Prashant Mishra @primalpimmy",
      links: ["https://pimtron.dev"],
    },
  ],
  contributorsCommunity: [
    {
      id: "exdysa",
      name: "exdysa @exdysa",
      links: [
        "https://github.com/exdysa",
        "https://huggingface.co/exdysa",
        "https://ohai.social/@yzzxyz",
      ],
    },
  ],
  sponsorsActive: [
    { id: "boris-mann", name: "Boris Mann @bmann.ca", links: ["https://bmannconsulting.com/", "https://bsky.app/profile/bmann.ca"] },
    { id: "luke-hubbard", name: "Luke Hubbard @lukeinth", links: ["https://bsky.app/profile/lukeinth.bsky.social"] },
    {
      id: "dietrich-ayala",
      name: "Dietrich Ayala @autonome",
      links: ["https://metafluff.com/", "https://bsky.app/profile/burrito.space", "https://github.com/autonome"],
    },
    { id: "xi-zhang", name: "Xi Zhang @aefhm", links: ["https://www.xizhang.page", "https://x.com/aefhm"] },
    { id: "hugo-duprez", name: "Hugo Duprez @HugoDuprez", links: ["https://www.hugoduprez.com/", "https://x.com/HugoDuprez"] },
    { id: "utkarsh-saxena", name: "Utkarsh Saxena @saxenauts", links: ["https://saxenauts.io/", "https://x.com/saxenauts"] },
    { id: "devdoshi", name: "Dev Doshi @devdoshi", links: ["https://github.com/devdoshi", "https://x.com/thedevisadev"] },
  ],
  sponsorsPast: [
    { id: "curran-dwyer", name: "Curran Dwyer @currandwyer", links: ["https://x.com/CurranDwyer"] },
    {
      id: "rashid-aziz",
      name: "Rashid Aziz @razberry",
      links: ["https://www.raz.lol", "https://x.com/RazberryChai", "https://bsky.app/profile/raz.lol", "https://github.com/hellorashid"],
    },
    {
      id: "gavin-owens",
      name: "Gavin Owens @goblinoats",
      links: ["https://gavinowens.net/", "https://x.com/goblinoats", "https://bsky.app/profile/goblinoats.com", "https://github.com/goblinoats"],
    },
    {
      id: "yusuf-olokoba",
      name: "Yusuf Olokoba @OlokobaYusuf",
      links: ["https://x.com/OlokobaYusuf"],
    },
    {
      id: "jeremie-miller",
      name: "Jeremie Miller @jeremie.com",
      links: ["https://bsky.app/profile/jeremie.com"],
    },
    {
      id: "alex-komoroske",
      name: "Alex Komoroske @komorama",
      links: ["https://www.komoroske.com", "https://x.com/komorama", "https://bsky.app/profile/komorama.bsky.social", "https://github.com/jkomoros"],
    },
    {
      id: "chad-kohalyk",
      name: "Chad Kohalyk @chadkoh",
      links: ["https://chadkohalyk.com", "https://bsky.app/profile/chadkoh.com"],
    },
    {
      id: "josiah-witt",
      name: "Josiah Witt @josiahwitt.com",
      links: ["https://josiahwitt.com", "https://bsky.app/profile/josiahwitt.com"],
    },
    {
      id: "anish-lakhwara",
      name: "Anish Lakhwara @chickensoupwithrice",
      links: ["https://github.com/Chickensoupwithrice"],
    },
    { id: "anonymous-sponsor-1", name: "Anonymous sponsor", links: [], anonymous: true },
    { id: "anonymous-sponsor-2", name: "Anonymous sponsor", links: [], anonymous: true },
    { id: "anonymous-sponsor-3", name: "Anonymous sponsor", links: [], anonymous: true },
  ],
} satisfies Record<string, PersonIdentity[]>

export function getPersonById(id: string): PersonIdentity | null {
  for (const group of Object.values(people)) {
    const match = group.find((p) => p.id === id)
    if (match) return match
  }
  return null
}

/** Split trailing " @handle" from display names (e.g. blog bylines). */
export function splitPersonDisplayName(fullName: string): {
  nameWithoutHandle: string
  handle: string | null
} {
  const match = fullName.match(/^(.+)\s(@\S+)$/)
  if (match) {
    return { nameWithoutHandle: match[1].trim(), handle: match[2] ?? null }
  }
  return { nameWithoutHandle: fullName, handle: null }
}
