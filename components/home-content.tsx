import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowUpRight, Bot, Box, Building2, Check, ChevronDown, Fingerprint, FlaskConical, RefreshCw, User } from "lucide-react"
import { RiOpenSourceLine } from "react-icons/ri"
import { MinimalDownload } from "@/components/minimal-download"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { RemoteInferenceIcon } from "@/components/product-feature-widgets"
import { SiteFooter } from "@/components/site-footer"
import { TILES_PRODUCT_TECHNOLOGY_LINE } from "@/lib/product-description"

function AtprotoIcon() {
  return <span aria-hidden="true">@</span>
}

function OpenSourceIcon() {
  return <RiOpenSourceLine style={{ width: "0.9375rem", height: "0.9375rem" }} />
}

const features = [
  {
    title: "Run polished local models",
    icon: Bot,
    body: (
      <>
        Embedded <a href="https://pi.dev/">Pi</a> agent harness for knowledge work, built around OpenAI’s{" "}
        <span className="minimal-model-label">
          <Image src="/openai-logo.svg" alt="" width={15} height={15} />
          <span>gpt-oss-20b</span>
        </span>
        , with plugin support for reusable,{" "}
        skill-based workflows.
      </>
    ),
  },
  {
    title: "Own your identity",
    icon: Fingerprint,
    body: (
      <>
        Tiles uses locally generated <a href="https://www.w3.org/TR/did-1.1/">DIDs</a> and{" "}
        <a href="https://ucan.xyz">UCANs</a> for zero-trust authentication and authorization. This lets you own
        and control your identity across your digital life.
      </>
    ),
  },
  {
    title: "Use local models on remote devices",
    icon: RemoteInferenceIcon,
    body: "Securely run local models on a remote device like your home lab, peer-to-peer, from any device.",
  },
  {
    title: "Sync chats across your devices",
    icon: RefreshCw,
    body: "Encrypted peer-to-peer chat sync across your linked devices.",
  },
  {
    title: "Share chats with friends",
    icon: AtprotoIcon,
    body: (
      <>
        Create a public or private link to a chat session, published on{" "}
        <a href="https://atproto.com">Atmosphere</a> and stored on your own
        personal data server (PDS).
      </>
    ),
  },
  {
    title: "Every chat is a sandbox",
    icon: Box,
    comingSoon: true,
    body: "Resume or share chats as sandboxed microVM environments with friends or agents across devices.",
  },
  {
    title: "Open source and free forever",
    icon: OpenSourceIcon,
    body: (
      <>
        Tiles is <a href="https://github.com/tilesprivacy/tiles">open source</a> and forever free to use,
        dual-licensed under MIT and Apache 2.0. It is designed to be future-proof and continue working forever.
      </>
    ),
  },
] as const

const atmosphereBullets = [
  "You control who hosts your Personal Data Server (PDS).",
  "Apps connect to you, not the other way around.",
  "No starting over when apps change or disappear.",
] as const

function AtmosphereExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="minimal-atmosphere-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight aria-hidden />
    </a>
  )
}

const useCases = [
  {
    title: "Individuals",
    icon: User,
    body: "Plan finances, track health notes, and keep a private journal. Run models locally so that context stays on your machines, sync across your devices, and share only when you choose.",
  },
  {
    title: "Coworking spaces",
    icon: Building2,
    body: "Turn shared compute workstations into private AI infrastructure. Members connect from their own laptops, use the space's local models, and collaborate while keeping their identity and data theirs.",
  },
  {
    title: "Researchers",
    icon: FlaskConical,
    body: "Review literature, analyze datasets, and launch AI agents in preconfigured, resumable sandboxes with the right research tools already installed.",
  },
] as const

export function HomeContent() {
  return (
    <main className="minimal-product-page minimal-home-page">
      <MinimalTopbar />
      <section className="minimal-hero" aria-labelledby="tiles-title">
        <h1 id="tiles-title" className="minimal-hero-title">
          Own your AI
        </h1>
        <p>
          A <strong>private, collaborative AI assistant</strong> that works for you.{" "}
          <span className="sm:block">{TILES_PRODUCT_TECHNOLOGY_LINE}</span>
        </p>
        <MinimalDownload />
      </section>

      <div className="minimal-hero-device">
        <Image
          src="/wireframe.webp"
          alt="Tiles running on a MacBook"
          width={800}
          height={600}
          priority
        />
        <div className="minimal-hero-device-banner" aria-hidden="true">
          <Image
            src="/tiles_banner_outline_blk.svg"
            alt=""
            width={1200}
            height={220}
            className="dark:hidden"
          />
          <Image
            src="/tiles_banner_outline_wht.svg"
            alt=""
            width={1200}
            height={220}
            className="hidden bg-background dark:block"
          />
        </div>
      </div>

      <section
        className="minimal-copy minimal-copy--after-device"
        aria-labelledby="why-tiles-heading"
      >
        <h2 id="why-tiles-heading" className="minimal-copy-heading">
          Why Tiles?
        </h2>
        <div className="minimal-copy-content">
          <p className="minimal-copy-lede">
            For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on <a href="https://atproto.com">AT Protocol</a>. Tiles gives you user-owned keys for your digital life with <a href="https://www.w3.org/TR/did-1.1/">DIDs</a> and <a href="https://ucan.xyz">UCANs</a>, so your data and identity truly remain yours.
          </p>
        </div>
      </section>

      <section className="minimal-copy" aria-labelledby="use-cases-heading">
        <h2 id="use-cases-heading" className="minimal-copy-heading">
          Use cases
        </h2>
        <div className="minimal-copy-content minimal-use-case-list">
          {useCases.map((useCase) => (
            <article key={useCase.title}>
              <h3>
                <span className="minimal-feature-icon" aria-hidden="true">
                  <useCase.icon strokeWidth={1.75} />
                </span>
                {useCase.title}
              </h3>
              <p>{useCase.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="minimal-copy" aria-labelledby="whats-inside-heading">
        <h2 id="whats-inside-heading" className="minimal-copy-heading">
          What&apos;s inside
        </h2>
        <div className="minimal-copy-content minimal-disclosure-list">
          {features.map((feature) => (
            <details className="minimal-disclosure" key={feature.title}>
              <summary>
                <h3>
                  <span className="minimal-feature-icon" aria-hidden="true">
                    <feature.icon strokeWidth={1.75} />
                  </span>
                  {feature.title}
                  {"comingSoon" in feature && feature.comingSoon ? (
                    <span className="minimal-coming-soon-tag">
                      <span className="minimal-coming-soon-dot" aria-hidden="true" />
                      Coming soon
                    </span>
                  ) : null}
                  <ChevronDown className="minimal-disclosure-chevron" aria-hidden />
                </h3>
              </summary>
              <p>{feature.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="minimal-copy" aria-labelledby="atmosphere-heading">
        <h2 id="atmosphere-heading" className="minimal-copy-heading">
          Designed for the ATmosphere
        </h2>
        <div className="minimal-copy-content minimal-atmosphere-content">
          <ul className="minimal-atmosphere-list">
            {atmosphereBullets.map((bullet) => (
              <li key={bullet}>
                <span className="minimal-feature-icon" aria-hidden="true">
                  <Check strokeWidth={1.75} />
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="minimal-atmosphere-note">
            <p>
              Learn more about the AT Protocol in the{" "}
              <AtmosphereExternalLink href="https://atproto.com/guides/understanding-atproto">official documentation</AtmosphereExternalLink>.
            </p>
          </div>
          <span className="minimal-atmosphere-icon" aria-hidden="true" />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
