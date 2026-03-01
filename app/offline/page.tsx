import Link from "next/link"

export default function OfflinePage() {
  return (
    <main className="flex h-[100dvh] w-full items-center justify-center overflow-hidden px-6">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">You&apos;re offline</h1>
        <p className="text-muted-foreground">
          Tiles is running in offline mode. Previously visited pages remain available, and fresh content will sync
          automatically when you reconnect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
