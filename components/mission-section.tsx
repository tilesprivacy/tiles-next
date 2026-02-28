'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import { people } from "@/lib/people"

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
      <div className={`flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm ${textColorMuted} lg:text-base leading-relaxed`}>
        <span>{renderDisplayName(name)}</span>
        <SocialLinks
          name={name}
          links={links}
          className="flex items-center gap-1 sm:gap-1.5"
          linkClassName={linkColorMuted}
          iconClassName="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
        />
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
            providers. Our first product is a private, secure AI assistant for everyday use, along with an SDK that enables developers to customize local models and agent experiences within Tiles.
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
            <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-4 sm:mb-5 lg:text-xl`}>Contributors</h3>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-2 sm:mb-2.5 lg:text-base`}>Core</h4>
                <div className="space-y-2 sm:space-y-2.5">
                  {people.contributorsCore.map((person) => (
                    <Person key={person.name} name={person.name} links={person.links} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]">
            <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-4 sm:mb-5 lg:text-xl`}>Sponsors</h3>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-2 sm:mb-2.5 lg:text-base`}>Current</h4>
                <div className="space-y-2 sm:space-y-2.5">
                  {people.sponsorsActive.map((person) => (
                    <Person key={person.name} name={person.name} links={person.links} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-medium ${textColor} mb-2 sm:mb-2.5 lg:text-base`}>Past</h4>
                <div className="space-y-2 sm:space-y-2.5">
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
      <section className="w-full mt-14 lg:mt-20 border-t border-black/[0.06] dark:border-white/[0.06] pt-20 lg:pt-28 pb-20 lg:pb-28 [contain:layout_style] transform-gpu">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 w-full">
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
