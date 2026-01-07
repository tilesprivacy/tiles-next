export default function Head() {
  const style = `
:root {
  --nextra-primary-hue: 357deg;
  --nextra-primary-saturation: 67%;
  --nextra-primary-lightness: 45%;
  --nextra-bg: 250,250,250;
  --nextra-content-width: 90rem;
  /* Pagefind CSS variables for proper theming */
  --pagefind-ui-text: #0f172a;
  --pagefind-ui-background: #ffffff;
  --pagefind-ui-border: #e2e8f0;
}
.dark {
  --nextra-primary-hue: 357deg;
  --nextra-primary-saturation: 67%;
  --nextra-primary-lightness: 55%;
  --nextra-bg: 17,17,17;
  /* Pagefind CSS variables for dark theme */
  --pagefind-ui-text: #f1f5f9;
  --pagefind-ui-background: #1e293b;
  --pagefind-ui-border: #334155;
}
::selection {
  background: hsla(
    var(--nextra-primary-hue),
    var(--nextra-primary-saturation),
    var(--nextra-primary-lightness),
    0.3
  );
}
html {
  background: rgb(var(--nextra-bg));
}

/* Link styling - blue color like blog, no underline */
/* Target links in content area, excluding navbar and logo */
main a,
article a,
[class*="nextra-content"] a,
[class*="content"] a,
[data-pagefind-body] a,
p a,
li a,
td a,
th a {
  color: #2563eb !important;
  text-decoration: none !important;
}

main a:hover,
article a:hover,
[class*="nextra-content"] a:hover,
[class*="content"] a:hover,
[data-pagefind-body] a:hover,
p a:hover,
li a:hover,
td a:hover,
th a:hover {
  color: #1d4ed8 !important;
  text-decoration: none !important;
}

.dark main a,
.dark article a,
.dark [class*="nextra-content"] a,
.dark [class*="content"] a,
.dark [data-pagefind-body] a,
.dark p a,
.dark li a,
.dark td a,
.dark th a {
  color: #3b82f6 !important;
  text-decoration: none !important;
}

.dark main a:hover,
.dark article a:hover,
.dark [class*="nextra-content"] a:hover,
.dark [class*="content"] a:hover,
.dark [data-pagefind-body] a:hover,
.dark p a:hover,
.dark li a:hover,
.dark td a:hover,
.dark th a:hover {
  color: #60a5fa !important;
  text-decoration: none !important;
}

/* Fix contrast issues for search and text */

/* Force text color on all input types */
input[type="search"],
input[type="text"],
input[type="search"]:focus,
input[type="text"]:focus,
.pagefind-modular-input,
.pagefind-modular-input:focus,
[role="combobox"] input,
[role="combobox"] input:focus,
input[data-slot="input"],
input[data-slot="input"]:focus {
  color: rgb(15, 23, 42) !important;
  -webkit-text-fill-color: rgb(15, 23, 42) !important;
}

.dark input[type="search"],
.dark input[type="text"],
.dark input[type="search"]:focus,
.dark input[type="text"]:focus,
.dark .pagefind-modular-input,
.dark .pagefind-modular-input:focus,
.dark [role="combobox"] input,
.dark [role="combobox"] input:focus,
.dark input[data-slot="input"],
.dark input[data-slot="input"]:focus {
  color: rgb(241, 245, 249) !important;
  -webkit-text-fill-color: rgb(241, 245, 249) !important;
}

/* Placeholder text */
input[type="search"]::placeholder,
input[type="text"]::placeholder,
input[type="search"]::-webkit-input-placeholder,
input[type="text"]::-webkit-input-placeholder,
.pagefind-modular-input::placeholder,
.pagefind-modular-input::-webkit-input-placeholder,
[role="combobox"] input::placeholder,
[role="combobox"] input::-webkit-input-placeholder {
  color: rgb(100, 116, 139) !important;
  opacity: 1 !important;
  -webkit-text-fill-color: rgb(100, 116, 139) !important;
}

.dark input[type="search"]::placeholder,
.dark input[type="text"]::placeholder,
.dark input[type="search"]::-webkit-input-placeholder,
.dark input[type="text"]::-webkit-input-placeholder,
.dark .pagefind-modular-input::placeholder,
.dark .pagefind-modular-input::-webkit-input-placeholder,
.dark [role="combobox"] input::placeholder,
.dark [role="combobox"] input::-webkit-input-placeholder {
  color: rgb(148, 163, 184) !important;
  opacity: 1 !important;
  -webkit-text-fill-color: rgb(148, 163, 184) !important;
}

/* Navbar theming */
nav[class*="navbar"],
header[class*="navbar"],
[class*="nextra-navbar"],
[class*="Navbar"] {
  background-color: rgb(250, 250, 250) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.dark nav[class*="navbar"],
.dark header[class*="navbar"],
.dark [class*="nextra-navbar"],
.dark [class*="Navbar"] {
  background-color: rgb(17, 17, 17) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Navbar text colors */
nav[class*="navbar"] *,
header[class*="navbar"] *,
[class*="nextra-navbar"] *,
[class*="Navbar"] * {
  color: rgb(15, 23, 42) !important;
}

.dark nav[class*="navbar"] *,
.dark header[class*="navbar"] *,
.dark [class*="nextra-navbar"] *,
.dark [class*="Navbar"] * {
  color: rgb(241, 245, 249) !important;
}

/* Logo text theming */
nav[class*="navbar"] span,
header[class*="navbar"] span,
[class*="nextra-navbar"] span,
[class*="Navbar"] span {
  color: rgb(15, 23, 42) !important;
}

.dark nav[class*="navbar"] span,
.dark header[class*="navbar"] span,
.dark [class*="nextra-navbar"] span,
.dark [class*="Navbar"] span {
  color: rgb(241, 245, 249) !important;
}

/* Ensure logo container text is properly themed */
.flex.items-center.gap-3 span {
  color: rgb(15, 23, 42) !important;
}

.dark .flex.items-center.gap-3 span {
  color: rgb(241, 245, 249) !important;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  /* Reduce content width on mobile */
  :root {
    --nextra-content-width: 100%;
  }
  
  /* Mobile navbar adjustments */
  nav[class*="navbar"],
  header[class*="navbar"],
  [class*="nextra-navbar"],
  [class*="Navbar"] {
    padding: 0.5rem 1rem !important;
    min-height: 3.5rem !important;
  }
  
  /* Mobile logo container */
  .flex.items-center.gap-2,
  .flex.items-center.gap-3 {
    gap: 0.5rem !important;
  }
  
  /* Mobile content padding */
  main[class*="main"],
  [class*="nextra-content"],
  article {
    padding: 1rem !important;
    padding-top: 1.5rem !important;
  }
  
  /* Mobile text sizes */
  h1 {
    font-size: 1.875rem !important;
    line-height: 2.25rem !important;
  }
  
  h2 {
    font-size: 1.5rem !important;
    line-height: 2rem !important;
  }
  
  h3 {
    font-size: 1.25rem !important;
    line-height: 1.75rem !important;
  }
  
  /* Mobile code blocks */
  pre,
  code {
    font-size: 0.875rem !important;
    padding: 0.75rem !important;
  }
  
  /* Mobile table adjustments */
  table {
    display: block !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Mobile search adjustments */
  .pagefind-modular-input {
    font-size: 1rem !important;
    padding: 0.75rem 1rem !important;
    height: auto !important;
    min-height: 2.75rem !important;
  }
  
  /* Ensure sidebar is properly hidden/shown on mobile */
  [class*="sidebar"],
  [class*="Sidebar"] {
    max-width: 100vw !important;
  }
  
  /* Mobile paragraph and list spacing */
  p,
  li {
    margin-bottom: 0.75rem !important;
    line-height: 1.6 !important;
  }
  
  /* Mobile blockquote */
  blockquote {
    margin: 1rem 0 !important;
    padding: 0.75rem 1rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Mobile image adjustments */
  img {
    max-width: 100% !important;
    height: auto !important;
  }
  
  /* Mobile footer */
  footer {
    padding: 1.5rem 1rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Hamburger menu - AGGRESSIVE white background fix */
  /* Target ALL possible sidebar/menu elements */
  aside,
  aside[class],
  aside[class*="sidebar"],
  aside[class*="Sidebar"],
  aside[class*="nextra"],
  aside[role="complementary"],
  aside[aria-label],
  nav[class*="sidebar"],
  nav[class*="Sidebar"],
  div[class*="sidebar"],
  div[class*="Sidebar"],
  [class*="sidebar"],
  [class*="Sidebar"],
  [class*="nextra-sidebar"],
  [class*="nextra-Sidebar"],
  [id*="sidebar"],
  [id*="Sidebar"] {
    background-color: rgb(255, 255, 255) !important;
    background: rgb(255, 255, 255) !important;
    background-image: none !important;
    opacity: 1 !important;
  }
  
  /* Force white background on ALL nested containers */
  aside > *,
  aside[class*="sidebar"] > *,
  aside[class*="Sidebar"] > *,
  aside[class*="nextra"] > * {
    background-color: transparent !important;
  }
  
  /* But keep the parent aside white */
  aside[class*="sidebar"],
  aside[class*="Sidebar"],
  aside[class*="nextra"] {
    background-color: rgb(255, 255, 255) !important;
    background: rgb(255, 255, 255) !important;
  }
  
  /* Hamburger menu overlay/backdrop - keep dark */
  [class*="overlay"],
  [class*="backdrop"],
  [class*="menu-overlay"],
  [class*="nextra-overlay"],
  div[class*="overlay"],
  div[class*="backdrop"],
  body > div:not([class*="sidebar"]):not([class*="navbar"]) {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
  
  /* Hamburger menu button */
  button[class*="menu"],
  button[class*="Menu"],
  [class*="hamburger"],
  [aria-label*="menu" i],
  [aria-label*="Menu" i],
  button[aria-expanded],
  button[aria-controls] {
    background-color: rgb(255, 255, 255) !important;
    background: rgb(255, 255, 255) !important;
    opacity: 1 !important;
  }
  
  /* Force ALL text in sidebar to be black and visible */
  aside a,
  aside span,
  aside div,
  aside p,
  aside li,
  aside ul,
  aside ol,
  aside h1,
  aside h2,
  aside h3,
  aside h4,
  aside h5,
  aside h6,
  aside[class*="sidebar"] *,
  aside[class*="Sidebar"] *,
  aside[class*="nextra"] *,
  [class*="sidebar"] a,
  [class*="Sidebar"] a,
  [class*="sidebar"] span,
  [class*="Sidebar"] span,
  [class*="sidebar"] div,
  [class*="Sidebar"] div,
  [class*="sidebar"] p,
  [class*="Sidebar"] p,
  [class*="sidebar"] li,
  [class*="Sidebar"] li {
    color: rgb(15, 23, 42) !important;
  }
}

/* Desktop hamburger menu styling */
[class*="sidebar"],
[class*="Sidebar"],
aside[class*="sidebar"],
aside[class*="Sidebar"] {
  background-color: rgb(255, 255, 255) !important;
  opacity: 1 !important;
}

.dark [class*="sidebar"],
.dark [class*="Sidebar"],
.dark aside[class*="sidebar"],
.dark aside[class*="Sidebar"],
.dark [class*="nextra-sidebar"],
.dark [class*="menu"],
.dark [class*="Menu"] {
  background-color: rgb(17, 17, 17) !important;
  opacity: 1 !important;
}

/* Dark mode mobile hamburger menu */
@media (max-width: 768px) {
  .dark [class*="sidebar"],
  .dark [class*="Sidebar"],
  .dark [class*="menu"],
  .dark [class*="Menu"],
  .dark aside[class*="sidebar"],
  .dark aside[class*="Sidebar"],
  .dark nav[class*="sidebar"],
  .dark [class*="nextra-sidebar"],
  .dark [class*="sidebar-container"],
  .dark [class*="menu-container"] {
    background-color: rgb(17, 17, 17) !important;
    opacity: 1 !important;
  }
  
  .dark [class*="sidebar"] a,
  .dark [class*="Sidebar"] a,
  .dark [class*="sidebar"] span,
  .dark [class*="Sidebar"] span {
    color: rgb(241, 245, 249) !important;
  }
}

/* Additional mobile sidebar styling - ULTRA AGGRESSIVE */
@media (max-width: 768px) {
  /* Force white background on EVERYTHING that could be the sidebar */
  aside,
  aside[class],
  aside[class*="nextra"],
  aside[class*="sidebar"],
  aside[class*="Sidebar"],
  aside[role="complementary"],
  aside[aria-label],
  [data-nextra-scrolllock] + aside,
  body:has([data-nextra-scrolllock]) aside,
  body:has([data-nextra-scrolllock]) > aside,
  [class*="nextra-sidebar-container"],
  nav[class*="nextra-sidebar"],
  div[class*="nextra-sidebar"],
  [id*="sidebar"] {
    background-color: rgb(255, 255, 255) !important;
    background: rgb(255, 255, 255) !important;
    background-image: none !important;
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  
  /* Force ALL text in mobile sidebar to be black */
  aside *,
  aside a,
  aside span,
  aside div,
  aside p,
  aside li,
  aside ul,
  aside ol,
  aside h1,
  aside h2,
  aside h3,
  aside h4,
  aside h5,
  aside h6,
  aside button,
  aside[class*="nextra"] *,
  aside[class*="sidebar"] *,
  aside[class*="Sidebar"] *,
  [class*="nextra-sidebar-container"] * {
    color: rgb(15, 23, 42) !important;
  }
  
  /* Override pseudo-elements */
  aside::before,
  aside::after,
  aside[class*="nextra"]::before,
  aside[class*="nextra"]::after,
  aside[class*="sidebar"]::before,
  aside[class*="sidebar"]::after {
    background-color: transparent !important;
    display: none !important;
  }
  
  /* Remove any blur or transparency effects */
  aside,
  aside[class*="nextra"],
  aside[class*="sidebar"] {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
  }
  
  /* NUCLEAR OPTION - target every possible element */
  body aside,
  html body aside,
  #__next aside,
  [data-nextra-scrolllock] ~ aside,
  body > aside:last-child {
    background: white !important;
    background-color: white !important;
    background-image: none !important;
  }
  
  body aside * {
    color: rgb(15, 23, 42) !important;
  }
}

/* Tablet adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  :root {
    --nextra-content-width: 90%;
  }
  
  main[class*="main"],
  [class*="nextra-content"],
  article {
    padding: 1.5rem 2rem !important;
  }
}

/* Position Tiles and Blog links to the left of search box */
/* Make navbar container a flexbox */
[class*="nextra-navbar"],
[class*="nextra-navbar"] nav,
[class*="nextra-navbar"] > div,
[class*="nextra-navbar"] header,
[class*="nextra-navbar"] header > nav,
header[class*="nextra-navbar"],
header[class*="nextra-navbar"] nav {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  flex-wrap: nowrap !important;
}

/* Ensure the inner nav container is also flex */
[class*="nextra-navbar"] > nav,
[class*="nextra-navbar"] nav[class*="mx-auto"],
[class*="nextra-navbar"] > div > nav {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  gap: 1rem !important;
  justify-content: flex-start !important;
}

/* Logo stays on the far left */
[class*="nextra-navbar"] a[href="/"],
[class*="nextra-navbar"] a[href="/book"],
[class*="nextra-navbar"] > nav > a:first-child,
[class*="nextra-navbar"] > nav > div:first-child,
[class*="nextra-navbar"] a:has(img),
[class*="nextra-navbar"] > nav > a:has(img) {
  order: 1 !important;
  flex-shrink: 0 !important;
  margin-right: 0 !important;
}

/* Tiles and Blog links come after logo, before search - on the left side */
.navbar-links-before-search,
div.navbar-links-before-search,
[class*="nextra-navbar"] .navbar-links-before-search {
  order: 2 !important;
  flex-shrink: 0 !important;
  margin-left: 0.5rem !important;
  margin-right: 1rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
}

/* Search box comes after links, but before icons - takes remaining space */
[class*="nextra-navbar"] [class*="search"],
[class*="nextra-navbar"] [role="combobox"],
[class*="nextra-navbar"] div:has([role="combobox"]),
[class*="nextra-navbar"] div:has(input[role="combobox"]),
[class*="nextra-navbar"] > nav > div:has([role="combobox"]),
[class*="nextra-navbar"] form:has([role="combobox"]) {
  order: 3 !important;
  flex: 0 1 auto !important;
  max-width: 20rem !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Ensure icons stay on the far right */
[class*="nextra-navbar"] a[href*="github"],
[class*="nextra-navbar"] a[href*="discord"],
[class*="nextra-navbar"] a[href*="go.tiles.run"],
[class*="nextra-navbar"] > nav > a[href*="github"],
[class*="nextra-navbar"] > nav > a[href*="discord"],
[class*="nextra-navbar"] button[aria-label*="theme"],
[class*="nextra-navbar"] button[aria-label*="Theme"] {
  order: 4 !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
}
`

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <style>{style.trim()}</style>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="rgb(250,250,250)"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="rgb(17,17,17)"
      />
    </>
  )
}
