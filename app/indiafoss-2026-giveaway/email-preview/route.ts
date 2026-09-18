import { createElement } from "react"
import { render } from "@react-email/render"
import { IndiaFossGiveawayConfirmationEmail } from "@/emails/indiafoss-giveaway-confirmation"

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 })
  }

  const url = new URL(request.url)
  const html = await render(createElement(IndiaFossGiveawayConfirmationEmail, {
    fullName: "Ankesh",
    trackLabel: "Ticket + $100 travel grant",
    responseItems: [
      { label: "Full name", value: "Ankesh" },
      { label: "Email", value: "ankesh@example.com" },
      { label: "GitHub profile", value: "https://github.com/ankesh" },
      { label: "Affiliated with OSDC", value: "Yes" },
      { label: "Relationship with OSDC", value: "Community member and contributor" },
      { label: "Application track", value: "Ticket + $100 travel grant" },
      { label: "CPU", value: "Apple M2" },
      { label: "GPU", value: "Integrated" },
      { label: "Memory", value: "16 GB" },
      { label: "Devices and operating systems", value: "macOS, iPhone" },
      { label: "Age", value: "24" },
      { label: "Gender as shown on travel ID", value: "Male" },
      { label: "Phone number", value: "+91 98765 43210" },
      { label: "Source", value: "Delhi" },
      { label: "Destination", value: "Bengaluru" },
      { label: "Travel date", value: "2026-10-10" },
      { label: "Travel time", value: "09:30" },
      { label: "Flight operator", value: "IndiGo" },
      { label: "UPI ID or UPI-linked phone", value: "ankesh@upi" },
      { label: "Requirements confirmed", value: "Yes" },
      { label: "Data-use consent", value: "Yes" },
    ],
    siteUrl: url.origin,
  }))

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
