import { isChatRoute } from "#lib/chat/links"
import { HOME_PAGE_THEME, isHomePageThemePath } from "#lib/home-page-theme"
import { OWN_YOUR_AI_PAGE_THEME, isOwnYourAiPath } from "#lib/own-your-ai-theme"
import { SPONSOR_PAGE_THEME, isSponsorPath } from "#lib/sponsor-page-theme"

// Some pages have their own look (the home page, /about, the talk pages, the
// shared-chat viewer). This is the one place that decides which, for both
// server and browser. Chat pages are told apart by route, because on
// chat.tiles.run their URL has no /chat prefix.
export function pageThemeFor(pathname: string, routeId: string | null): string | null {
  if (isChatRoute(routeId)) return "chat"
  if (isOwnYourAiPath(pathname)) return OWN_YOUR_AI_PAGE_THEME
  if (isSponsorPath(pathname)) return SPONSOR_PAGE_THEME
  if (isHomePageThemePath(pathname)) return HOME_PAGE_THEME
  return null
}
