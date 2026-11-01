import { handlePlanCheckout } from "#lib/server/polar-plan-checkout"

export const prerender = false

export const GET = () => handlePlanCheckout("pro")
