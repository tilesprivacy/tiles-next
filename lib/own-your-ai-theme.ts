export const OWN_YOUR_AI_PAGE_THEME = "own-your-ai"
export const OWN_YOUR_AI_PATH = "/blog/own-your-ai"
export const OWN_YOUR_AI_DRAFT_PATH = "/blog/drafts/own-your-ai"
export const INDIA_FOSS_2026_PATH = "/india-foss-2026"

export function isOwnYourAiPath(pathname: string | null | undefined): boolean {
  return (
    pathname === OWN_YOUR_AI_PATH ||
    pathname?.startsWith(`${OWN_YOUR_AI_PATH}/`) === true ||
    pathname === INDIA_FOSS_2026_PATH ||
    pathname?.startsWith(`${INDIA_FOSS_2026_PATH}/`) === true ||
    pathname === OWN_YOUR_AI_DRAFT_PATH ||
    pathname?.startsWith(`${OWN_YOUR_AI_DRAFT_PATH}/`) === true
  )
}
