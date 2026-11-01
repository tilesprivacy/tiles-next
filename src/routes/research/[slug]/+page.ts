import type { Component } from "svelte"
import type { PageLoad } from "./$types"

// Long-form explorations are markdown under content/research, compiled to
// components at build time.
const bodies = import.meta.glob<{ default: Component }>("/content/research/*.md")

export const load: PageLoad = async ({ data }) => {
  const file = data.entry.mdxSlug ? `/content/research/${data.entry.mdxSlug}.md` : undefined
  const Body = file && bodies[file] ? (await bodies[file]()).default : null
  return { ...data, Body }
}
