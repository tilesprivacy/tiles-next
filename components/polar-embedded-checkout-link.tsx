"use client"

import { PolarEmbedCheckout } from "@polar-sh/checkout/embed"
import { useEffect, type ComponentPropsWithoutRef } from "react"

type PolarEmbeddedCheckoutLinkProps = ComponentPropsWithoutRef<"a">

export function PolarEmbeddedCheckoutLink({ children, ...props }: PolarEmbeddedCheckoutLinkProps) {
  useEffect(() => {
    PolarEmbedCheckout.init()
  }, [])

  return (
    <a {...props} data-polar-checkout data-polar-checkout-theme="light">
      {children}
    </a>
  )
}
