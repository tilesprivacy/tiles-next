export const prerender = false

// The giveaway is closed; the route stays so old form posts get a clear answer.
export const POST = () =>
  Response.json(
    { error: "All giveaway slots have been booked, so applications are closed." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  )
