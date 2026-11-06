<script lang="ts">
  import { ArrowUpRight } from "@lucide/svelte"
  import TilesSocialLinks from "./TilesSocialLinks.svelte"
</script>

<footer class="minimal-footer">
  <div class="minimal-footer-identity">
    <a href="/" class="minimal-footer-brand" aria-label="Tiles home">
      <span class="minimal-theme-logo">
        <img src="/lighticon-96.png" alt="" width="36" height="36" class="dark:hidden" loading="lazy" decoding="async" />
        <img src="/grey-96.png" alt="" width="36" height="36" class="hidden dark:block" loading="lazy" decoding="async" />
      </span>
      <span>Tiles</span>
    </a>
    <a
      href="https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/cohort/"
      class="minimal-footer-backer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Backed by</span>
      <img
        src="/mozilla-foundation-logo.svg"
        alt="Mozilla Foundation"
        width="229"
        height="48"
        class="dark:hidden"
        loading="lazy"
        decoding="async"
      />
      <img
        src="/mozilla-foundation-logo-dark.svg"
        alt="Mozilla Foundation"
        width="440"
        height="92"
        class="hidden dark:block"
        loading="lazy"
        decoding="async"
      />
    </a>
  </div>
  <div class="minimal-footer-legal">
    <p>© 2026 Tiles Privacy Technologies Pvt. Ltd.</p>
    <address class="minimal-footer-address">WeWork Prestige Atlanta, 80 Feet Rd<br />Koramangala<br />Bengaluru, IN 560034</address>
  </div>
  <div class="space-y-1">
    <p class="lg:whitespace-nowrap">Embed Tiles into your product with <a href="/book/tilekit">Tilekit</a>.</p>
  </div>
  <nav class="minimal-footer-links" aria-label="Footer links">
    <a href="/sub-processors">Subprocessors</a>
    <a href="/terms">Terms</a>
    <a href="/refund-policy">Refunds</a>
    <a href="/privacy">Privacy</a>
    <a href="/press-kit">Press Kit</a>
    <a class="minimal-footer-status" href="https://status.tiles.run" target="_blank" rel="noopener noreferrer">Status<ArrowUpRight aria-hidden="true" /></a>
  </nav>
  <nav class="minimal-footer-social" aria-label="Social links">
    <TilesSocialLinks />
  </nav>
</footer>
