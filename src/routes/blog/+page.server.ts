import { getVisibleBlogPosts } from "#lib/server/blog"
import type { BlogListingPost } from "#lib/components/BlogListingContent.svelte"
import type { PageServerLoad } from "./$types"

// Only the listing fields go to the page, not the markdown sources.
export const load: PageServerLoad = async () => ({
  posts: (await getVisibleBlogPosts()).map(
    (post): BlogListingPost => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      coverImage: post.coverImage,
      coverImageDark: post.coverImageDark,
      listingImage: post.listingImage,
      listingImageDark: post.listingImageDark,
      listingImagePosition: post.listingImagePosition,
      coverAlt: post.coverAlt,
    }),
  ),
})
