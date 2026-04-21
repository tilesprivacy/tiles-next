'use client'
import { SiteFooter } from "@/components/site-footer"
import { PersonAvatar } from "@/components/person-avatar"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import {
  marketingPageBodyClass,
  marketingPageLeadClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import { people, splitPersonDisplayName } from "@/lib/people"
import { FaGithub } from "react-icons/fa6"

interface SponsorContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

const SUPPORT_POINTS = [
  "Baseline funding to support two full-time contributors",
  "Helps us cover infrastructure costs for AI compute and relays",
  "Support a shared research agenda",
]

function SponsorPerson({
  name,
  links,
}: {
  name: string
  links: string[]
}) {
  const { nameWithoutHandle, handle } = splitPersonDisplayName(name)

  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/6 py-3 last:border-b-0 dark:border-white/8">
      <div className="min-w-0 flex items-center gap-3">
        <PersonAvatar name={name} links={links} className="shrink-0" />
        <p className="truncate text-sm text-foreground">
          <span className="font-medium">{nameWithoutHandle}</span>
          {handle ? <span className="ml-1 text-black/45 dark:text-white/45">{handle}</span> : null}
        </p>
      </div>
      <SocialLinks
        name={name}
        links={links}
        className="ml-3 flex shrink-0 items-center gap-1.5"
        linkClassName="text-black/45 transition-colors hover:text-black dark:text-white/45 dark:hover:text-white"
        iconClassName="h-3.5 w-3.5"
      />
    </div>
  )
}

function InlinePerson({
  name,
  links,
}: {
  name: string
  links: string[]
}) {
  const { handle } = splitPersonDisplayName(name)
  const primaryLink = links[0]

  return (
    <a
      href={primaryLink}
      target="_blank"
      rel="noopener noreferrer"
      className="relative top-[0.04em] inline-flex items-center gap-1.5 whitespace-nowrap align-baseline text-foreground underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
    >
      <PersonAvatar name={name} links={links} variant="inline" className="shrink-0" />
      <span className="font-medium">{handle ?? name}</span>
    </a>
  )
}

export function SponsorContent({ sponsorsGoal }: SponsorContentProps) {
  const progressValue = sponsorsGoal.progressPercent
    ? Math.max(0, Math.min(100, Number.parseInt(sponsorsGoal.progressPercent, 10)))
    : 28
  const progressLabel = sponsorsGoal.progressPercent ?? "28%"
  const goalLabel = sponsorsGoal.goalAmountMonthly ?? "GitHub Sponsors goal"
  const socialProofSponsors = people.sponsorsActive.slice(0, 4)
  const featuredSponsor = people.sponsorsActive.find((person) => splitPersonDisplayName(person.name).handle) ?? people.sponsorsActive[0]
  const featuredSponsorParts = featuredSponsor ? splitPersonDisplayName(featuredSponsor.name) : null
  const featuredSponsorLabel = featuredSponsorParts?.handle?.replace(/^@/, "") ?? featuredSponsorParts?.nameWithoutHandle ?? null
  const otherSponsorsCount = Math.max(0, people.sponsorsActive.length - 1)
  const socialProofLabel =
    featuredSponsorLabel && otherSponsorsCount > 0
      ? `${featuredSponsorLabel} and ${otherSponsorsCount} others sponsor this goal`
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
            <p className={`mt-5 max-w-2xl ${marketingPageLeadClass}`}>
              Tiles is built by a small team working on private, local-first software. Sponsorship helps us keep
              shipping product, maintaining infrastructure, and documenting the work in public.
            </p>

            <div className="mt-8">
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
            </div>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <div className="max-w-xl">
                <div className="flex items-end gap-4">
                  <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">{progressLabel}</p>
                  <p className="pb-1 text-sm leading-6 text-black/65 dark:text-white/65">{goalLabel}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
                  Current GitHub Sponsors progress toward the published monthly goal.
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
                      {socialProofSponsors.map((person, index) => (
                        <span
                          key={person.id}
                          className="inline-flex rounded-full ring-2 ring-background"
                          style={{ zIndex: socialProofSponsors.length - index }}
                        >
                          <PersonAvatar name={person.name} links={person.links} className="shrink-0" />
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-black/65 dark:text-white/65">{socialProofLabel}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <p className={`max-w-2xl ${marketingPageBodyClass}`}>
                Sponsorship provides baseline funding for the work already underway and helps us keep building with
                continuity.
              </p>
              <ul className="mt-5 space-y-3">
                {SUPPORT_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-base leading-7 text-foreground/88">
                    <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-foreground/60" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <div className={`max-w-2xl space-y-4 ${marketingPageBodyClass}`}>
                <div className="flex items-start gap-3">
                  <p>
                    Tiles is part of{" "}
                    <a
                      href="https://userandagents.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative top-[0.04em] inline-flex items-center gap-1.5 align-baseline text-foreground underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
                    >
                      <img
                        src="/ua-logo.svg"
                        alt="User & Agents"
                        width={14}
                        height={14}
                        className="h-3 w-auto"
                      />
                      <span>User &amp; Agents</span>
                    </a>{" "}
                    network. The shared goal is to empower people by designing and building software that provides
                    agency, control, and choice in our digital lives. We strive to deliver the best privacy-focused
                    engineering while also offering unmatched convenience in our consumer products. We believe identity
                    and memory belong together, and Tiles gives you a way to own both through your personal user agent.
                  </p>
                </div>
                <p>
                  Tiles is a long-term project. It is being built to last, with steady work on the product,
                  infrastructure, and research rather than short bursts of activity around launches.
                </p>
                  <p>
                    Right now, that work is carried by{" "}
                    <InlinePerson
                      name={people.contributorsCore[0]!.name}
                      links={people.contributorsCore[0]!.links}
                    />{" "}
                    and{" "}
                    <InlinePerson
                      name={people.contributorsCore[1]!.name}
                      links={people.contributorsCore[1]!.links}
                    />. Sponsorship helps us keep building with continuity and focus over the long run.
                  </p>
              </div>
            </div>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <p className="text-sm leading-6 text-black/60 dark:text-white/60">
                We’re grateful to the people who have supported the project so far.
              </p>
              <div className="mt-6 grid gap-10 lg:grid-cols-2">
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">Current sponsors</p>
                    <p className="text-sm text-black/45 dark:text-white/45">{people.sponsorsActive.length}</p>
                  </div>
                  <div className="mt-4">
                    {people.sponsorsActive.map((person) => (
                      <SponsorPerson key={person.id} name={person.name} links={person.links} />
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
                      <SponsorPerson key={person.id} name={person.name} links={person.links} />
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
