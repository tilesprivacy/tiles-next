import { permanentRedirect } from "next/navigation"

export default function SponsorPage() {
  permanentRedirect("/about#sponsor")
}
