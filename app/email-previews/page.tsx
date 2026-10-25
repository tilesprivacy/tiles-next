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
    title: "Funding newsletter · Light mode",
    description: "The shared Tiles email design on a light background.",
    src: "/email-previews/mozilla-funding?theme=light",
  },
  {
    title: "Funding newsletter · Dark mode",
    description: "The same design with the light Tiles logo on a dark background.",
    src: "/email-previews/mozilla-funding?theme=dark",
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
          Tiles email template
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          The funding newsletter is the design used for all Tiles emails.
          These development-only previews show its light and dark appearance.
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
