<script lang="ts">
  import { Check, ChevronDown, Copy } from "@lucide/svelte"
  import { bankAccountHolder, bankAccounts } from "#lib/sponsor-bank-transfer"

  let { open }: { open: boolean } = $props()
  let currency = $state("USD")
  const routes = $derived(bankAccounts[currency].routes)
  const methods = $derived(Object.keys(routes))
  let method = $derived(methods[0])
  const fields = $derived({ "Account holder": bankAccountHolder, ...routes[method] })

  let feedback = $state.raw<{ fields: typeof fields; label: string; copied: boolean } | null>(null)
  const currentFeedback = $derived(feedback?.fields === fields ? feedback : null)

  async function copyField(label: string, value: string) {
    const displayedFields = fields
    try {
      await navigator.clipboard.writeText(label === "IBAN" ? value.replaceAll(" ", "") : value)
      feedback = { fields: displayedFields, label, copied: true }
    } catch {
      feedback = { fields: displayedFields, label, copied: false }
    }
  }
</script>

<section
  id="sponsor-bank-panel"
  class="minimal-wallet-panel text-foreground"
  aria-labelledby="sponsor-bank-heading"
  hidden={!open}
  data-pagefind-ignore="all"
>
  <header class="minimal-wallet-panel-heading">
    <h3 id="sponsor-bank-heading">Local Bank Transfer to Wise</h3>
  </header>

  <div class="grid gap-3 sm:grid-cols-2">
    <div>
      <label for="bank-currency">Currency</label>
      <div class="bank-select">
        <select id="bank-currency" bind:value={currency}>
          {#each Object.entries(bankAccounts) as [code, account] (code)}
            <option value={code}>{code} · {account.name}</option>
          {/each}
        </select>
        <ChevronDown aria-hidden="true" />
      </div>
    </div>
    <div>
      {#if methods.length > 1}
        <label for="bank-method">Transfer method</label>
        <div class="bank-select">
          <select id="bank-method" bind:value={method}>
            {#each methods as name (name)}
              <option value={name}>{name}</option>
            {/each}
          </select>
          <ChevronDown aria-hidden="true" />
        </div>
      {:else}
        <p class="bank-label">Transfer method</p>
        <p class="flex min-h-11 items-center text-sm font-medium">{method}</p>
      {/if}
    </div>
  </div>

  <dl class="divide-y divide-border border-y border-border">
    {#each Object.entries(fields) as [label, value] (label)}
      <div class="bank-field">
        <dt>{label}</dt>
        <dd>
          <span class="min-w-0 select-all wrap-anywhere font-medium tabular-nums">{value}</span>
          <button
            type="button"
            class="bank-copy"
            aria-label={`Copy ${label}`}
            title={`Copy ${label}`}
            onclick={() => copyField(label, value)}
          >
            {#if currentFeedback?.copied && currentFeedback.label === label}
              <Check class="size-4" aria-hidden="true" />
            {:else}
              <Copy class="size-4" aria-hidden="true" />
            {/if}
          </button>
        </dd>
      </div>
    {/each}
  </dl>
  <p role="status" class:sr-only={!currentFeedback || currentFeedback.copied} class="text-sm">
    {#if currentFeedback}
      {currentFeedback.copied ? `${currentFeedback.label} copied.` : "Select the value to copy it manually."}
    {/if}
  </p>
</section>

<style>
  section[hidden] { display: none; }
  label, .bank-label, dt {
    display: block;
    color: var(--wallet-muted);
    font-size: 0.8125rem;
  }
  label, .bank-label { margin-bottom: 0.35rem; }
  .bank-select { position: relative; }
  .bank-select :global(svg) {
    position: absolute;
    inset: 0 0.75rem 0 auto;
    width: 1rem;
    margin: auto;
    pointer-events: none;
  }
  select {
    width: 100%;
    min-height: 2.75rem;
    appearance: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 2.25rem 0.5rem 0.75rem;
    background: var(--popover);
    color: var(--foreground);
    font-weight: 500;
    cursor: pointer;
  }
  .bank-field {
    display: grid;
    align-items: center;
    grid-template-columns: minmax(8rem, 1fr) minmax(0, 2fr);
    gap: 1rem;
    padding-block: 0.3rem;
  }
  dd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.9375rem;
  }
  .bank-copy {
    display: grid;
    flex: none;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 6px;
    color: var(--wallet-muted);
    cursor: pointer;
  }
  .bank-copy:hover { background: var(--muted); color: var(--foreground); }
  :is(select, button):focus-visible { outline: 2px solid var(--wallet-accent); outline-offset: 2px; }
  @media (max-width: 600px) {
    .bank-field {
      position: relative;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.15rem;
      padding: 0.65rem 3rem 0.65rem 0;
    }
    .bank-copy { position: absolute; inset: 0 0 0 auto; margin: auto; }
  }
</style>
