import Image from "next/image"
import { Bot, Fingerprint, RefreshCw, Download } from "lucide-react"
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
        Use the embedded <a href="https://pi.dev/">Pi</a> agent harness for knowledge work, bundled with OpenAI's{" "}
        <span className="minimal-model-label">
          <Image src="/openai-logo.svg" alt="" width={15} height={15} />
          <span>gpt-oss-20b</span>
        </span>
        {" "}and plugin support for reusable, skill-based workflows.
      </>
    ),
  },
  {
    title: "Connect members to shared compute",
    icon: RemoteInferenceIcon,
    body: "Members connect from their own laptops to a powerful Mac or Linux workstation in the space and use its local models and compute for inference.",
  },
  {
    title: "Member-owned identity",
    icon: Fingerprint,
    body: (
      <>
        Tiles uses locally generated <a href="https://www.w3.org/TR/did-1.1/">DIDs</a> and{" "}
        <a href="https://ucan.xyz">UCANs</a> for simple onboarding, zero-trust authentication, and authorization without relying on a central identity provider.
      </>
    ),
  },
  {
    title: "Sync chats peer-to-peer",
    icon: RefreshCw,
    body: "Members can sync encrypted chats directly between linked devices over a local peer-to-peer connection.",
  },
  {
    title: "Share and collaborate",
    icon: AtprotoIcon,
    body: (
      <>
        Create public or private links to chat sessions, published through <a href="https://atproto.com">AT Protocol</a> and stored on the member&apos;s own personal data server.
      </>
    ),
  },
  {
    title: "Install fully offline",
    icon: Download,
    body: "Deploy Tiles without downloading dependencies or models during setup. The offline installer includes the application and bundled gpt-oss-20b model.",
  },
  {
    title: "Open source and free forever",
    icon: OpenSourceIcon,
    body: (
      <>
        Tiles is <a href="https://github.com/tilesprivacy/tiles">open source</a>, free to use, and designed to remain independent of any single AI provider.
      </>
    ),
  },
] as const

export function HomeContent() {
  return (
    <main className="minimal-product-page">
      <MinimalTopbar />
      <section className="minimal-hero" aria-labelledby="tiles-title">
        <h1 id="tiles-title" className="minimal-hero-title">
          Private AI for coworking spaces
        </h1>
        <p>
          Turn shared compute workstations into <strong>private AI infrastructure for members</strong>. Built with local models and <a href="https://atproto.com">AT Protocol</a>.
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

      <section className="minimal-hero-device-copy mx-auto mt-[4.5rem] w-[min(calc(100%_-_2rem),720px)] px-3 max-[520px]:mt-12" aria-labelledby="why-tiles-heading">
        <h2 id="why-tiles-heading" className="text-2xl font-semibold leading-[1.25] tracking-[-0.02em]">
          Why Tiles?
        </h2>
        <p className="mt-4 text-lg leading-[1.55] tracking-[-0.01em] max-[520px]:text-base">
          Give members secure access to powerful local models running on your space&apos;s workstations. They can connect from their own machines, use the workstation&apos;s inference, sync chats privately between devices, and collaborate by sharing sessions while retaining control over their data and identity.
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
