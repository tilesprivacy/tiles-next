import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { FaBluesky } from "react-icons/fa6"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Mission",
  description: "Bringing privacy technology to everyone.",
  openGraph: {
    title: "Tiles Mission",
    description: "Bringing privacy technology to everyone.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Mission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Mission",
    description: "Bringing privacy technology to everyone.",
    images: ["/api/og"],
  },
}

// Helper function to get icon type from URL
function getIconType(url: string): "website" | "twitter" | "github" | "bluesky" {
  if (url.includes("x.com") || url.includes("twitter.com")) return "twitter"
  if (url.includes("github.com")) return "github"
  if (url.includes("bsky.app")) return "bluesky"
  return "website"
}

// Helper function to get icon SVG
function getIcon(type: "website" | "twitter" | "github" | "bluesky") {
  const iconClass = "h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
  
  switch (type) {
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClass}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case "github":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClass}
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    case "bluesky":
      return <FaBluesky className={iconClass} />
    case "website":
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
  }
}

// Person component with links
function renderDisplayName(name: string) {
  const match = name.match(/^(.*?)(\s@[^ ]+)$/)
  if (!match) return name
  const [, fullName, handle] = match
  return (
    <>
      {fullName}
      <span className="text-black/50">{handle}</span>
    </>
  )
}

function Person({ name, links }: { name: string; links: string[] }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-black/80 lg:text-base">
      <span>{renderDisplayName(name)}</span>
      <div className="flex items-center gap-1 sm:gap-1.5">
        {links.map((url, index) => {
          const iconType = getIconType(url)
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/60 hover:text-black transition-colors"
              aria-label={`${name} ${iconType}`}
            >
              {getIcon(iconType)}
            </a>
          )
        })}
      </div>
    </div>
  )
}

// People data
const people = {
  contributors: [
    { name: "Ankesh Bharti @feynon", links: ["https://ankeshbharti.com", "https://x.com/feynon_", "https://bsky.app/profile/ankeshbharti.com"] },
    { name: "Anandu Pavanan @madclaws", links: ["https://github.com/madclaws"] },
    { name: "Kshitij Taneja @kshitijgetsac", links: ["https://github.com/kshitijgetsac"] },
    { name: "Musaab Khan @bxff", links: ["https://github.com/bxff", "https://www.reddit.com/user/sdexca/"] },
  ],
  sponsorsActive: [
    { name: "Luke Hubbard @lukeinth", links: ["https://bsky.app/profile/lukeinth.bsky.social"] },
    { name: "Dietrich Ayala @autonome", links: ["https://metafluff.com/", "https://bsky.app/profile/burrito.space", "https://github.com/autonome"] },
    { name: "Xi Zhang @aefhm", links: ["https://www.xizhang.page", "https://x.com/aefhm"] },
    { name: "Hugo Duprez @HugoDuprez", links: ["https://www.hugoduprez.com/", "https://x.com/HugoDuprez"] },
    { name: "Utkarsh Saxena @saxenauts", links: ["https://saxenauts.io/", "https://x.com/saxenauts"] },
  ],
  sponsorsPast: [
    { name: "Boris Mann @bmann.ca", links: ["https://bmannconsulting.com/", "https://bsky.app/profile/bmann.ca"] },
    { name: "Seref Yarar @hyperseref", links: ["https://x.com/hyperseref", "https://github.com/serefyarar"] },
    { name: "Curran Dwyer @currandwyer", links: ["https://x.com/CurranDwyer"] },
  ],
}

export default function MissionPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      <SiteHeader />

      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        {/* Content */}
        <main className="flex flex-1 flex-col lg:flex-row items-start lg:items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-7xl mx-auto">
          {/* Mission Text Section */}
          <div className="w-full flex-shrink-0 lg:flex-1 lg:max-w-2xl text-justify">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8 md:mb-10 lg:mb-12">Mission</h1>
            <div className="space-y-4 sm:space-y-6 text-sm leading-relaxed text-black/80 sm:text-base md:space-y-6 lg:space-y-8 lg:text-xl lg:leading-relaxed">
              <p className="text-base font-medium text-black sm:text-lg md:text-xl lg:text-2xl">
                Our mission is to bring privacy technology to everyone.
              </p>

              <p>
                Tiles Privacy was born from the{" "}
                <a
                  href="https://userandagents.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black hover:text-black/70 underline"
                >
                  User &amp; Agents
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>{" "}
                community with a simple idea: software should understand you without taking anything from you. We strive
                to deliver the best privacy-focused engineering while also offering unmatched convenience in our
                consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both
                through your personal user agent.
              </p>

              <p>
                Founded by Ankesh Bharti (
                <a
                  href="https://x.com/feynon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black hover:text-black/70 underline"
                >
                  @feynon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                ), an independent researcher and technologist, Tiles is
                built for privacy conscious users who want intelligence without renting their memory to centralized
                providers. Our first product is a private AI assistant with offline memory, and an SDK that lets developers customize local models and agent experiences within Tiles.
              </p>
            </div>
          </div>
          
          {/* Contributors & Sponsors Section */}
          <div className="w-full lg:w-auto lg:flex-shrink-0 mt-6 sm:mt-8 lg:mt-0">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10">
              {/* Contributors */}
              <div className="flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]">
                <h2 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 lg:text-xl">Contributors</h2>
                <div className="space-y-1 sm:space-y-1.5">
                  {people.contributors.map((person) => (
                    <Person key={person.name} name={person.name} links={person.links} />
                  ))}
                </div>
              </div>

              {/* Sponsors */}
              <div className="flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]">
                <h2 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4 lg:text-xl">Sponsors</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 lg:text-base">Active</h3>
                    <div className="space-y-1 sm:space-y-1.5">
                      {people.sponsorsActive.map((person) => (
                        <Person key={person.name} name={person.name} links={person.links} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 lg:text-base">Past</h3>
                    <div className="space-y-1 sm:space-y-1.5">
                      {people.sponsorsPast.map((person) => (
                        <Person key={person.name} name={person.name} links={person.links} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
