export const HOME_PAGE_THEME = "home"
export const HOME_PATH = "/"

export function isHomePageThemePath(
  pathname: string | null | undefined,
): boolean {
  return pathname === HOME_PATH
}
