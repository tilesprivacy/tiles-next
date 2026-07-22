import Image from "next/image"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { PersonAvatar } from "@/components/person-avatar"
import { people, splitPersonDisplayName } from "@/lib/people"

interface SponsorContentProps {
  sponsorsGoal: { goalAmountMonthly: string | null; progressPercent: string | null }
}

function SponsorList({ title, entries }: { title: string; entries: typeof people.sponsorsActive }) {
  return (
    <section className="minimal-sponsor-list">
      <div><h2>{title}</h2><span>{entries.length}</span></div>
      {entries.map((person) => {
        const isAnonymous = "anonymous" in person && person.anonymous
        const { nameWithoutHandle, handle } = splitPersonDisplayName(isAnonymous ? "Anonymous sponsor" : person.name)
        return <p key={person.id}><PersonAvatar name={person.name} links={person.links} /><span><strong>{nameWithoutHandle}</strong>{handle ? ` ${handle}` : ""}</span></p>
      })}
    </section>
  )
}

export function SponsorContent({ sponsorsGoal }: SponsorContentProps) {
  const progress = sponsorsGoal.progressPercent || "90%"
  return (
    <main className="minimal-inner-page">
      <MinimalTopbar />
      <article className="minimal-inner-content">
        <header className="minimal-page-intro">
          <p className="minimal-eyebrow">Independent and open source</p>
          <h1>Help keep Tiles Privacy independent.</h1>
          <p>Support a small team building private, local-first AI that preserves user agency.</p>
        </header>

        <section className="minimal-section minimal-sponsor-copy">
          <p>Our mission is to empower people by designing software that provides agency, control, and choice in our digital lives. Privacy adoption at scale must preserve utility, model intelligence, throughput, latency, tool use, agentic capabilities, and web access.</p>
          <p>Tiles Privacy is a signatory to the <a href="https://european.social/#signatories">European Social Stack initiative</a>, supporting an open, interoperable, and publicly accountable digital ecosystem for Europe.</p>
          <p>Tiles Privacy is built by a small independent team of three.</p>
          <div className="minimal-team">
            {people.contributorsCore.map((person) => <span key={person.id}><PersonAvatar name={person.name} links={person.links} />{splitPersonDisplayName(person.name).nameWithoutHandle}</span>)}
          </div>
        </section>

        <section className="minimal-funding">
          <div><strong>{progress}</strong><span>{sponsorsGoal.goalAmountMonthly || "$1,500 per month"}</span></div>
          <p>Baseline funding to support three full time contributors.</p>
          <div className="minimal-progress"><span style={{ width: progress }} /></div>
          <div className="minimal-sponsor-actions">
            <a className="minimal-primary-button" href="https://github.com/sponsors/tilesprivacy">Sponsor on GitHub</a>
            <a className="minimal-secondary-button" href="https://opencollective.com/user-and-agents/projects/tiles-privacy">Sponsor on Open Collective</a>
          </div>
          <p className="minimal-note">You can also support us by spreading the word and keeping in touch with us.</p>
        </section>

        <section className="minimal-section">
          <h2>Partners</h2>
          <a className="minimal-partner" href="https://solpbc.org/"><Image src="/sol-pbc.svg" alt="Sol PBC" width={44} height={44} /><span><strong>Sol PBC</strong><small>Partner Contribution Tier</small></span></a>
          <p>Financial support is administered through the <a href="https://opencollective.com/user-and-agents/projects/tiles-privacy">User & Agents Open Collective</a>, fiscally hosted by Open Source Europe. Individual supporters contribute through GitHub Sponsors.</p>
        </section>

        <div className="minimal-sponsor-grid">
          <SponsorList title="Current sponsors" entries={people.sponsorsActive} />
          <SponsorList title="Past sponsors" entries={people.sponsorsPast} />
        </div>
      </article>
    </main>
  )
}
