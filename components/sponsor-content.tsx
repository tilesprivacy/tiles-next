import Image from "next/image"
import Link from "next/link"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { PersonAvatar } from "@/components/person-avatar"
import { SiteFooter } from "@/components/site-footer"
import { SocialIcon } from "@/components/social-links"
import { SponsorUsdtDonateButton } from "@/components/sponsor-usdt-donate-button"
import { people, splitPersonDisplayName } from "@/lib/people"
import { solPbcPartner } from "@/lib/sponsor-partners"
import { sponsorPageAdvisors } from "@/lib/sponsor-page-people"
import { SPONSORS_PROGRESS_PERCENT_FALLBACK } from "@/lib/sponsors-goal"

interface SponsorContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

const aboutTeam = [
  {
    name: "Ankesh Bharti",
    username: "@feynon",
    role: "CEO & Founder",
    href: "https://ankeshbharti.com",
    links: [
      "https://ankeshbharti.com",
      "https://github.com/feynon",
    ],
  },
  {
    name: "Prashant Mishra",
    username: "@primalpimmy",
    role: "CTO",
    href: "https://pimtron.dev",
    links: ["https://pimtron.dev"],
  },
  {
    name: "Anandu Pavanan",
    username: "@madclaws",
    role: "Member of Technical Staff",
    href: "https://github.com/madclaws",
    links: ["https://github.com/madclaws"],
  },
  {
    name: "Lakshita Arora",
    username: "@lexoskeletal",
    role: "Head of Design",
    href: "https://github.com/lexoskeletal",
    links: ["https://github.com/lexoskeletal"],
  },
  {
    name: "Harsh Sharma",
    username: "@codelif",
    role: "Paid Open Source Contributor",
    href: "https://github.com/codelif",
    links: ["https://github.com/codelif"],
  },
]

function SponsorList({
  title,
  entries,
}: {
  title: string
  entries: typeof people.sponsorsActive
}) {
  return (
    <section className="minimal-sponsor-list">
      <div className="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
        <h2>{title}</h2>
        <span>{entries.length}</span>
      </div>
      {entries.map((person) => {
        const isAnonymous = "anonymous" in person && person.anonymous
        const { nameWithoutHandle, handle } = splitPersonDisplayName(
          isAnonymous ? "Anonymous sponsor" : person.name,
        )
        return (
          <div key={person.id} className="minimal-sponsor-row !m-0 flex !min-h-11 items-center !py-4">
            <span className="minimal-sponsor-person flex w-full min-w-0 items-center !gap-3">
              <PersonAvatar
                name={person.name}
                links={person.links}
                className="minimal-sponsor-avatar"
              />
              <span className="minimal-sponsor-name inline-flex min-w-0 flex-1 items-baseline !gap-1 overflow-hidden text-ellipsis whitespace-nowrap leading-tight">
                <strong className="truncate">{nameWithoutHandle}</strong>
              </span>
              {handle ? (
                <small className="minimal-sponsor-handle max-w-[44%] shrink-0 truncate text-right">
                  <span
                    aria-hidden="true"
                    className="before:content-['@']"
                  >
                    {handle.slice(1)}
                  </span>
                  <span className="sr-only">Handle {handle.slice(1)}</span>
                </small>
              ) : null}
            </span>
          </div>
        )
      })}
    </section>
  )
}

