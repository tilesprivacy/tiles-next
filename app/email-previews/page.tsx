import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Email previews | Tiles Privacy",
  robots: {
    index: false,
    follow: false,
  },
};

const previews = [
  {
    title: "Mozilla Foundation announcement",
    description: "Draft newsletter for the funding blog post. Not sent.",
    src: "/email-previews/mozilla-funding",
  },
  {
    title: "Newsletter welcome",
    description: "Sent after someone subscribes to Tiles updates.",
    src: "/email-previews/newsletter-welcome",
  },
  {
    title: "Download links",
    description: "Sent when someone asks for the current Tiles installers.",
    src: "/email-previews/download-links",
  },
  {
    title: "Linux waitlist",
    description: "Sent after someone joins the Tiles for Linux waitlist.",
    src: "/email-previews/linux-waitlist",
  },
  {
    title: "IndiaFOSS confirmation",
    description: "Sent after an IndiaFOSS 2026 giveaway application.",
    src: "/indiafoss-2026-giveaway/email-preview",
  },
] as const;

export default function EmailPreviewsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
          Tiles email previews
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Development-only previews of Tiles email templates and drafts. Each
          frame scrolls independently and uses representative sample data.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {previews.map((preview) => (
          <section key={preview.src} className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-medium tracking-[-0.02em]">
                  {preview.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {preview.description}
                </p>
              </div>
              <a
                href={preview.src}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-sm underline underline-offset-4"
              >
                Open full preview
              </a>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <iframe
                src={preview.src}
                title={`${preview.title} email preview`}
                className="h-[760px] w-full bg-white"
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
