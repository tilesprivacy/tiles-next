<script lang="ts">
  import { bookPages } from "#lib/book"

  let { slug }: { slug: string } = $props()
</script>

<aside class="book-sidebar" data-pagefind-ignore="all">
  <div class="book-sidebar-scroll book-mask">
    <ul class="book-sidebar-list">
      {#each bookPages as item (item.href)}
        <li>
          <a href={item.href} aria-current={item.slug === slug ? "page" : undefined}>{item.title}</a>
        </li>
      {/each}
    </ul>
  </div>
</aside>
