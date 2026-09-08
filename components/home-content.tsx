import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowUpRight, Bot, Box, Briefcase, Building2, Check, ChevronDown, Fingerprint, FlaskConical, RefreshCw, Share2, User } from "lucide-react"
import { RiOpenSourceLine } from "react-icons/ri"
import { HeroBannerShader } from "@/components/hero-banner-shader"
import { MinimalDownload } from "@/components/minimal-download"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { RemoteInferenceIcon } from "@/components/product-feature-widgets"
import { SiteFooter } from "@/components/site-footer"
import { TILES_PRODUCT_TECHNOLOGY_LINE } from "@/lib/product-description"

function OpenSourceIcon() {
  return <RiOpenSourceLine style={{ width: "0.9375rem", height: "0.9375rem" }} />
}

const features = [
  {
    title: "Run polished local models",
    icon: Bot,
    body: (
      <>
        Embedded <a href="https://pi.dev/">Pi</a> agent harness for knowledge work, running Google’s{" "}
        <span className="minimal-model-label">
          {/* lazy: keeps React from preloading this third-party image in the
              document head, which forced an early connection to ai.google.dev */}
          <img src="https://ai.google.dev/gemma/images/gemma_sq.png" alt="Gemma logo" width={15} height={15} loading="lazy" />
          <span>gemma-4-12b</span>
        </span>{" "}
        on <a href="https://llama.app/">llama.cpp</a>, with plugin support for reusable, skill-based workflows.
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
    icon: Share2,
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
    body: "Resume or share chats as sandboxed microVM environments with friends or agents across devices.",
    comingSoon: true,
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
  "Your online data lives on a Personal Data Server (PDS), and you choose who hosts it.",
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
    body: "Plan finances, track health notes, and journal privately. Run models locally, sync across devices, and share only when you choose.",
  },
  {
    title: "Coworking spaces",
    icon: Building2,
    body: "Turn shared compute into private AI infrastructure. Let members use local models from their own devices while keeping identity and data private.",
  },
  {
    title: "Researchers",
    icon: FlaskConical,
    body: "Review literature, analyze datasets, and run agents in preconfigured, resumable research sandboxes.",
  },
  {
    title: "Enterprises",
    icon: Briefcase,
    body: "Deploy private agentic systems powered by open frontier models. Secure users and agents with zero-trust authentication and authorization, simplify team management, and reduce infrastructure and model costs.",
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
          A <strong>local-first, collaborative AI assistant</strong> that works for you.{" "}
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
          <HeroBannerShader />
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
        <div className="minimal-copy-content minimal-disclosure-list">
          {useCases.map((useCase) => (
            <details className="minimal-disclosure" key={useCase.title}>
              <summary>
                <h3>
                  <span className="minimal-feature-icon" aria-hidden="true">
                    <useCase.icon strokeWidth={1.75} />
                  </span>
                  <span className="minimal-disclosure-title">{useCase.title}</span>
                  <span className="minimal-disclosure-meta">
                    <ChevronDown className="minimal-disclosure-chevron" aria-hidden />
                  </span>
                </h3>
              </summary>
              <p>{useCase.body}</p>
            </details>
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
                  <span className="minimal-disclosure-title">{feature.title}</span>
                  <span className="minimal-disclosure-meta">
                    {"comingSoon" in feature && feature.comingSoon ? (
                      <span className="minimal-disclosure-status">Coming soon</span>
                    ) : null}
                    <ChevronDown className="minimal-disclosure-chevron" aria-hidden />
                  </span>
                </h3>
              </summary>
              <p>{feature.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="minimal-copy" aria-labelledby="atmosphere-heading">
        <h2 id="atmosphere-heading" className="minimal-copy-heading">
          Designed for the Atmosphere
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
            <h3>What&apos;s the Atmosphere?</h3>
            <p>
              The Atmosphere is the growing network of apps built on the{" "}
              <AtmosphereExternalLink href="https://atproto.com">AT Protocol</AtmosphereExternalLink>{" "}
              (ATproto), an open decentralized protocol for social applications and portable identity. For Tiles,
              this means social features do not need to live inside a closed platform.
            </p>
            <p>
              Learn more about the AT Protocol in the{" "}
              <AtmosphereExternalLink href="https://atproto.com/guides/understanding-atproto">
                official documentation
              </AtmosphereExternalLink>
              .
            </p>
          </div>
          <span className="minimal-atmosphere-icon" aria-hidden="true" />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
