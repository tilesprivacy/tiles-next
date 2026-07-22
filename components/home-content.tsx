import Image from "next/image"
import Link from "next/link"
import { Bot, RefreshCw } from "lucide-react"
import { MinimalDownload } from "@/components/minimal-download"
import { MinimalFooter } from "@/components/minimal-footer"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { RemoteInferenceIcon } from "@/components/product-feature-widgets"

function AtprotoIcon() {
  return <span aria-hidden="true">@</span>
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
    title: "Use local models on remote devices",
    icon: RemoteInferenceIcon,
    body: "Securely run local models on a remote device like your home lab, peer-to-peer, from any device.",
  },
  {
    title: "Sync chats across your devices",
    icon: RefreshCw,
    body: (
      <>
        Encrypted peer-to-peer chat sync across your linked devices, with locally generated{" "}
        <a href="https://www.w3.org/TR/did-1.1/">decentralized identifiers (DIDs)</a> and{" "}
        <a href="https://ucan.xyz">User Controlled Authorization Networks (UCANs)</a>.
      </>
    ),
  },
  {
    title: "Designed for the Atmosphere",
    icon: AtprotoIcon,
    body: (
      <>
        Create a public or private link to a chat session, published as{" "}
        <a href="https://atproto.com/guides/lexicon">ATproto Lexicon</a> records.
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
          A private, collaborative AI <strong>assistant</strong> that works for you.
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

      <p className="minimal-hero-device-copy mx-auto mt-[4.5rem] w-[min(calc(100%_-_2rem),720px)] px-3 text-lg leading-[1.55] tracking-[-0.01em] max-[520px]:mt-12 max-[520px]:text-base">
        For sensitive knowledge work, your AI shouldn’t require you to trust a third party with your conversations and intellectual property. Run models locally, sync chats peer-to-peer with end-to-end encryption, and use social features, such as sharing chats, built on ATProto, so your data and identity remain yours.
      </p>

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

      <section className="minimal-actions">
        <MinimalDownload />
        <Link href="/book/manual" className="minimal-actions-manual-link">Read the User Manual</Link>
      </section>

      <MinimalFooter />
    </main>
  )
}
