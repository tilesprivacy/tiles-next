import type { ReactNode } from "react"
import Link from "next/link"
import { Check, CircleDashed, Cpu, FileCode, FlaskConical, KeyRound, Package, RefreshCw } from "lucide-react"
import { BookFaq, BookFaqItem } from "@/components/book-faq"

const comparisonRows = [
  { label: "Decentralized Identity", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "check" },
  { label: "Encryption", tiles: "check", ollama: "empty", lmStudio: "partial", jan: "empty", osaurus: "partial" },
  { label: "Sync", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
  { label: "On-device models", tiles: "check", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
  { label: "Cloud models", tiles: "empty", ollama: "check", lmStudio: "empty", jan: "check", osaurus: "check" },
  { label: "In-house models", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "check", osaurus: "check" },
  { label: "Modelfile", tiles: "check", ollama: "check", lmStudio: "empty", jan: "empty", osaurus: "empty" },
  { label: "Agent Harness", tiles: "wip", ollama: "check", lmStudio: "partial", jan: "empty", osaurus: "check" },
  { label: "Memory", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "check" },
  { label: "Connectors", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
  { label: "Sandbox", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "check" },
  { label: "Remote Link", tiles: "empty", ollama: "empty", lmStudio: "check", jan: "empty", osaurus: "check" },
  { label: "Shared Links", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
  { label: "Offline Installer", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
  { label: "Cross platform", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", osaurus: "empty" },
  { label: "Open source", tiles: "check", ollama: "partial", lmStudio: "partial", jan: "check", osaurus: "check" },
]

function renderComparisonStatus(status: string) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-foreground dark:bg-white/10">
      {status === "check" ? (
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : status === "wip" ? (
        <FlaskConical className="h-3.5 w-3.5 text-black/55 dark:text-[#A0A0A0]" strokeWidth={1.9} aria-hidden />
      ) : status === "partial" ? (
        <CircleDashed className="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
      ) : (
        <span className="text-sm text-black/35 dark:text-[#6B6B6B]" aria-hidden>
          -
        </span>
      )}
      <span className="sr-only">
        {status === "check"
          ? "Supported"
          : status === "wip"
            ? "Behind experimental flag"
            : status === "partial"
              ? "Partially supported"
              : "Not supported"}
      </span>
    </span>
  )
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 text-foreground dark:bg-white/10">
          {icon}
        </span>
        <h3 className="text-base font-semibold text-foreground lg:text-lg">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] lg:text-base">{children}</p>
    </div>
  )
}

export function BookMarketingSections() {
  const sectionHeadingClass = "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"

  return (
    <div className="not-prose mt-12 space-y-0 sm:mt-14">
      <section className="border-t border-black/10 pt-10 pb-10 dark:border-white/10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
        <div className="max-w-2xl space-y-2">
          <h2 className={sectionHeadingClass}>Product overview</h2>
          <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
            Tiles combines local models, device identity, encrypted sync, offline packaging, and developer tooling into
            a privacy-first desktop AI stack.
          </p>
        </div>

        <div className="mt-7 grid gap-7 sm:mt-8 sm:gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
          <FeatureCard icon={<Cpu className="h-4 w-4" strokeWidth={1.75} />} title="On-device Models">
            An opinionated package of prompt, tools, and models optimized for your hardware. Powered by{" "}
            <a
              href="https://ml-explore.github.io/mlx/build/html/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
            >
              MLX
            </a>{" "}
            on Apple Silicon.
          </FeatureCard>

          <FeatureCard icon={<KeyRound className="h-4 w-4" strokeWidth={1.75} />} title="Decentralized Identity">
            Locally generated{" "}
            <a
              href="https://github.com/w3c/did"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
            >
              DIDs
            </a>
            , with the private key always stored locally on device.
          </FeatureCard>

          <FeatureCard icon={<RefreshCw className="h-4 w-4" strokeWidth={1.75} />} title="P2P Sync">
            Encrypted peer-to-peer sync for chats across your linked devices, online or on your local network. Powered by{" "}
            <a
              href="https://www.iroh.computer/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
            >
              Iroh&rsquo;s
            </a>{" "}
            networking stack.
          </FeatureCard>

          <FeatureCard icon={<Package className="h-4 w-4" strokeWidth={1.75} />} title="Offline Installer">
            Bundled dependencies run in a self contained environment without modifying your system, with a fully offline
            installer available for secure and air gapped installations.
          </FeatureCard>

          <FeatureCard icon={<FileCode className="h-4 w-4" strokeWidth={1.75} />} title="Tilekit SDK">
            Customize local models and agent experiences within Tiles. Built in Rust, based on open-source
            specifications such as Modelfile and Open Responses API.
          </FeatureCard>
        </div>
      </section>

      <section className="border-t border-black/10 pt-10 pb-10 dark:border-white/10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <div className="max-w-2xl space-y-2">
            <h2 className={sectionHeadingClass}>What makes Tiles different</h2>
            <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
              Our approach combines best-in-class privacy-focused engineering with unmatched consumer convenience. See how Tiles compares to other local-first AI assistants.
            </p>
          </div>

          <div className="-mx-4 max-w-none overflow-x-auto overflow-y-hidden px-4 overscroll-x-contain min-[390px]:-mx-5 min-[390px]:px-5 sm:mx-0 sm:max-w-full sm:px-0 [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[42rem] table-fixed border-separate border-spacing-0 text-left sm:min-w-[48rem]">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[13.6%]" />
                <col className="w-[13.6%]" />
                <col className="w-[13.6%]" />
                <col className="w-[13.6%]" />
                <col className="w-[13.6%]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border-b border-black/10 py-3 pr-4 text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:border-white/10 dark:text-[#8A8A8A]">
                    Capability
                  </th>
                  <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">Tiles</th>
                  <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">Ollama</th>
                  <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">LM Studio</th>
                  <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">Jan</th>
                  <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">Osaurus</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th className="border-b border-black/10 py-3 pr-4 text-sm font-medium text-foreground dark:border-white/10">
                      {row.label}
                    </th>
                    {[row.tiles, row.ollama, row.lmStudio, row.jan, row.osaurus].map((status, index) => (
                      <td
                        key={`${row.label}-${index}`}
                        className="border-b border-black/10 px-4 py-3 align-middle dark:border-white/10"
                      >
                        {renderComparisonStatus(status)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/60 dark:text-[#B3B3B3] sm:text-sm">
            <span className="inline-flex items-center gap-2">
              {renderComparisonStatus("check")}
              <span>Supported</span>
            </span>
            <span className="inline-flex items-center gap-2">
              {renderComparisonStatus("partial")}
              <span>Partially supported</span>
            </span>
            <span className="inline-flex items-center gap-2">
              {renderComparisonStatus("wip")}
              <span>Behind experimental flag</span>
            </span>
            <span className="inline-flex items-center gap-2">
              {renderComparisonStatus("empty")}
              <span>Not supported</span>
            </span>
          </div>
        </div>
      </section>

      <section
        className="border-t border-black/10 pt-10 pb-10 dark:border-white/10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14"
        aria-labelledby="book-security-faq-heading"
      >
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <div className="max-w-2xl space-y-2">
            <h2 id="book-security-faq-heading" className={sectionHeadingClass}>
              Frequently asked questions
            </h2>
            <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
              Short answers drawn from our{" "}
              <Link
                href="/book/security"
                className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
              >
                security documentation
              </Link>
              . For full context and limits, read that page.
            </p>
          </div>

          <BookFaq omitHeading className="mt-0">
            <BookFaqItem question="What does local-first mean for Tiles?">
              <p>
                Tiles is designed so the default experience runs on-device. The local server binds to <code>localhost</code>,
                which limits exposed network surface during normal use. Configuration and application data live in standard
                local directories, and you can change the user data path when needed.
              </p>
            </BookFaqItem>
            <BookFaqItem question="Are chat and account databases stored as plain SQLite files?">
              <p>
                No. Application state is persisted locally with encryption at rest. The Rust build uses SQLCipher-enabled
                SQLite, and database connections use a passkey from secure storage. That raises the bar against casual
                inspection of copied files, though it does not remove all local risk.
              </p>
            </BookFaqItem>
            <BookFaqItem question="How does Tiles handle identity and secret material?">
              <p>
                Public identity is separated from private keys. Device and account identity use <code>did:key</code> identifiers
                from Ed25519 keys. Private keys and database passkeys are stored in the operating system&apos;s secure credential
                store, not in plaintext app configuration files.
              </p>
            </BookFaqItem>
            <BookFaqItem question="How does device linking and chat sync work?">
              <p>
                Peer-to-peer linking is user-mediated, not automatic. One device shows a ticket or local code; the other enters
                it and explicitly accepts or rejects. In release builds, endpoints derive from your stored secret key, and peer
                identity is checked against the delivered public key. Sync includes defensive controls, including a maximum size
                cap for downloaded deltas before they are applied.
              </p>
              <p>
                Sync uses{" "}
                <a href="https://www.iroh.computer/" target="_blank" rel="noopener noreferrer">
                  Iroh
                </a>{" "}
                for device-to-device networking. When a direct path is not practical, Iroh&apos;s public relays can help establish
                the connection; we list that relay use on our <Link href="/sub-processors">sub-processors</Link> page.
              </p>
            </BookFaqItem>
            <BookFaqItem question="Does Tiles include product analytics, and what is logged locally?">
              <p>
                The product does not currently bundle obvious analytics SDKs such as Sentry, PostHog, Segment, Mixpanel, or
                similar telemetry. There is still local logging: the Python server may log request metadata and bodies to files
                under the Tiles data directory, so prompt content can appear in local logs unless logging changes.
              </p>
            </BookFaqItem>
            <BookFaqItem question="How do updates, signing, and bundled dependencies relate to trust?">
              <p>
                Updates can check GitHub releases and install via the hosted installer script, which depends on release and
                hosting integrity rather than a stronger built-in end-user verification workflow. Dependencies are pinned and
                reviewed. The macOS package is code signed, notarized, and stapled. Bundled dependencies are self-contained so
                normal installation and use do not require live package downloads from the internet.
              </p>
            </BookFaqItem>
            <BookFaqItem question="How do I report a security vulnerability?">
              <p>
                Use the published security policy and private disclosure path. Researchers can use GitHub Security Advisories or
                email <a href="mailto:security@tiles.run">security@tiles.run</a>, with expectations for acknowledgement, triage,
                and coordinated disclosure. See{" "}
                <a
                  href="https://github.com/tilesprivacy/tiles/blob/main/SECURITY.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SECURITY.md
                </a>
                .
              </p>
            </BookFaqItem>
          </BookFaq>
        </div>
      </section>
    </div>
  )
}
