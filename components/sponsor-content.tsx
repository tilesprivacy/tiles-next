import Image from "next/image"
import Link from "next/link"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { PersonAvatar } from "@/components/person-avatar"
import { SiteFooter } from "@/components/site-footer"
import { SocialIcon } from "@/components/social-links"
import { SponsorUsdtDonateButton } from "@/components/sponsor-usdt-donate-button"
import { people, splitPersonDisplayName } from "@/lib/people"

interface SponsorContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

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
    : "95%"
  return (
    <div className="minimal-product-page">
      <MinimalTopbar />
      <main className="minimal-inner-page minimal-sponsor-page">
        <article className="minimal-inner-content">
          <header className="minimal-page-intro !mb-8">
            <h1>Help keep Tiles Privacy independent.</h1>
            <p>
              Support a small team building private, local-first AI that
              preserves user agency.
            </p>
          </header>

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

          <section className="minimal-section minimal-sponsor-copy">
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
            <div className="minimal-team">
              {people.contributorsCore.map((person) => {
                const { nameWithoutHandle } = splitPersonDisplayName(
                  person.name,
                )
                const teamProfile = {
                  "ankesh-bharti": {
                    username: "@feynon",
                    href: "https://ankeshbharti.com",
                  },
                  "anandu-pavanan": {
                    username: "@madclaws",
                    href: "https://github.com/madclaws",
                  },
                  "prashant-mishra": {
                    username: "@primalpimmy",
                    href: "https://pimtron.dev",
                  },
                }[person.id]
                return (
                  <a
                    key={person.id}
                    href={teamProfile?.href ?? person.links[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PersonAvatar name={person.name} links={person.links} />
                    <span>
                      {nameWithoutHandle} <small>{teamProfile?.username}</small>
                    </span>
                  </a>
                )
              })}
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
            <a className="minimal-partner" href="https://solpbc.org/">
              <Image src="/sol-pbc.svg" alt="Sol PBC" width={44} height={44} />
              <span>
                <strong className="font-normal">Sol PBC</strong>
                <small>solpbc.org</small>
              </span>
            </a>
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
