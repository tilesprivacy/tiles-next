"use client"

import QRCode from "react-qr-code"
import { cn } from "@/lib/utils"

interface SharePageQrCodeProps {
  url: string
  className?: string
}

export function SharePageQrCode({ url, className }: SharePageQrCodeProps) {
  if (!url) {
    return null
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-[0.35rem] bg-white p-0.5 shadow-sm ring-1 ring-black/8",
        className,
      )}
      title={`Scan to open: ${url}`}
      aria-label={`QR code for this share link`}
    >
      <QRCode
        value={url}
        size={44}
        bgColor="#ffffff"
        fgColor="#000000"
        level="M"
      />
    </span>
  )
}
