'use client'

import { OPEN_ANALYTICS_CONSENT_EVENT } from '@/lib/analytics-consent'

export function AnalyticsChoicesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_ANALYTICS_CONSENT_EVENT))}
    >
      Analytics choices
    </button>
  )
}
