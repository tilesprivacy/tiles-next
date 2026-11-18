<script lang="ts">
  import { ChevronDown, Landmark } from "@lucide/svelte"
  import { siPaypal, siWise } from "simple-icons"
  import MinimalTopbar from "#lib/components/MinimalTopbar.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import SocialIcon from "#lib/components/SocialIcon.svelte"
  import SponsorBankTransferPanel from "#lib/components/SponsorBankTransferPanel.svelte"
  import SponsorList from "#lib/components/SponsorList.svelte"
  import SponsorUsdtDonateButton from "#lib/components/SponsorUsdtDonateButton.svelte"
  import { people } from "#lib/people"

  const paymentLinks = [
    { name: "PayPal", href: "https://www.paypal.me/tilesprivacy", icon: siPaypal },
    { name: "Wise", href: "https://wise.com/pay/business/tilesprivacytechnologiespvtltd", icon: siWise },
  ]

  let expanded = $state<"usdt" | "bank" | null>(null)

  function toggle(method: "usdt" | "bank") {
    expanded = expanded === method ? null : method
  }
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
              ><SocialIcon type="github" className="minimal-sponsor-button-icon" />GitHub Sponsors</a
            >
            <SponsorUsdtDonateButton open={expanded === "usdt"} ontoggle={() => toggle("usdt")} />
            {#each paymentLinks as { name, href, icon } (href)}
              <a class="minimal-secondary-button" {href}>
                <svg class="minimal-sponsor-button-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={icon.path} />
                </svg>
                {name}
              </a>
            {/each}
            <button
              type="button"
              class="minimal-secondary-button minimal-wallet-toggle"
              onclick={() => toggle("bank")}
              aria-expanded={expanded === "bank"}
              aria-controls="sponsor-bank-panel"
            >
              <Landmark class="minimal-sponsor-button-icon" aria-hidden="true" />
              Bank Transfers
              <ChevronDown class="minimal-wallet-toggle-chevron" data-open={expanded === "bank"} aria-hidden="true" />
            </button>
            <SponsorBankTransferPanel open={expanded === "bank"} />
          </div>
          <p class="minimal-note">
            Our <a href="/book/finances">finances are open</a>: we
            publish what we earn and what we spend every month.
          </p>
        </div>
      </section>

      <p class="minimal-partner-intro">
        We are grateful to the individuals and organizations who support our work financially.
      </p>

      <div class="minimal-sponsor-grid">
        <SponsorList title="Current sponsors" entries={people.sponsorsActive} />
        <SponsorList title="Past sponsors" entries={people.sponsorsPast} />
      </div>
    </article>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
