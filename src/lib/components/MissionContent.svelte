<script lang="ts">
  import MissionSection from "#lib/components/MissionSection.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
</script>

<div class="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
  <div class="flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] lg:pb-24">
    <MissionSection title="Mission" />
  </div>
  <SiteFooter />
</div>
