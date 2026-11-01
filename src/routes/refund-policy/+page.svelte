<script lang="ts">
  import LegalPageWrapper from "#lib/components/LegalPageWrapper.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import { LEGAL_LAST_UPDATED } from "#lib/legal-last-updated"
  import { POLAR_CUSTOMER_PORTAL_URL } from "#lib/pricing-plans"
</script>

<PageHeadMeta
  title="Refund Policy | Tiles"
  description="Read the Tiles Refund Policy and 7-day money-back guarantee for Tiles Pro."
  imageTitle="Refund Policy"
/>

<LegalPageWrapper>
  <div class="space-y-4">
    <h1>Refund Policy</h1>
    <p class="last-updated">Last updated: {LEGAL_LAST_UPDATED.refunds}</p>
  </div>

  <div class="space-y-4">
    <h2>7-Day Money-Back Guarantee</h2>
    <p>
      If you are not satisfied with Tiles Pro, you may request a full refund
      of your initial subscription payment within 7 calendar days of the
      purchase date. The guarantee covers the full amount paid for that
      eligible purchase.
    </p>
  </div>

  <div class="space-y-4">
    <h2>How to Request a Refund</h2>
    <p>
      Email
      <a class="underline" href="mailto:support@tiles.run">support@tiles.run</a>
      within the 7-day period. Include the email address used at checkout
      and your Polar receipt or order number so we can locate the purchase.
      You do not need to provide a reason, although feedback is welcome.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Refund Processing</h2>
    <p>
      Approved refunds are returned to the original payment method. Your
      bank or payment provider may take additional time to show the refund
      after it has been issued.
    </p>
    <p>
      We will cancel the related subscription and revoke its Tiles Pro
      license key and hosted benefits. You can continue using the free and
      local features of Tiles.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Renewals and Cancellations</h2>
    <p>
      The 7-day money-back guarantee applies to the initial Tiles Pro
      subscription payment and does not apply to renewal payments. You can
      cancel future renewals at any time through the
      <a class="underline" href={POLAR_CUSTOMER_PORTAL_URL} target="_blank" rel="noopener noreferrer">Polar customer portal</a>.
      Duplicate or incorrect charges will be reviewed separately.
    </p>
  </div>

  <div class="space-y-4">
    <h2>Fair Use and Legal Rights</h2>
    <p>
      We may refuse refund requests involving fraud, abuse, or repeated use
      of the guarantee. This policy does not limit any refund or cancellation
      rights available to you under applicable law.
    </p>
  </div>

  <div class="space-y-4 pt-4">
    <p class="contact-info">
      For questions about this policy, email
      <a class="underline" href="mailto:support@tiles.run">support@tiles.run</a>.
    </p>
  </div>
</LegalPageWrapper>
