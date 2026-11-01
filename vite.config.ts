import adapter from "@sveltejs/adapter-cloudflare"
import { sveltekit } from "@sveltejs/kit/vite"
import tailwindcss from "@tailwindcss/vite"
import { mdsvex } from "mdsvex"
import { defineConfig } from "vite"
import { cspDirectives } from "./csp.config.ts"
import { mdsvexOptions } from "./mdsvex.config.ts"

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      extensions: [".svelte", ".md"],
      preprocess: [mdsvex(mdsvexOptions)],
      csp: {
        mode: "auto",
        // Svelte's own types for these are stricter than a plain object literal.
        directives: cspDirectives as never,
      },
      prerender: {
        handleHttpError: "fail",
        handleMissingId: "warn",
        // Blog pages carry at:// URIs in <link rel="site.standard.*"> tags for
        // Bluesky previews. Those aren't pages to crawl; anything else still fails.
        handleInvalidUrl: ({ href, message }) => {
          if (!href.startsWith("at://")) throw new Error(message)
        },
      },
    }),
  ],
})
