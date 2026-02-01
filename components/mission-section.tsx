'use client'

import { FaBluesky, FaRedditAlien } from "react-icons/fa6"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from "next/link"

function getIconType(url: string): "website" | "twitter" | "github" | "bluesky" | "reddit" {
  if (url.includes("x.com") || url.includes("twitter.com")) return "twitter"
  if (url.includes("github.com")) return "github"
  if (url.includes("bsky.app")) return "bluesky"
  if (url.includes("reddit.com")) return "reddit"
  return "website"
}

function getIcon(type: "website" | "twitter" | "github" | "bluesky" | "reddit") {
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
    case "reddit":
      return <FaRedditAlien className={iconClass} />
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

const people = {
  contributorsCore: [
    { name: "Ankesh Bharti @feynon", links: ["https://ankeshbharti.com", "https://x.com/feynon_", "https://bsky.app/profile/ankeshbharti.com"] },
    { name: "Anandu Pavanan @madclaws", links: ["https://github.com/madclaws"] },
  ],
  contributorsCommunity: [],
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
    { name: "Goblin Oats @goblinoats", links: ["https://goblinoats.com/", "https://x.com/goblinoats", "https://bsky.app/profile/goblinoats.com", "https://github.com/goblinoats"] },
  ],
}

interface MissionSectionProps {
  title: string
  /** Use compact layout (e.g. on landing page). Default false = full mission page layout. */
  compact?: boolean
}

export function MissionSection({ title, compact = false }: MissionSectionProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const textColor = 'text-foreground'
  const textColorMuted = isDark ? 'text-[#E6E6E6]' : 'text-black/80'
  const textColorSubtle = isDark ? 'text-[#8A8A8A]' : 'text-black/50'
  const textColorBody = isDark ? 'text-[#B3B3B3]' : 'text-black/80'
  const linkColor = isDark ? 'text-[#E6E6E6] hover:text-[#B3B3B3]' : 'text-black hover:text-black/70'
  const linkColorMuted = isDark ? 'text-[#8A8A8A] hover:text-[#E6E6E6]' : 'text-black/60 hover:text-black'

  function renderDisplayName(name: string) {
    const match = name.match(/^(.*?)(\s@[^ ]+)$/)
    if (!match) return name
    const [, fullName, handle] = match
    return (
      <>
        {fullName}
        <span className={textColorSubtle}>{handle}</span>
      </>
    )
  }

  function Person({ name, links }: { name: string; links: string[] }) {
    return (
      <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${textColorMuted} lg:text-base`}>
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
                className={linkColorMuted}
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

  const content = (
    <>
      <div className="w-full flex-shrink-0 lg:flex-1 lg:max-w-2xl">
        <h2 className={`text-3xl font-bold text-left ${textColor} mb-6 sm:mb-8 md:mb-10 lg:mb-12 lg:text-5xl`}>{title}</h2>
        <div className={`space-y-4 sm:space-y-6 text-sm leading-relaxed ${textColorBody} sm:text-base md:space-y-6 lg:space-y-8 lg:text-lg lg:leading-relaxed`}>
          <p className={`text-base font-medium ${textColor} lg:text-xl`}>
            Our mission is to bring privacy technology to everyone.
          </p>

          <p>
            Tiles Privacy was born from the{" "}
            <a
              href="https://userandagents.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 ${linkColor} underline`}
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
              className={`inline-flex items-center gap-1 ${linkColor} underline`}
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
            providers. Our first product is a private and secure AI assistant for everyday use, and a Modelfile based SDK that lets developers customize local models and agent experiences within Tiles.
          </p>

          <p>
            Want to contribute?{" "}
            <Link href="/book/community" className={`${linkColor} underline`}>
              See how you can make Tiles better.
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-auto lg:flex-shrink-0 mt-6 sm:mt-8 lg:mt-0">
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10">
          <div className="flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]">
            <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-3 sm:mb-4 lg:text-xl`}>Contributors</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-1.5 sm:mb-2 lg:text-base`}>Core</h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {people.contributorsCore.map((person) => (
                    <Person key={person.name} name={person.name} links={person.links} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]">
            <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-3 sm:mb-4 lg:text-xl`}>Sponsors</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-1.5 sm:mb-2 lg:text-base`}>Current</h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {people.sponsorsActive.map((person) => (
                    <Person key={person.name} name={person.name} links={person.links} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-1.5 sm:mb-2 lg:text-base`}>Past</h4>
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
    </>
  )

  if (compact) {
    return (
      <section className="mt-20 lg:mt-32 pt-16 lg:pt-24 border-t border-black/10 dark:border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 w-full max-w-7xl mx-auto">
          {content}
        </div>
      </section>
    )
  }

  return (
    <main className="flex flex-1 flex-col lg:flex-row items-start lg:items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-7xl mx-auto">
      {content}
    </main>
  )
}
