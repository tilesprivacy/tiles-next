<script lang="ts">
  import MinimalTopbar from "#lib/components/MinimalTopbar.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import SocialIcon from "#lib/components/SocialIcon.svelte"
  import SponsorList from "#lib/components/SponsorList.svelte"
  import SponsorUsdtDonateButton from "#lib/components/SponsorUsdtDonateButton.svelte"
  import { people } from "#lib/people"
</script>

<div class="minimal-product-page">
  <MinimalTopbar />
  <main class="minimal-inner-page minimal-sponsor-page">
    <article class="minimal-inner-content">
      <header class="minimal-page-intro !mb-8">
        <h1>Sponsor Tiles Privacy</h1>
        <p>
          Support a small team building private, local-first AI that
          preserves user agency.
        </p>
      </header>

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
