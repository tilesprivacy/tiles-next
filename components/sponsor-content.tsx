'use client'
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

interface SponsorContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

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
        <PersonAvatar name={name} links={links} className="shrink-0" loading="eager" fetchPriority="low" />
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
      className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle leading-[inherit] text-foreground underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
    >
      <PersonAvatar name={name} links={links} variant="inline" className="inline-flex shrink-0" />
      <span className="font-medium leading-[inherit]">{handle ?? name}</span>
    </a>
  )
}

export function SponsorContent({ sponsorsGoal }: SponsorContentProps) {
  const progressValue = sponsorsGoal.progressPercent
    ? Math.max(0, Math.min(100, Number.parseInt(sponsorsGoal.progressPercent, 10)))
    : 20
  const progressLabel = sponsorsGoal.progressPercent ?? "20%"
  const goalLabel = sponsorsGoal.goalAmountMonthly ?? "$1,500 per month"
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
            <div className={`mt-5 max-w-2xl space-y-4 ${marketingPageBodyClass}`}>
              <p>
                We&apos;re a small independent team of three working hard to bring privacy technology to everyone, starting with Tiles, a
                local-first private AI assistant. If you like Tiles, please consider supporting our work.
              </p>
              <p>
                Your sponsorship helps accelerate Tiles&apos; development and let maintainers work on the project sustainably. Your support means a lot!
              </p>
            </div>

            <div className="mt-8 pt-8">
              <div className="max-w-xl">
                <div className="flex items-end gap-4">
                  <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">{progressLabel}</p>
                  <p className="pb-1 text-sm leading-6 text-black/65 dark:text-white/65">{goalLabel}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
                  Baseline funding to support three full-time contributors
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
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                About us
              </h2>
              <div className={`max-w-2xl space-y-4 ${marketingPageBodyClass}`}>
                <p>
                  Our mission is to empower people by designing and building software that provides agency, control, and
                  choice in our digital lives. We believe that privacy adoption at scale must work backwards from
                  preserving utility. This means negligible impact on user experience, model intelligence, throughput,
                  latency, tool use & agentic capabilities, and web access.
                </p>
                <p>
                  We’re open to consulting engagements focused on privacy-preserving products, especially those built with
                  decentralized technologies such as Iroh, DIDs/UCANs, AT Protocol, and local AI models. If you’re
                  working in this space,{" "}
                  <a
                    href="https://cal.com/feynon/chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline decoration-current/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-current dark:hover:text-white/85"
                  >
                    book a call
                  </a>{" "}
                  to discuss how we can help.
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
                  </a>
                  {", "}
                  supporting an open, interoperable, and publicly accountable digital ecosystem for Europe.
                </p>
                <p>
                  The project is currently maintained by{" "}
                  {people.contributorsCore.map((person, index) => (
                    <span key={person.id}>
                      {index > 0 ? (
                        index === people.contributorsCore.length - 1 ? (
                          <span className="align-middle leading-[inherit]">
                            {people.contributorsCore.length > 2 ? ", and " : " and "}
                          </span>
                        ) : (
                          ", "
                        )
                      ) : null}
                      <InlinePerson name={person.name} links={person.links} />
                    </span>
                  ))}
                  .
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-black/8 pt-8 dark:border-white/10">
              <p className="text-sm leading-6 text-foreground">
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
