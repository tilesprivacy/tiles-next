<script lang="ts">
  import MinimalTopbar from "#lib/components/MinimalTopbar.svelte"
  import PersonAvatar from "#lib/components/PersonAvatar.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import SocialIcon from "#lib/components/SocialIcon.svelte"
  import SponsorList from "#lib/components/SponsorList.svelte"
  import SponsorUsdtDonateButton from "#lib/components/SponsorUsdtDonateButton.svelte"
  import { people, splitPersonDisplayName } from "#lib/people"
  import { sponsorPageAdvisors } from "#lib/sponsor-page-people"

  const aboutTeam = [
    {
      name: "Ankesh Bharti",
      employmentType: "FTE",
      username: "@feynon",
      role: "CEO & Founder",
      href: "https://ankeshbharti.com",
      links: ["https://ankeshbharti.com", "https://github.com/feynon"],
    },
    {
      name: "Prashant Mishra",
      employmentType: "FTE",
      username: "@primalpimmy",
      role: "CTO",
      href: "https://pimtron.dev",
      links: ["https://pimtron.dev"],
    },
    {
      name: "Anandu Pavanan",
      employmentType: "FTE",
      username: "@madclaws",
      role: "Member of Technical Staff",
      href: "https://github.com/madclaws",
      links: ["https://github.com/madclaws"],
    },
    {
      name: "Lakshita Arora",
      employmentType: "FTE",
      username: "@lexoskeletal",
      role: "Product & Brand Designer",
      href: "https://www.behance.net/lexoskeletal",
      links: ["https://github.com/lexoskeletal"],
    },
    {
      name: "Harsh Sharma",
      employmentType: "Part Time",
      username: "@codelif",
      role: "Paid Open Source Contributor",
      href: "https://codelif.in/",
      links: ["https://github.com/codelif"],
    },
    {
      name: "Rishvik Pandra",
      employmentType: "Part Time",
      username: "@rishvikpandra",
      role: "Governance, Risk and Compliance Consultant",
      href: "https://www.linkedin.com/in/rishvikpandra",
      links: ["https://www.linkedin.com/in/rishvikpandra"],
    },
  ]
</script>

