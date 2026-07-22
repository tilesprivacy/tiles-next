import Image from "next/image"
import { Bot, Fingerprint, RefreshCw } from "lucide-react"
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
        <span className="font-mono text-[0.94em]">gpt-oss-20b</span>, with plugin support for reusable,{" "}
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
    title: "Designed for the Atmosphere",
    icon: AtprotoIcon,
    body: (
      <>
        Create a public or private link to a chat session, published as an{" "}
        <a href="https://atproto.com/guides/lexicon">ATproto Lexicon</a> record on your own personal data server (PDS).
      </>
    ),
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

export function HomeContent() {
  return (
    <main className="minimal-product-page">
      <MinimalTopbar hideBrand />
      <section className="minimal-hero" aria-labelledby="tiles-title">
        <div className="minimal-wordmark">
          <Image src="/lighticon.png" alt="" width={72} height={72} priority />
          <h1 id="tiles-title">Tiles</h1>
          <span className="minimal-wordmark-alpha">alpha</span>
        </div>
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
          />
        </div>
      </div>

      <section className="minimal-hero-device-copy mx-auto mt-[4.5rem] w-[min(calc(100%_-_2rem),720px)] px-3 max-[520px]:mt-12" aria-labelledby="why-tiles-heading">
        <h2 id="why-tiles-heading" className="text-2xl font-semibold leading-[1.25] tracking-[-0.02em]">
          Why Tiles?
        </h2>
        <p className="mt-4 text-lg leading-[1.55] tracking-[-0.01em] max-[520px]:text-base">
          For sensitive knowledge work or personal tasks, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on <a href="https://atproto.com">AT Protocol</a>, so your data and identity remain yours.
        </p>
      </section>

      <section className="minimal-copy !mt-28 max-[520px]:!mt-20" aria-label="What Tiles does">
        {features.map((feature) => (
          <article key={feature.title}>
            <h2>
              <span className="minimal-feature-icon" aria-hidden="true"><feature.icon strokeWidth={1.75} /></span>
              {feature.title}
            </h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  )
}
