import { Checkout } from "@polar-sh/nextjs"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `${siteUrl}/pricing/success/commercial`,
  returnUrl: `${siteUrl}/pricing`,
})
