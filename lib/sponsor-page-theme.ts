export const SPONSOR_PAGE_THEME = "sponsor"
export const SPONSOR_PATH = "/sponsor"

export function isSponsorForceDarkPath(
  pathname: string | null | undefined,
): boolean {
  return (
    pathname === SPONSOR_PATH ||
    pathname?.startsWith(`${SPONSOR_PATH}/`) === true
  )
}
