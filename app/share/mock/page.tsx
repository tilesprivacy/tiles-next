import type { Metadata } from "next"
import { ShareSessionClient } from "../[...session]/share-session-client"

export const metadata: Metadata = {
  title: "Mock Shared Tiles session | Tiles",
  description: "Mock shared session page for UI development.",
}

interface ShareMockPageProps {
  searchParams?: Promise<{
    turns?: string
    sessionId?: string
    name?: string
  }>
}

export default async function ShareMockPage({ searchParams }: ShareMockPageProps) {
  const params = searchParams ? await searchParams : undefined
  const query = new URLSearchParams()

  if (params?.turns) {
    query.set("turns", params.turns)
  }
  if (params?.sessionId) {
    query.set("sessionId", params.sessionId)
  }
  if (params?.name) {
    query.set("name", params.name)
  }

  const queryString = query.toString()
  const mockApiUrl = queryString
    ? `/api/share/mock?${queryString}`
    : "/api/share/mock"

  return <ShareSessionClient mockApiUrl={mockApiUrl} />
}
