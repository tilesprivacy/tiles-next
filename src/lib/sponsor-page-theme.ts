export const SPONSOR_PAGE_THEME = "sponsor"
export const SPONSOR_PATH = "/sponsor"

// About and Sponsor retain the same light/dark palette.
export function isSponsorPath(
  pathname: string | null | undefined,
): boolean {
  return ["/about", SPONSOR_PATH].some(
    (path) => pathname === path || pathname?.startsWith(`${path}/`) === true,
  )
}
