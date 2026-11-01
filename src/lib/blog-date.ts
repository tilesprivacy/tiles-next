/** "February 17, 2026", as shown under a post title. UTC, so it never shifts a day. */
export function formatBlogPostDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