<div class="minimal-product-page">
  <MinimalTopbar />
  <main class="minimal-inner-page minimal-sponsor-page">
    <article class="minimal-inner-content">
      <header class="minimal-page-intro !mb-8">
        <h1>About Tiles Privacy</h1>
      </header>

      <section class="minimal-section minimal-about-copy">
        <p>
          Our mission is to build software that gives people greater
          agency, control, and choice in their digital lives. We believe
          that privacy adoption at scale must work backwards from
          preserving utility. This means negligible impact on user
          experience, model intelligence, agentic capabilities, and web
          access.
        </p>
        <p>
          We’re proud to be one of three anchor projects in the
          <span class="whitespace-nowrap"
            ><img
              src="/mozilla-foundation-logo.svg"
              alt=""
              width="14"
              height="14"
              loading="lazy"
              decoding="async"
              class="relative -top-0.5 mr-1 inline-block h-3.5 w-3.5 object-cover object-left align-text-bottom dark:hidden"
            /><img
              src="/mozilla-foundation-logo-dark.svg"
              alt=""
              width="14"
              height="14"
              loading="lazy"
              decoding="async"
              class="relative -top-0.5 mr-1 hidden h-3.5 w-3.5 object-cover object-left align-text-bottom dark:inline-block"
            />Mozilla Foundation’s</span
          >
          new
          <a href="https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/" class="!inline"
            >Human-Scale AI incubator cohort</a
          >, backed by $300,000 in non-dilutive funding to help advance our
          mission.
        </p>
        <p>
          Tiles was born from the discussions in
          <a href="https://www.userandagents.org" class="whitespace-nowrap"
            ><img
              src="/user-and-agents.png"
              alt="User & Agents logo"
              width="16"
              height="16"
              loading="lazy"
              decoding="async"
              class="mr-1 inline-block h-4 w-4 rounded-[3px] align-text-bottom"
            />User &amp; Agents</a
          >, a community focused on shaping the future of user-agent
          systems. We are also a signatory to the
          <a href="https://european.social/#signatories">European Social Stack initiative</a>, supporting an open, interoperable, and publicly accountable
          digital ecosystem for Europe.
        </p>
        <p>We’re a small independent team based out of Bengaluru, India.</p>
      </section>

      <section id="team" class="minimal-section minimal-team-section scroll-mt-28">
        <div class="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
          <h2>Team</h2>
          <span>{aboutTeam.length}</span>
        </div>
        <figure class="mb-8 overflow-hidden rounded-xl sm:mb-10">
          <img
            src="/team.webp"
            alt="The five members of the Tiles Privacy team standing together outdoors."
            width="1600"
            height="1200"
            loading="lazy"
            decoding="async"
            class="h-auto w-full"
          />
        </figure>
        <div class="space-y-8">
          {#each ["FTE", "Part Time"] as employmentType (employmentType)}
            <section aria-label={employmentType}>
              <h3 class="mb-4 text-sm font-medium">{employmentType}</h3>
              <div class="minimal-team !mt-0">
                {#each aboutTeam.filter((person) => person.employmentType === employmentType) as person (person.username)}
                  <a href={person.href} target="_blank" rel="noopener noreferrer">
                    <PersonAvatar name={person.name} links={person.links} />
                    <span class="minimal-team-identity">
                      <span class="minimal-team-name"
                        ><span class="minimal-team-name-link">{person.name}</span> <small>{person.username}</small></span
                      >
                      <span class="minimal-team-role">{person.role}</span>
                    </span>
                  </a>
                {/each}
              </div>
            </section>
          {/each}
        </div>
      </section>

      <section id="advisors" class="minimal-section minimal-advisors-section scroll-mt-28">
        <div class="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
          <h2>Advisors</h2>
          <span>{sponsorPageAdvisors.length}</span>
        </div>
        <div class="minimal-advisors-grid">
          {#each sponsorPageAdvisors as advisor (advisor.id)}
            {@const { nameWithoutHandle, handle } = splitPersonDisplayName(advisor.name)}
            <article class="minimal-advisor-card">
              <a class="minimal-advisor-profile" href={advisor.links[0]} target="_blank" rel="noopener noreferrer">
                <PersonAvatar name={advisor.name} links={advisor.links} className="minimal-advisor-avatar" />
                <span
                  ><strong>{nameWithoutHandle}</strong>{#if handle}<small>{handle}</small>{/if}</span
                >
              </a>
              <ul>
                {#each advisor.roles as role (role)}
                  <li>{role}</li>
                {/each}
              </ul>
            </article>
          {/each}
        </div>
      </section>

      <section id="sponsor" class="minimal-page-intro minimal-sponsor-cta-intro scroll-mt-28">
        <h2>Sponsor Tiles Privacy</h2>
        <p>
          Support a small team building private, local-first AI that
          preserves user agency.
        </p>
      </section>

      <section class="minimal-sponsor-funding-band">
        <div class="minimal-funding">
          <div class="flex-wrap"><strong>$1,320/month</strong><span>in recurring sponsorship</span></div>
          <div class="minimal-sponsor-actions">
            <a class="minimal-primary-button" href="https://github.com/sponsors/tilesprivacy"
              ><SocialIcon type="github" className="minimal-sponsor-button-icon" />Sponsor on GitHub</a
            >
            <SponsorUsdtDonateButton />
          </div>
          <p class="minimal-note">
            Our <a href="/book/finances">finances are open</a>: we
            publish what we earn and what we spend every month.
          </p>
        </div>
      </section>

      <p class="minimal-partner-intro">
        We are grateful to the individuals and organizations who support
        our work financially, including through
        <a href="https://github.com/sponsors/tilesprivacy">GitHub Sponsors</a>
        and cryptocurrency donations.
      </p>

      <div class="minimal-sponsor-grid">
        <SponsorList title="Current sponsors" entries={people.sponsorsActive} />
        <SponsorList title="Past sponsors" entries={people.sponsorsPast} />
      </div>
    </article>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
