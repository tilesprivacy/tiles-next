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
        <h2>No Product Tracking</h2>
        <p>
          The Tiles app does not include product analytics, telemetry, or tracking pixels. We do not monitor how you use the app or receive your prompts, responses, memories, or files.
        </p>
      </div>

      <div className="space-y-4">
        <h2>No Data Collection</h2>
        <p>
          The Tiles app does not collect, store, or transmit your personal information to us. This includes your identity, location, device information, usage statistics, and any content you create with Tiles.
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
          If you select Accept in our analytics notice, we use Vercel Web Analytics to understand aggregate website traffic and improve our marketing, book, and blog pages. It may process the page visited, referrer, approximate country, browser, operating system, and device type. Vercel Web Analytics does not use cookies, does not store your IP address, and does not track you across websites or days. It never receives information about your activity in the Tiles app.
        </p>
        <p>
          Before you accept, or after you reject or withdraw consent, the analytics script does not run. We store your analytics choice in your browser for up to six months so we can respect it. You can change that choice at any time using Analytics choices in the website footer.
        </p>
        <p>
          We do not use advertising cookies or build visitor profiles. Other preferences that you choose, such as the site theme, may also be stored locally in your browser so the website works as expected.
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
