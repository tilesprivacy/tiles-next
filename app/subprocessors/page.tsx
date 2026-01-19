'use client'

import { LegalPageWrapper } from "@/components/legal-page-wrapper"
import { LEGAL_LAST_UPDATED } from "@/lib/legal-last-updated"

export default function SubProcessorsPage() {
  return (
    <LegalPageWrapper>
      <div className="space-y-4">
        <h1>Subprocessors</h1>
        <p className="last-updated">Last updated: {LEGAL_LAST_UPDATED.subprocessors}</p>
      </div>

      <div className="space-y-4">
        <p>
          This page lists the third-party subprocessors that Tiles uses to provide our services. These subprocessors may process personal data on our behalf in connection with the operation of our website and services.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-2">
          <h3>Vercel</h3>
          <div className="space-y-1.5 text-sm sm:text-base subprocessor-value">
            <p>
              <span className="font-medium subprocessor-label">Purpose:</span> Server hosting
            </p>
            <p>
              <span className="font-medium subprocessor-label">Location:</span> US
            </p>
            <p>
              <span className="font-medium subprocessor-label">Reference:</span>{" "}
              <a
                href="https://vercel.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors"
              >
                DPA
              </a>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <h3>Resend</h3>
          <div className="space-y-1.5 text-sm sm:text-base subprocessor-value">
            <p>
              <span className="font-medium subprocessor-label">Purpose:</span> Email sending
            </p>
            <p>
              <span className="font-medium subprocessor-label">Location:</span> US
            </p>
            <p>
              <span className="font-medium subprocessor-label">Reference:</span>{" "}
              <a
                href="https://resend.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors"
              >
                DPA
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <p className="contact-info">
          We will update this page when we add or remove subprocessors. For questions about our subprocessors, please contact us through our{" "}
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
