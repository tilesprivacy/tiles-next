import type { NextRequest } from "next/server"
import { handlePlanCheckout } from "../plan-checkout"

/** Checkout for the Tiles Plus subscription linked from `/pricing`. */
export async function GET(request: NextRequest) {
  return handlePlanCheckout(request, "plus")
}
