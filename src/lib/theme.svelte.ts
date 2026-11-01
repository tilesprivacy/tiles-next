// Light/dark state for the theme switcher. static/theme-init.js has already
// applied the right classes before this runs; this just keeps them in sync.

export type ThemeChoice = "light" | "dark" | "system"

const STORAGE_KEY = "tiles-theme"

function systemPrefersDark() {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches
}

function readChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {}
  return "system"
}

function apply(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.classList.toggle("cyberpunk", dark)
  root.classList.toggle("light", !dark)
  root.style.colorScheme = dark ? "dark" : "light"
}

class Theme {
  choice = $state<ThemeChoice>("system")
  systemDark = $state(false)
  mounted = $state(false)

  /** "light" or "dark" after resolving "system". Always "light" before mount. */
  resolved = $derived<"light" | "dark">(
    this.choice === "dark" || (this.choice === "system" && this.systemDark) ? "dark" : "light",
  )

  init() {
    if (this.mounted) return
    this.choice = readChoice()
    this.systemDark = systemPrefersDark()
    this.mounted = true
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      this.systemDark = e.matches
      if (this.choice === "system") apply(e.matches)
    })
  }

  set(choice: ThemeChoice) {
    this.choice = choice
    try {
      if (choice === "system") localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, choice)
    } catch {}
    apply(this.resolved === "dark")
  }
}

export const theme = new Theme()
