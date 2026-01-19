'use client'

import { LegalPageWrapper } from "@/components/legal-page-wrapper"
import { LEGAL_LAST_UPDATED } from "@/lib/legal-last-updated"

export default function TermsPage() {
  return (
    <LegalPageWrapper>
      <div className="space-y-4">
        <h1>Terms of Use</h1>
        <p className="last-updated">Last updated: {LEGAL_LAST_UPDATED.terms}</p>
      </div>

      <div className="space-y-4">
        <h2>Acceptance of Terms</h2>
        <p>
          By using Tiles, you agree to these Terms of Use. If you do not agree, please do not use Tiles.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Privacy-First Design</h2>
        <p>
          Tiles is designed with privacy as a core principle. Your data remains on your device. We do not collect, store, or transmit your personal information or usage data to our servers.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Open Source License</h2>
        <p>
          Tiles is open source software. The source code is available under its respective license. You are free to use, modify, and distribute Tiles in accordance with that license.
        </p>
      </div>

      <div className="space-y-4">
        <h2>No Warranty</h2>
        <p>
          Tiles is provided "as is" without warranty of any kind. We make no guarantees about its functionality, reliability, or suitability for any purpose.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any damages arising from your use of Tiles.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of Tiles after changes constitutes acceptance of the updated terms.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <p className="contact-info">
          For questions about these terms, please contact us through our{" "}
          <a
            href="https://github.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
          {" "}or{" "}
          <a
            href="https://go.tiles.run/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Discord
          </a>
          .
        </p>
      </div>
    </LegalPageWrapper>
  )
}
