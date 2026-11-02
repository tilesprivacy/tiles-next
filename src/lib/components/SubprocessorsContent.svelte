<script lang="ts">
  import LegalContact from "#lib/components/LegalContact.svelte"
  import LegalPageWrapper from "#lib/components/LegalPageWrapper.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import { LEGAL_LAST_UPDATED } from "#lib/legal-last-updated"

  // Served at both /subprocessors and /sub-processors.
  const subprocessors = [
    { name: "Iroh", purpose: "Public relays for peer-to-peer networking", location: "US", dpa: "https://www.iroh.computer/legal" },
    { name: "Resend", purpose: "Email sending and newsletter list", location: "US", dpa: "https://resend.com/legal/dpa" },
    { name: "Polar", purpose: "Payment processing", location: "US", dpa: "https://polar.sh/legal/data-processing-addendum" },
    {
      name: "GitHub",
      purpose: "Source code hosting, issue tracking, and collecting sponsorships",
      location: "US",
      dpa: "https://github.com/customer-terms/github-data-protection-agreement",
    },
    { name: "Better Stack", purpose: "Infrastructure monitoring and incident management", location: "EU", dpa: "https://betterstack.com/dpa" },
    {
      name: "Cloudflare",
      purpose: "Website hosting and bot protection (Turnstile)",
      location: "US",
      dpa: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    },
  ]
</script>

<PageHeadMeta
  title="Subprocessors | Tiles"
  description="Third-party subprocessors that Tiles uses to provide services."
  imageTitle="Subprocessors"
/>

<LegalPageWrapper>
  <div class="space-y-4">
    <h1>Subprocessors</h1>
    <p class="last-updated">Last updated: {LEGAL_LAST_UPDATED.subprocessors}</p>
  </div>

  <div class="space-y-4">
    <p>
      This page lists the third-party subprocessors that Tiles uses to provide our services. These subprocessors may process personal data on our behalf in connection with the operation of our website and services.
    </p>
  </div>

  <div class="space-y-8 sm:space-y-10">
    {#each subprocessors as item (item.name)}
      <div class="space-y-2">
        <h3>{item.name}</h3>
        <div class="space-y-1.5 text-sm sm:text-base subprocessor-value">
          <p>
            <span class="font-medium subprocessor-label">Purpose:</span> {item.purpose}
          </p>
          <p>
            <span class="font-medium subprocessor-label">Location:</span> {item.location}
          </p>
          <p>
            <span class="font-medium subprocessor-label">Reference:</span>
            <a href={item.dpa} target="_blank" rel="noopener noreferrer" class="underline transition-colors">DPA</a>
          </p>
        </div>
      </div>
    {/each}
  </div>

  <LegalContact
    lead="We will update this page when we add or remove subprocessors. For questions about our subprocessors, please contact us through our"
  />
</LegalPageWrapper>
