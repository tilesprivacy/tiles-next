export const INDIAFOSS_GIVEAWAY_ARCHIVE = {
  sectionTitle: 'Community building',
  eventTitle: 'IndiaFOSS 2026 giveaway',
  summary:
    'Tiles Privacy and Solstone ran an IndiaFOSS 2026 giveaway for OSDC members. Ten selected applicants received conference tickets and swag, and five also received a US$100 travel grant.',
  posterPath: '/indiafoss-2026-giveaway.png',
  formPath: '/indiafoss-2026-giveaway',
} as const

export function getIndiaFossGiveawayArchiveLines(baseUrl: string): string[] {
  return [
    `${INDIAFOSS_GIVEAWAY_ARCHIVE.eventTitle}: ${INDIAFOSS_GIVEAWAY_ARCHIVE.summary}`,
    `Poster: ${baseUrl}${INDIAFOSS_GIVEAWAY_ARCHIVE.posterPath}`,
    `Archived form: ${baseUrl}${INDIAFOSS_GIVEAWAY_ARCHIVE.formPath}`,
  ]
}
