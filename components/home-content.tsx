import Image from "next/image"
import Link from "next/link"
import { MinimalDownload } from "@/components/minimal-download"
import { MinimalTopbar } from "@/components/minimal-topbar"

const features = [
  {
    title: "Run polished local models",
    body: (
      <>
        Native <a href="https://pi.dev">Pi</a> agent harness for knowledge work, built around{" "}
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <Image src="/openai-logo.svg" alt="OpenAI" width={15} height={15} />
          <span className="font-mono text-[0.94em]">gpt-oss-20b</span>
        </span>
        . Use plugins in Tiles to add reusable workflows with skills.
      </>
    ),
  },
  {
    title: "Use local models on remote devices",
    body: "Securely run local models on a remote device like your home lab, peer-to-peer, from any device.",
  },
  {
    title: "Sync chats across your devices",
    body: (
      <>
        Encrypted peer-to-peer chat sync across your linked devices, online, with locally generated{" "}
        <a href="https://www.w3.org/TR/did-1.1/">decentralized identifiers (DIDs)</a> and{" "}
        <a href="https://ucan.xyz">User Controlled Authorization Networks (UCANs)</a>.
      </>
    ),
  },
  {
    title: "Designed for the Atmosphere",
    body: (
      <>
        Create a public or private link to a chat session, published as{" "}
        <a href="https://atproto.com/guides/lexicon">ATproto Lexicon records</a>.
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
        </div>
        <p>A private AI assistant designed for the Atmosphere.</p>
        <MinimalDownload />
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
      </section>

      <section className="minimal-copy" aria-label="What Tiles does">
        {features.map((feature) => (
          <article key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="minimal-actions">
        <MinimalDownload />
        <Link href="/manual">Read the User Manual</Link>
      </section>

      <footer className="minimal-footer">
        <div className="minimal-footer-brand">
          <Image src="/lighticon.png" alt="" width={32} height={32} />
          <span>Tiles</span>
        </div>
        <p>Copyright © 2026 Tiles Privacy</p>
        <p>
          Embed Tiles into your product with <a href="https://tilekit.dev">Tilekit</a>.
        </p>
      </footer>
    </main>
  )
}
