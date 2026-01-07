'use client'

export function NavbarLinks() {
  return (
    <div className="flex items-center gap-4 navbar-links-before-search">
      <a
        href="https://tiles.run"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        Tiles
      </a>
      <a
        href="https://www.tiles.run/blog"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        Blog
      </a>
    </div>
  )
}

