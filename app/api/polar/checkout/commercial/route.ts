import { Checkout } from "@polar-sh/nextjs"

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: "/pricing/success/commercial?checkout_id={CHECKOUT_ID}",
  returnUrl: "/pricing",
})
