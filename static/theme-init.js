// Runs before first paint. Picks light or dark from the saved choice,
// falling back to the system setting. Kept in a file (not inline) so the
// CSP doesn't need 'unsafe-inline' for scripts.
;(function () {
  try {
    var root = document.documentElement
    // The shared-chat viewer keeps the choice it always had on chat.tiles.run.
    var key = root.getAttribute("data-page-theme") === "chat" ? "share-page-theme" : "tiles-theme"
    var saved = null
    try {
      saved = localStorage.getItem(key)
      // Older visits stored the dark skin under its own name.
      if (saved === "cyberpunk") {
        saved = "dark"
        localStorage.setItem(key, saved)
      }
    } catch (e) {}
    var dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches)
    root.classList.toggle("dark", dark)
    root.classList.toggle("cyberpunk", dark)
    root.classList.toggle("light", !dark)
    root.style.colorScheme = dark ? "dark" : "light"
  } catch (e) {}
})()
