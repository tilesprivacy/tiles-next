import { getCanaryRelease } from "@/lib/canary-release"
import { CanaryReleaseContent } from "@/components/canary-release-content"

export async function CanaryRelease() {
  return <CanaryReleaseContent initialRelease={await getCanaryRelease()} />
}