export function SponsorContent({ sponsorsGoal }: SponsorContentProps) {
  const progress = sponsorsGoal.progressPercent
    ? `${sponsorsGoal.progressPercent.replace(/%$/, "")}%`
    : SPONSORS_PROGRESS_PERCENT_FALLBACK
  return (
    <div className="minimal-product-page">
      <MinimalTopbar />
      <main className="minimal-inner-page minimal-sponsor-page">
        <article className="minimal-inner-content">
          <header className="minimal-page-intro !mb-8">
            <h1>About Tiles Privacy</h1>
          </header>

          <section className="minimal-section minimal-about-copy">
            <p>
              Our mission is to build software that gives people greater
              agency, control, and choice in their digital lives. We believe
              that privacy adoption at scale must work backwards from
              preserving utility. This means negligible impact on user
              experience, model intelligence, throughput, latency, tool use
              &amp; agentic capabilities, and web access.
            </p>
            <p>
              Tiles was born from the discussions in{" "}
              <a
                href="https://www.userandagents.org"
                className="whitespace-nowrap"
              >
                <Image
                  src="/user-and-agents.png"
                  alt="User & Agents logo"
                  width={16}
                  height={16}
                  className="mr-1 inline-block h-4 w-4 rounded-[3px] align-text-bottom"
                />
                User &amp; Agents
              </a>
              , a community focused on shaping the future of user-agent
              systems. We are also a signatory to the{" "}
              <a href="https://european.social/#signatories">
                European Social Stack initiative
              </a>
              , supporting an open, interoperable, and publicly accountable
              digital ecosystem for Europe.
            </p>
            <p>We’re a small independent team based out of Bengaluru, India.</p>
          </section>

          <section
            id="team"
            className="minimal-section minimal-team-section scroll-mt-28"
          >
            <div className="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
              <h2>Team</h2>
              <span>{aboutTeam.length}</span>
            </div>
            <div className="minimal-team !mt-0">
              {aboutTeam.map((person) => (
                <a
                  key={person.username}
                  href={person.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PersonAvatar name={person.name} links={person.links} />
                  <span className="minimal-team-identity">
                    <span className="minimal-team-name">
                      {person.name} <small>{person.username}</small>
                    </span>
                    <span className="minimal-team-role">{person.role}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section
            id="advisors"
            className="minimal-section minimal-advisors-section scroll-mt-28"
          >
            <div className="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
              <h2>Advisors</h2>
              <span>{sponsorPageAdvisors.length}</span>
            </div>
            <div className="minimal-advisors-grid">
              {sponsorPageAdvisors.map((advisor) => {
                const { nameWithoutHandle, handle } = splitPersonDisplayName(
                  advisor.name,
                )
                return (
                  <article key={advisor.id} className="minimal-advisor-card">
                    <a
                      className="minimal-advisor-profile"
                      href={advisor.links[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PersonAvatar
                        name={advisor.name}
                        links={advisor.links}
                        className="minimal-advisor-avatar"
                      />
                      <span>
                        <strong>{nameWithoutHandle}</strong>
                        {handle ? <small>{handle}</small> : null}
                      </span>
                    </a>
                    <ul>
                      {advisor.roles.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </section>

          <section
            id="sponsor"
            className="minimal-page-intro minimal-sponsor-cta-intro scroll-mt-28"
          >
            <h2>Sponsor Tiles Privacy</h2>
            <p>
              Support a small team building private, local-first AI that
              preserves user agency.
            </p>
          </section>

          <section className="minimal-sponsor-funding-band">
            <div className="minimal-funding">
              <div>
                <strong>{progress}</strong>
                <span>
                  {sponsorsGoal.goalAmountMonthly || "$1,500 per month"}
                </span>
              </div>
              <p>Baseline funding to support three full time contributors.</p>
              <div className="minimal-progress">
                <span style={{ width: progress }} />
              </div>
              <div className="minimal-sponsor-actions">
                <a
                  className="minimal-primary-button"
                  href="https://github.com/sponsors/tilesprivacy"
                >
                  <SocialIcon
                    type="github"
                    className="minimal-sponsor-button-icon"
                  />
                  Sponsor on GitHub
                </a>
                <SponsorUsdtDonateButton />
              </div>
              <p className="minimal-note">
                Our <Link href="/book/finances">finances are open</Link>: we
                publish what we earn and what we spend every month.
              </p>
            </div>
          </section>

          <p className="minimal-partner-intro">
            We are grateful to the organizations supporting our work financially
            through our Partner Program, and to everyone who has supported our
            project through{" "}
            <a href="https://github.com/sponsors/tilesprivacy">
              GitHub Sponsors
            </a>{" "}
            and cryptocurrency donations.
          </p>

          <section className="minimal-section minimal-partners-section">
            <div className="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
              <h2>Partners</h2>
              <span>1</span>
            </div>
            <div className="minimal-partner minimal-partner-profile">
              <a
                className="minimal-partner-company"
                href={solPbcPartner.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/sol-pbc.svg" alt="" width={44} height={44} />
                <span>
                  <strong className="font-normal">{solPbcPartner.name}</strong>
                  <small>solpbc.org</small>
                </span>
              </a>
              <a
                className="minimal-partner-founder-profile"
                href={solPbcPartner.founderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PersonAvatar
                  name={solPbcPartner.founderName}
                  links={[solPbcPartner.founderUrl]}
                  className="minimal-partner-founder-avatar"
                />
                <span className="minimal-partner-founder-copy">
                  <span className="minimal-partner-founder-identity">
                    <strong>{solPbcPartner.founderName}</strong>
                    <small>{solPbcPartner.founderHandle}</small>
                  </span>
                  <small className="minimal-partner-founder-role">
                    {solPbcPartner.founderRole}
                  </small>
                </span>
              </a>
            </div>
          </section>

          <div className="minimal-sponsor-grid">
            <SponsorList
              title="Current sponsors"
              entries={people.sponsorsActive}
            />
            <SponsorList title="Past sponsors" entries={people.sponsorsPast} />
          </div>
        </article>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
