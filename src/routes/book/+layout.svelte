<script lang="ts">
  import SiteFooter from "#lib/components/SiteFooter.svelte"

  let { children } = $props()
</script>

<div class="relative flex min-h-screen flex-col bg-background" data-book-section>
  <div class="pt-[var(--book-mobile-header-height)] lg:pt-[calc(7rem+env(safe-area-inset-top,0px))]">
    {@render children()}
  </div>
  <SiteFooter />
</div>
