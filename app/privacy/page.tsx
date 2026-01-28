'use client'

import { LegalPageWrapper } from "@/components/legal-page-wrapper"
import { LEGAL_LAST_UPDATED } from "@/lib/legal-last-updated"

export default function PrivacyPage() {
  return (
    <LegalPageWrapper>
      <div className="space-y-4">
        <h1>Tiles Privacy Policy</h1>
        <p className="last-updated">Last updated: {LEGAL_LAST_UPDATED.privacy}</p>
      </div>

      <div className="space-y-4">
        <p>
          Tiles Privacy is a private, local‑first AI assistant. This policy explains how Tiles Privacy handles your data across the desktop app and this website.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Your Data Stays Local</h2>
        <p>
          Tiles Privacy operates entirely on your device. All data, including your memory, preferences, and usage patterns, remains on your local machine. We do not have access to your data, and we do not collect it.
        </p>
      </div>

      <div className="space-y-4">
        <h2>No Tracking</h2>
        <p>
          We do not track your usage, collect analytics, or monitor your behavior. Tiles does not include any telemetry, tracking pixels, or analytics services.
        </p>
      </div>

      <div className="space-y-4">
        <h2>No Data Collection</h2>
        <p>
          We do not collect, store, or transmit any personal information. This includes but is not limited to: your identity, location, device information, usage statistics, or any content you create with Tiles.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Open Source Transparency</h2>
        <p>
          Tiles is open source. You can review the source code to verify our privacy claims. The codebase is publicly available and auditable.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Website Privacy</h2>
        <p>
          This website may use standard web technologies like cookies for basic functionality. We do not use third-party analytics or advertising services. We do not track visitors across sites or build profiles of visitors.
        </p>
      </div>

      <div className="space-y-4">
        <h2>Your Control</h2>
        <p>
          You have complete control over your data. You can delete it at any time, export it, or stop using Tiles entirely. Your data belongs to you.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <p className="contact-info">
          For questions about privacy, please contact us through our{" "}
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
