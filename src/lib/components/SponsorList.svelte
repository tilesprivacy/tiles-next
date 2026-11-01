<script lang="ts">
  import PersonAvatar from "#lib/components/PersonAvatar.svelte"
  import { splitPersonDisplayName, type PersonIdentity } from "#lib/people"

  let { title, entries }: { title: string; entries: PersonIdentity[] } = $props()
</script>

<section class="minimal-sponsor-list">
  <div class="minimal-sponsor-list-heading !mb-6 flex min-h-7 items-center justify-between">
    <h2>{title}</h2>
    <span>{entries.length}</span>
  </div>
  {#each entries as person (person.id)}
    {@const isAnonymous = person.anonymous === true}
    {@const profileUrl = isAnonymous ? null : person.links[0]}
    {@const { nameWithoutHandle, handle } = splitPersonDisplayName(isAnonymous ? "Anonymous sponsor" : person.name)}
    <div class="minimal-sponsor-row !m-0 flex !min-h-11 items-center !py-4">
      <span class="minimal-sponsor-person flex w-full min-w-0 items-center !gap-3">
        <PersonAvatar name={person.name} links={person.links} className="minimal-sponsor-avatar" />
        <span class="minimal-sponsor-name inline-flex min-w-0 flex-1 items-baseline !gap-1 overflow-hidden text-ellipsis whitespace-nowrap leading-tight">
          {#if profileUrl}
            <a class="minimal-sponsor-name-link min-w-0 truncate" href={profileUrl} target="_blank" rel="noopener noreferrer"
              ><strong>{nameWithoutHandle}</strong></a
            >
          {:else}
            <strong class="truncate">{nameWithoutHandle}</strong>
          {/if}
        </span>
        {#if handle}
          <small class="minimal-sponsor-handle max-w-[44%] shrink-0 truncate text-right"
            ><span aria-hidden="true" class="before:content-['@']">{handle.slice(1)}</span><span class="sr-only"
              >Handle {handle.slice(1)}</span
            ></small
          >
        {/if}
      </span>
    </div>
  {/each}
</section>
