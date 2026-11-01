<script lang="ts" module>
  export type SocialIconType =
    | "website"
    | "twitter"
    | "github"
    | "bluesky"
    | "reddit"
    | "huggingface"
    | "mastodon"
    | "opencollective"

  export function getSocialIconType(url: string): SocialIconType {
    if (url.includes("x.com") || url.includes("twitter.com")) return "twitter"
    if (url.includes("github.com")) return "github"
    if (url.includes("bsky.app")) return "bluesky"
    if (url.includes("reddit.com")) return "reddit"
    if (url.includes("huggingface.co")) return "huggingface"
    if (url.includes("opencollective.com")) return "opencollective"
    try {
      const { pathname } = new URL(url)
      if (pathname.length > 2 && pathname.startsWith("/@")) return "mastodon"
    } catch {
      /* not a URL */
    }
    return "website"
  }
</script>

<script lang="ts">
  import SocialIcon from "./SocialIcon.svelte"

  let {
    name,
    links,
    linkClassName,
    iconClassName,
    className,
  }: {
    name: string
    links: string[]
    className?: string
    linkClassName?: string
    iconClassName?: string
  } = $props()
</script>

<span class={className ?? "flex items-center gap-1.5"}>
  {#each links as url, index (`${url}-${index}`)}
    {@const type = getSocialIconType(url)}
    <a href={url} target="_blank" rel="noopener noreferrer" class={linkClassName} aria-label={`${name} ${type}`}>
      <SocialIcon {type} className={iconClassName} />
    </a>
  {/each}
</span>
