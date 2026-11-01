/** Class token for the cyberpunk skin. The `dark` theme applies it site-wide. */
export const CYBERPUNK_THEME = "cyberpunk" as const

/** User-selectable themes stored in `tiles-theme`. */
export const SITE_THEMES = ["light", "dark"] as const

/** Follow the device preference until the visitor explicitly selects a theme. */
export const DEFAULT_SITE_THEME = "system" as const

export type SiteThemeName = (typeof SITE_THEMES)[number]

/**
 * next-themes `value` map: each theme name → html class token.
 * Dark renders the cyberpunk skin, so it maps to the `cyberpunk` class;
 * ThemeProvider mirrors `.dark` onto <html> so `dark:` utilities keep working.
 */
export const SITE_THEME_CLASS_VALUES = {
  light: "light",
  dark: CYBERPUNK_THEME,
} as const

/** True when the resolved theme should use dark surfaces / icons. */
export function isDarkResolvedTheme(
  theme: string | null | undefined,
): boolean {
  return theme === "dark" || theme === CYBERPUNK_THEME
}
