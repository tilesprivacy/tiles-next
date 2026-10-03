import { permanentRedirect } from "next/navigation"
import { INDIA_FOSS_2026_PATH } from "@/lib/own-your-ai-theme"

export default function IndiaFoss2026Redirect() {
  permanentRedirect(INDIA_FOSS_2026_PATH)
}
