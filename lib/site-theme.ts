/** User-selectable themes stored in `tiles-theme` (plus `system` when enabled). */
export const CYBERPUNK_THEME = "cyberpunk" as const

export const SITE_THEMES = ["light", "dark", CYBERPUNK_THEME] as const

export type SiteThemeName = (typeof SITE_THEMES)[number]

/** next-themes `value` map: each theme name → html class token. */
export const SITE_THEME_CLASS_VALUES = {
  light: "light",
  dark: "dark",
  [CYBERPUNK_THEME]: CYBERPUNK_THEME,
} as const

/** True when the resolved theme should use dark surfaces / icons. */
export function isDarkResolvedTheme(
  theme: string | null | undefined,
): boolean {
  return theme === "dark" || theme === CYBERPUNK_THEME
}
