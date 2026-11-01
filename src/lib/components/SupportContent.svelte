<script lang="ts">
  import { BookOpen, MessageCircle } from "@lucide/svelte"
  import Github from "#lib/components/icons/LucideGithub.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import SupportLink from "#lib/components/SupportLink.svelte"
  import {
    marketingPageBodyClass,
    marketingPageSectionTitleClass,
    marketingPageSubsectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"

  const supportRoutes = [
    {
      title: "Documentation",
      description: "Install Tiles, read the manual, check Tilekit docs, and get unstuck on setup.",
      href: "/book",
      label: "Read book",
      icon: BookOpen,
      external: false,
    },
    {
      title: "GitHub Issues",
      description: "Report reproducible bugs, request features, and track fixes in the open.",
      href: "https://github.com/tilesprivacy/tiles/issues",
      label: "Open issues",
      icon: Github,
      external: true,
    },
    {
      title: "Discord",
      description: "Fast async help from users and maintainers when you need a quick route forward.",
      href: "https://discord.gg/PPSjcpZzvt",
      label: "Join Discord",
      icon: MessageCircle,
      external: true,
    },
  ]

  const faqs = [
    {
      question: "What makes a bug report actionable?",
      answer:
        "Include your Tiles version, operating system version, exact output, screenshots if useful, and the shortest reproduction steps you can write. Clear reports get triaged and fixed faster.",
    },
    {
      question: "Can I request features?",
      answer:
        "Yes. Open a GitHub issue with your workflow context, current workaround, and the outcome you want. Concrete use cases help prioritize the work.",
    },
    {
      question: "Why Discord?",
      answer:
        "We're doing what we can with what we have. Since we're not trying to become a tech circlejerk, we have to meet people on their level. So come on in and help us build something better!",
    },
    {
      question: "Where can I track released fixes?",
      answer:
        "Use the releases page for shipped updates and the issue thread for implementation progress before release.",
    },
  ]
</script>

<div class="relative flex min-h-[100dvh] flex-col bg-background">
  <main class="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
    <div class="mx-auto w-full max-w-3xl">
      <section class="w-full">
        <h1 class={marketingPageTitleClass}>Get help</h1>
        <p class={`mt-5 max-w-2xl ${marketingPageBodyClass}`}>
          Find the shortest path from stuck to moving again.
        </p>

        <div class="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {#each supportRoutes as route (route.title)}
            <article
              class="flex flex-col justify-between rounded-xl border border-black/8 bg-black/[0.02] p-5 transition-colors dark:border-white/10 dark:bg-white/[0.03] sm:min-h-[11.5rem] sm:p-6"
            >
              <div>
                <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-foreground dark:bg-white/10">
                  <route.icon class="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 class={`mt-4 ${marketingPageSubsectionTitleClass}`}>
                  {route.title}
                </h2>
                <p class="mt-2.5 text-sm leading-6 text-black/62 dark:text-white/62">
                  {route.description}
                </p>
              </div>
              <div class="mt-5">
                <SupportLink href={route.href} external={route.external}>{route.label}</SupportLink>
              </div>
            </article>
          {/each}
        </div>

        <section class="mt-14 border-t border-black/8 pt-8 dark:border-white/10">
          <h2 class={marketingPageSectionTitleClass}>
            Support FAQ
          </h2>
          <div class="mt-7 divide-y divide-black/8 dark:divide-white/10">
            {#each faqs as faq (faq.question)}
              <div class="py-5 first:pt-0 last:pb-0">
                <h3 class="text-base font-light text-foreground">{faq.question}</h3>
                <p class="mt-2 text-sm leading-6 text-black/62 dark:text-white/62">
                  {faq.answer}
                </p>
              </div>
            {/each}
          </div>
          <p class="mt-7 text-sm leading-6 text-black/62 dark:text-white/62">
            <span class="block"><SupportLink href="/releases">Releases</SupportLink> has all versions and download links.</span>
            <span class="block"><SupportLink href="/download">Download</SupportLink> has the latest version.</span>
            <span class="block"><SupportLink href="https://status.tiles.run" external>Status</SupportLink> has service availability.</span>
          </p>
        </section>
      </section>
    </div>
  </main>

  <SiteFooter />
</div>
