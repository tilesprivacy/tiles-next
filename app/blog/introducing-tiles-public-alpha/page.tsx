import { permanentRedirect } from "next/navigation"

export default function IntroducingTilesPublicAlphaRedirectPage() {
  permanentRedirect("/blog")
}
