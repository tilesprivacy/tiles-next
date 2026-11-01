<script lang="ts">
  import LegalContact from "#lib/components/LegalContact.svelte"
  import LegalPageWrapper from "#lib/components/LegalPageWrapper.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import { LEGAL_LAST_UPDATED } from "#lib/legal-last-updated"
</script>

<PageHeadMeta
  title="Privacy Policy | Tiles"
  description="Read our Privacy Policy and how it relates to you."
  imageTitle="Privacy"
/>

<LegalPageWrapper>
  <div class="space-y-4">
    <h1>Tiles Privacy Policy</h1>
    <p class="last-updated">Last updated: {LEGAL_LAST_UPDATED.privacy}</p>
  </div>

  <div class="space-y-4">
    <p>
      Tiles Privacy is a private, local‑first AI assistant. This policy explains how Tiles Privacy handles your data across the desktop app and this website.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Your Data Stays Local</h2>
    <p>
      Tiles Privacy operates entirely on your device. All data, including your memory, preferences, and usage patterns, remains on your local machine. We do not have access to your data, and we do not collect it.
    </p>
  </div>

  <div class="space-y-4">
    <h2>No Product Tracking</h2>
    <p>
      The Tiles app does not include product analytics, telemetry, or tracking pixels. We do not monitor how you use the app or receive your prompts, responses, memories, or files.
    </p>
  </div>

  <div class="space-y-4">
    <h2>No Data Collection</h2>
    <p>
      The Tiles app does not collect, store, or transmit your personal information to us. This includes your identity, location, device information, usage statistics, and any content you create with Tiles.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Open Source Transparency</h2>
    <p>
      Tiles is open source. You can review the source code to verify our privacy claims. The codebase is publicly available and auditable.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Website Privacy</h2>
    <p>
      This website does not use analytics or tracking pixels.
    </p>
    <p>
      We do not use advertising cookies or build visitor profiles. Other preferences that you choose, such as the site theme, may also be stored locally in your browser so the website works as expected.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Newsletter</h2>
    <p>
      If you subscribe to our newsletter, we store your email address with Resend so we can send you product updates. Every newsletter includes a link to unsubscribe, and once you unsubscribe we do not subscribe you again unless you ask.
    </p>
    <p>
      To stop automated abuse of the signup form, Cloudflare Turnstile checks that the request comes from a person, and we keep one-way hashes of your email address and IP address in Upstash for up to 30 days. These hashes cannot be turned back into your address and are used only to limit how often the form can be used.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Giveaway Applications</h2>
    <p>
      If you submit a giveaway application, we collect the information you provide in the form, such as your name, email address, GitHub profile, OSDC affiliation and relationship, hardware specifications, devices and operating systems, and application track. Travel-grant applications also collect your age, phone number, gender as shown on your travel ID, preferred flight details, and a UPI ID or UPI-linked phone number. We use this information only to review your application, verify eligibility, administer the giveaway and travel grant, and contact you about the result.
    </p>
    <p>
      Giveaway applications are delivered through Resend to Tiles Privacy and may be reviewed with the named giveaway partner. Submitting a giveaway application does not subscribe you to marketing emails.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Your Control</h2>
    <p>
      You have complete control over your data. You can delete it at any time, export it, or stop using Tiles entirely. Your data belongs to you.
    </p>
  </div>

  <LegalContact lead="For questions about privacy, please contact us through our" />
</LegalPageWrapper>
