'use client'
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { PersonAvatar } from "@/components/person-avatar"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import {
  marketingPageBodyClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import { people, splitPersonDisplayName } from "@/lib/people"
import { FaGithub } from "react-icons/fa6"
import { SiOpencollective } from "react-icons/si"

interface SponsorContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

function SponsorPerson({
  name,
  links,
  anonymous = false,
}: {
  name: string
  links: string[]
  anonymous?: boolean
}) {
  const displayName = anonymous ? "Anonymous sponsor" : name
  const { nameWithoutHandle, handle } = splitPersonDisplayName(displayName)

  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/6 py-3 last:border-b-0 dark:border-white/8">
      <div className="min-w-0 flex items-center gap-3">
        <PersonAvatar name={displayName} links={links} className="shrink-0" loading="eager" fetchPriority="low" />
        <p className="truncate text-sm text-foreground">
          <span className="font-medium">{nameWithoutHandle}</span>
          {!anonymous && handle ? <span className="ml-1 text-black/45 dark:text-white/45">{handle}</span> : null}
        </p>
      </div>
      {!anonymous ? (
        <SocialLinks
          name={displayName}
          links={links}
          className="ml-3 flex shrink-0 items-center gap-1.5"
          linkClassName="text-black/45 transition-colors hover:text-black dark:text-white/45 dark:hover:text-white"
          iconClassName="h-3.5 w-3.5"
        />
      ) : null}
    </div>
  )
}

export function SponsorContent({ sponsorsGoal }: SponsorContentProps) {
  const progressValue = 85
  const progressLabel = "85%"
  const goalLabel = sponsorsGoal.goalAmountMonthly ?? "$1,500 per month"
  const socialProofSponsors = people.sponsorsActive.slice(0, 4)
  const featuredSponsor = people.sponsorsActive.find((person) => splitPersonDisplayName(person.name).handle) ?? people.sponsorsActive[0]
  const featuredSponsorParts = featuredSponsor ? splitPersonDisplayName(featuredSponsor.name) : null
  const featuredSponsorLabel = featuredSponsorParts?.handle?.replace(/^@/, "") ?? featuredSponsorParts?.nameWithoutHandle ?? null
  const otherSponsorsCount = Math.max(0, people.sponsorsActive.length - 1)
  const socialProofLabel =
    featuredSponsorLabel && otherSponsorsCount > 0
      ? `Sol PBC, Boris Mann, and ${otherSponsorsCount} others sponsor this goal`
      : featuredSponsorLabel
        ? `${featuredSponsorLabel} sponsors this goal`
        : null

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-3xl">
          <section className="w-full">
            <h1 className={marketingPageTitleClass}>
              Help keep <span className="tracking-tight">Tiles Privacy</span> independent.
            </h1>
            <div className={`mt-5 max-w-2xl space-y-4 ${marketingPageBodyClass}`}>
              <p>
                Our mission is to empower people by designing and building software that provides agency, control, and choice
                in our digital lives. We believe that privacy adoption at scale must work backwards from preserving utility.
                This means negligible impact on user experience, model intelligence, throughput, latency, tool use & agentic
                capabilities, and web access.
              </p>
              <p>
                Tiles Privacy is also a signatory to the{" "}
                <a
                  href="https://european.social/#signatories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
                >
                  European Social Stack initiative
                </a>, supporting an open, interoperable, and publicly accountable digital ecosystem for Europe.
              </p>
            </div>

            <div className="mt-8 pt-8">
              <div className="max-w-xl">
                <div className="flex items-end gap-4">
                  <p className="text-4xl font-light tracking-[-0.05em] text-foreground">{progressLabel}</p>
                  <p className="pb-1 text-sm leading-6 text-black/65 dark:text-white/65">{goalLabel}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
                  Baseline funding to support three full time contributors.
                </p>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${progressValue}%` }}
                    aria-hidden
                  />
                </div>
                {socialProofLabel ? (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      <span
                        className="inline-flex rounded-full ring-2 ring-background"
                        style={{ zIndex: socialProofSponsors.length + 1 }}
                      >
                        <Image
                          src="/sol-pbc.svg"
                          alt="Sol PBC"
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full bg-white object-contain p-0.5 ring-1 ring-black/10"
                        />
                      </span>
                      {socialProofSponsors.map((person, index) => (
                        <span
                          key={person.id}
                          className="inline-flex rounded-full ring-2 ring-background"
                          style={{ zIndex: socialProofSponsors.length - index }}
                        >
                          <PersonAvatar
                            name={person.name}
                            links={person.links}
                            className="shrink-0"
                            loading="eager"
                            fetchPriority="high"
                          />
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-black/65 dark:text-white/65">{socialProofLabel}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-10 rounded-sm bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
              >
                <a href="https://github.com/sponsors/tilesprivacy" target="_blank" rel="noopener noreferrer">
                  <span className="inline-flex items-center gap-2">
                    <FaGithub className="h-4 w-4" aria-hidden />
                    Sponsor on GitHub
                  </span>
                </a>
              </Button>
              <Button
                asChild
                className="h-10 rounded-sm bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
              >
                <a
                  href="https://opencollective.com/user-and-agents/projects/tiles-privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-flex items-center gap-2">
                    <SiOpencollective className="h-4 w-4" aria-hidden />
                    Sponsor on OpenCollective
                  </span>
                </a>
              </Button>
            </div>
            <p className={`mt-4 max-w-2xl ${marketingPageBodyClass}`}>
              You can also support us by spreading the word and keeping in touch with us 🖤
            </p>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <p className={marketingPageBodyClass}>
                We are grateful to the organizations supporting our work financially through our Partner Program on{" "}
                <a
                  href="https://opencollective.com/user-and-agents/projects/tiles-privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
                >
                  Open Collective
                </a>
                , and to everyone who has supported our projects through{" "}
                <a
                  href="https://github.com/sponsors/tilesprivacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
                >
                  GitHub Sponsors
                </a>
                .
              </p>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">Partners</p>
                  <p className="text-sm text-black/45 dark:text-white/45">1</p>
                </div>
                <a
                  href="https://solpbc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex items-center gap-3 border-y border-black/6 py-3 dark:border-white/8"
                >
                  <Image
                    src="/sol-pbc.svg"
                    alt="Sol PBC logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">Sol PBC</span>
                    <span className="mt-0.5 block text-sm text-black/45 transition-colors group-hover:text-black dark:text-white/45 dark:group-hover:text-white">
                      solpbc.org
                    </span>
                  </span>
                </a>
              </div>

              <div className="mt-8 grid gap-10 lg:grid-cols-2">
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">Current sponsors</p>
                    <p className="text-sm text-black/45 dark:text-white/45">{people.sponsorsActive.length}</p>
                  </div>
                  <div className="mt-4">
                    {people.sponsorsActive.map((person) => (
                      <SponsorPerson key={person.id} name={person.name} links={person.links} anonymous={person.anonymous} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">Past sponsors</p>
                    <p className="text-sm text-black/45 dark:text-white/45">{people.sponsorsPast.length}</p>
                  </div>
                  <div className="mt-4">
                    {people.sponsorsPast.map((person) => (
                      <SponsorPerson key={person.id} name={person.name} links={person.links} anonymous={person.anonymous} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
