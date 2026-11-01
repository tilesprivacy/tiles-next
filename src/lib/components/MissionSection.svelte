<script lang="ts">
  import PersonAvatar from "#lib/components/PersonAvatar.svelte"
  import SocialLinks from "#lib/components/SocialLinks.svelte"
  import { people, type PersonIdentity } from "#lib/people"
  import {
    marketingPageSubsectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"

  let { title }: { title: string } = $props()

  // Light and dark colours through the `dark:` variant, so the page needs no
  // theme state and renders correctly before hydration.
  const textColor = "text-foreground"
  const textColorMuted = "text-black/80 dark:text-[#E6E6E6]"
  const textColorSubtle = "text-black/50 dark:text-[#8A8A8A]"
  const textColorBody = "text-black/80 dark:text-[#B3B3B3]"
  const linkColor = "text-black hover:text-black/70 dark:text-[#E6E6E6] dark:hover:text-[#B3B3B3]"
  const linkColorMuted = "text-black/60 hover:text-black dark:text-[#8A8A8A] dark:hover:text-[#E6E6E6]"

  const groupHeadingClass = `mb-2 text-xs font-normal tracking-[-0.005em] ${textColor} sm:mb-2.5 sm:text-sm lg:text-base`
  const columnClass =
    "flex-1 sm:flex-initial lg:flex-none min-w-0 sm:min-w-[200px] md:min-w-[220px] lg:min-w-[220px] lg:max-w-[280px]"

  function splitHandle(name: string) {
    const match = name.match(/^(.*?)(\s@[^ ]+)$/)
    return match ? { fullName: match[1], handle: match[2] } : null
  }
</script>

{#snippet externalArrow()}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" class="h-2.5 w-2.5">
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
{/snippet}

{#snippet person({ name, links, anonymous = false }: PersonIdentity)}
  {@const displayName = anonymous ? "Anonymous sponsor" : name}
  {@const split = anonymous ? null : splitHandle(displayName)}
  <div class={`flex items-center justify-between gap-3 text-xs sm:text-sm ${textColorMuted} lg:text-base leading-relaxed`}>
    <div class="min-w-0 flex items-center gap-2 sm:gap-2.5">
      <PersonAvatar name={displayName} {links} className="inline-flex shrink-0" />
      <span class="truncate"
        >{#if split}{split.fullName}<span class={textColorSubtle}>{split.handle}</span>{:else}{displayName}{/if}</span
      >
    </div>
    {#if !anonymous}
      <SocialLinks
        name={displayName}
        {links}
        className="ml-2 flex flex-shrink-0 items-center justify-end gap-1.5 sm:gap-2"
        linkClassName={linkColorMuted}
        iconClassName="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
      />
    {/if}
  </div>
{/snippet}

<main
  class="flex flex-1 flex-col lg:flex-row items-start lg:items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-7xl mx-auto"
>
  <div class="w-full flex-shrink-0 lg:flex-1 lg:max-w-2xl">
    <h2 class={`mb-6 text-left sm:mb-8 md:mb-10 lg:mb-12 ${marketingPageTitleClass} ${textColor}`}>
      {title}
    </h2>
    <div class={`space-y-4 sm:space-y-6 text-sm leading-relaxed ${textColorBody} sm:text-base md:space-y-6 lg:space-y-8 lg:text-lg lg:leading-relaxed`}>
      <p class={`text-base font-medium ${textColor} lg:text-xl`}>
        Our mission is to build software that gives people greater
        agency, control, and choice in their digital lives.
      </p>

      <p>
        Tiles Privacy was born from the
        <a
          href="https://userandagents.org/"
          target="_blank"
          rel="noopener noreferrer"
          class={`inline-flex items-center gap-1 ${linkColor} underline`}
        >
          User &amp; Agents
          {@render externalArrow()}
        </a>
        community with a simple idea: software should understand you without taking anything from you. We strive
        to deliver the best privacy-focused engineering while also offering unmatched convenience in our
        consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both
        through your personal user agent.
      </p>

      <p>
        Founded by Ankesh Bharti (<a
          href="https://x.com/feynon"
          target="_blank"
          rel="noopener noreferrer"
          class={`inline-flex items-center gap-1 ${linkColor} underline`}
        >
          @feynon
          {@render externalArrow()}
        </a>), an independent researcher and technologist, Tiles is
        built for privacy conscious users who want intelligence without renting their memory to centralized
        providers. Our first product is Tiles, a local-first private AI assistant that runs on-device models with
        encrypted P2P sync, keeps your data and identity yours, and supports sharing chats with ATproto, along with an
        SDK that enables developers to customize local models and agent experiences within Tiles.
      </p>

      <p>
        We are seeking design partners for TEE based cloud workloads that align with our goal of a verifiable
        privacy perimeter. Contact us at
        <a href="mailto:hello@tiles.run" class={`${linkColor} underline`}>hello@tiles.run</a>.
      </p>

      <p>
        Want to contribute?
        <a href="/book/community" class={`${linkColor} underline`}>See how you can make Tiles better.</a>
      </p>
    </div>
  </div>

  <div class="w-full lg:w-auto lg:flex-shrink-0 mt-6 sm:mt-8 lg:mt-0">
    <div class="flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10">
      <div class={columnClass}>
        <h3 class={`mb-4 sm:mb-5 ${marketingPageSubsectionTitleClass} ${textColor}`}>Contributors</h3>
        <div class="space-y-4 sm:space-y-5">
          <div>
            <h4 class={groupHeadingClass}>Core</h4>
            <div class="space-y-2 sm:space-y-2.5">
              {#each people.contributorsCore as p (p.name)}
                {@render person(p)}
              {/each}
            </div>
          </div>
          {#if people.contributorsCommunity.length > 0}
            <div>
              <h4 class={groupHeadingClass}>
                Community
              </h4>
              <div class="space-y-2 sm:space-y-2.5">
                {#each people.contributorsCommunity as p (p.name)}
                  {@render person(p)}
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class={columnClass}>
        <h3 class={`mb-4 sm:mb-5 ${marketingPageSubsectionTitleClass} ${textColor}`}>Sponsors</h3>
        <div class="space-y-4 sm:space-y-5">
          <div>
            <h4 class={groupHeadingClass}>Current</h4>
            <div class="space-y-2 sm:space-y-2.5">
              {#each people.sponsorsActive as p (p.id)}
                {@render person(p)}
              {/each}
            </div>
          </div>
          <div>
            <h4 class={groupHeadingClass}>Past</h4>
            <div class="space-y-2 sm:space-y-2.5">
              {#each people.sponsorsPast as p (p.id)}
                {@render person(p)}
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
