export const ANALYTICS_CONSENT_STORAGE_KEY = 'tiles-analytics-consent-v1'
export const OPEN_ANALYTICS_CONSENT_EVENT = 'tiles:open-analytics-consent'

export type AnalyticsConsentChoice = 'accepted' | 'rejected'

type StoredAnalyticsConsent = {
  choice: AnalyticsConsentChoice
  expiresAt: number
}

const ANALYTICS_CONSENT_DURATION_MS = 1000 * 60 * 60 * 24 * 180

let runtimeChoice: AnalyticsConsentChoice | null = null

function isConsentChoice(value: unknown): value is AnalyticsConsentChoice {
  return value === 'accepted' || value === 'rejected'
}

export function readAnalyticsConsent(): AnalyticsConsentChoice | null {
  if (typeof window === 'undefined') return null

  try {
    const rawConsent = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
    if (!rawConsent) return runtimeChoice

    const storedConsent = JSON.parse(rawConsent) as Partial<StoredAnalyticsConsent>
    if (!isConsentChoice(storedConsent.choice) || typeof storedConsent.expiresAt !== 'number') {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
      runtimeChoice = null
      return null
    }

    if (storedConsent.expiresAt <= Date.now()) {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
      runtimeChoice = null
      return null
    }

    runtimeChoice = storedConsent.choice
    return storedConsent.choice
  } catch {
    return runtimeChoice
  }
}

export function storeAnalyticsConsent(choice: AnalyticsConsentChoice) {
  runtimeChoice = choice

  if (typeof window === 'undefined') return

  try {
    const storedConsent: StoredAnalyticsConsent = {
      choice,
      expiresAt: Date.now() + ANALYTICS_CONSENT_DURATION_MS,
    }
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(storedConsent))
  } catch {
    // Keep the choice for this page view when browser storage is unavailable.
  }
}

export function hasAnalyticsConsent() {
  return readAnalyticsConsent() === 'accepted'
}
