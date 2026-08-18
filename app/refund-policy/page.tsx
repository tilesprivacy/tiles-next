'use client'

import { LegalPageWrapper } from "@/components/legal-page-wrapper"
import { LEGAL_LAST_UPDATED } from "@/lib/legal-last-updated"
import { POLAR_CUSTOMER_PORTAL_URL } from "@/lib/pricing-plans"

export default function RefundPolicyPage() {
  return (
    <LegalPageWrapper>
      <div className="space-y-4">
        <h1>Refund Policy</h1>
        <p className="last-updated">Last updated: {LEGAL_LAST_UPDATED.refunds}</p>
      </div>

      <div className="space-y-4">
        <h2>30-Day Money-Back Guarantee</h2>
        <p>
          If you are not satisfied with Tiles Pro, you may request a full refund
          of your initial subscription payment within 30 calendar days of the
          purchase date. The guarantee covers the full amount paid for that
          eligible purchase.
        </p>
      </div>

      <div className="space-y-4">
        <h2>How to Request a Refund</h2>
        <p>
          Email{" "}
          <a className="underline" href="mailto:support@tiles.run">
            support@tiles.run
          </a>{" "}
          within the 30-day period. Include the email address used at checkout
          and your Polar receipt or order number so we can locate the purchase.
          You do not need to provide a reason, although feedback is welcome.
        </p>
      </div>

      <div className="space-y-4">
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

      <div className="space-y-4">
        <h2>Renewals and Cancellations</h2>
        <p>
          The 30-day money-back guarantee applies to the initial Tiles Pro
          subscription payment and does not apply to renewal payments. You can
          cancel future renewals at any time through the{" "}
          <a
            className="underline"
            href={POLAR_CUSTOMER_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Polar customer portal
          </a>
          . Duplicate or incorrect charges will be reviewed separately.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Fair Use and Legal Rights</h2>
        <p>
          We may refuse refund requests involving fraud, abuse, or repeated use
          of the guarantee. This policy does not limit any refund or cancellation
          rights available to you under applicable law.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <p className="contact-info">
          For questions about this policy, email{" "}
          <a className="underline" href="mailto:support@tiles.run">
            support@tiles.run
          </a>
          .
        </p>
      </div>
    </LegalPageWrapper>
  )
}
