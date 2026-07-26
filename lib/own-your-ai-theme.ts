export const OWN_YOUR_AI_PAGE_THEME = "own-your-ai"
export const OWN_YOUR_AI_PATH = "/blog/own-your-ai"

export function isOwnYourAiPath(pathname: string | null | undefined): boolean {
  return pathname === OWN_YOUR_AI_PATH || pathname?.startsWith(`${OWN_YOUR_AI_PATH}/`) === true
}
