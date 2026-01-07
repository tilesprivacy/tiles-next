import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"
import NewsletterForm from "@/components/newsletter-form"

export const metadata: Metadata = {
  title: "Introducing Tiles Alpha",
  description: "Building the future of software personalization with decentralized memory networks.",
  openGraph: {
    title: "Introducing Tiles Alpha",
    description: "Building the future of software personalization with decentralized memory networks.",
    type: "article",
    publishedTime: "2026-01-02",
    images: [
      {
        url: "/kingston.webp",
        width: 1200,
        height: 600,
        alt: "Cover image for Introducing Tiles Alpha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Tiles Alpha",
    description: "Building the future of software personalization with decentralized memory networks.",
    images: ["/kingston.webp"],
  },
}

export default function HowTilesWorksPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex items-center gap-2 text-base font-medium text-black lg:text-lg">
          <Link href="/" className="transition-colors hover:text-black/70">
            <Image src="/lighticon.png" alt="Tiles" width={32} height={32} className="h-7 w-7 lg:h-8 lg:w-8" />
          </Link>
          <span className="text-black/30">/</span>
          <Link href="/blog" className="font-bold transition-colors hover:text-black/70">
            Blog
          </Link>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 transition-all duration-300 group-hover:scale-110 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-16 pb-20 lg:px-6 lg:pt-12 lg:pb-24 gap-6 lg:gap-12">
        {/* Top Card - Logo and Header Text */}
        <div className="w-full max-w-2xl px-4 pt-4 pb-3 lg:px-12 lg:pt-6 lg:pb-4">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-3 lg:mb-4">
              <Image
                src="/lighticon.png"
                alt="Tiles Logo"
                width={64}
                height={64}
                className="h-8 w-8 lg:h-12 lg:w-12"
              />
            </div>

            {/* Header Text */}
            <div className="space-y-1.5 text-xs text-black/60 lg:space-y-2 lg:text-sm">
              <p>
                You're reading the{" "}
                <a
                  href="https://tiles.run"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                >
                  Tiles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>{" "}
                blog.
              </p>
              <p>
                There are{" "}
                <Link href="/blog" className="text-black hover:text-black/80 underline">
                  more posts
                </Link>
                .
              </p>
              <p className="mt-3 lg:mt-4">
                When you're done, you can{" "}
                <Link href="/download" className="text-black hover:text-black/80 underline">
                  install Tiles
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Card - Blog Post Content */}
        <div className="w-full max-w-2xl px-4 py-6 lg:px-16 lg:py-16 relative">
          {/* Blog Title */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl font-semibold text-black mb-4 lg:text-6xl lg:mb-5 tracking-tight">
              Introducing Tiles Alpha
            </h1>
            <p className="text-base text-black/50 lg:text-xl mb-3 lg:mb-4">
              Building the future of software personalization with decentralized memory networks.
            </p>
            <p className="text-sm text-black/40 lg:text-lg">January 2, 2026</p>
          </div>

          {/* Cover Image */}
          <div className="mb-8 lg:mb-16">
            <Image
              src="/kingston.webp"
              alt="Cover image for Introducing Tiles Alpha"
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <article>
            <div className="space-y-6 text-base leading-relaxed text-black/70 lg:space-y-10 lg:text-xl lg:leading-relaxed">
              <p>
                We're building open-source technology for local-first models, enabling personalized software experiences
                without sacrificing accessibility or privacy. We believe identity and memory are two sides of the same
                coin, and Tiles makes that coin yours: your user-agent. Our first product is an on-device memory
                management solution for privacy-conscious users, paired with an SDK that empowers developers to securely
                access user memory and customize agent experiences.
              </p>

              <hr className="border-black/10 my-8 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Philosophy
                </h2>

                <p className="mb-6 lg:mb-8">
                  Our goal with Tiles is to co-design both fine-tuned models and the underlying infrastructure and
                  developer tooling to maximize efficiency in local and offline systems for inference and training.
                </p>

                <p className="mb-6 lg:mb-8">
                  The project is defined by four interdependent design choices
                  <a href="#ref-1" className="text-blue-600 hover:text-blue-700">
                    ¹
                  </a>
                  :
                </p>

                <ol className="list-decimal list-inside space-y-5 lg:space-y-7 ml-4">
                  <li>
                    <strong>Device-anchored identity with keyless ops:</strong> Clients are provisioned through the
                    device keychain and cannot access the registry by identity alone
                    <a href="#ref-2" className="text-blue-600 hover:text-blue-700">
                      ²
                    </a>
                    . Keyless operations are only enabled after an identity is verified and linked to the device key,
                    allowing third-party agent access under user-defined policies
                    <a href="#ref-3" className="text-blue-600 hover:text-blue-700">
                      ³
                    </a>
                    .
                  </li>
                  <li>
                    <strong>Immutable model builds:</strong> Every build is version-locked and reproducible, ensuring
                    consistency and reliability across updates and platforms.
                  </li>
                  <li>
                    <strong>Content-hashed model layers:</strong> Models are stored and referenced by cryptographic
                    hashes of their layers, guaranteeing integrity and enabling efficient deduplication and sharing.
                  </li>
                  <li>
                    <strong>Verifiable transparency and attestations:</strong> Every signing and build event is logged
                    in an append-only transparency log, producing cryptographic attestations that can be independently
                    verified. This ensures accountability, prevents hidden modifications, and provides an auditable
                    history of model provenance across devices and registries.
                  </li>
                </ol>
              </section>

              <hr className="border-black/10 my-8 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Implementation
                </h2>

                <p className="mb-6 lg:mb-8">
                  Our software stack includes a macOS app and a Modelfile
                  <a href="#ref-4" className="text-blue-600 hover:text-blue-700">
                    ⁴
                  </a>
                  -based SDK. Tiles bundles a fine-tuned model to manage context and memories locally on-device with
                  hyperlinked markdown files. Currently, we use{" "}
                  <a
                    href="https://huggingface.co/driaforall/mem-agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                    mem-agent
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-2.5 w-2.5"
                    >
                      <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>{" "}
                  model (from{" "}
                  <a
                    href="https://dria.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                    Dria
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-2.5 w-2.5"
                    >
                      <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  , based on{" "}
                  <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm">qwen3-4B-thinking-2507</code>),
                  and are in the process of training our initial in-house memory models.
                </p>

                <div className="my-8 lg:my-12">
                  <Image
                    src="/cli.webp"
                    alt="Tiles CLI"
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <p className="mb-6 lg:mb-8">
                  Our first alpha is a CLI for Apple Silicon devices, complemented by a Modelfile based SDK that lets
                  developers customize local models and agent experiences within Tiles. We aim to evolve Modelfile in
                  collaboration with the community, establishing it as the standard for model customization.
                </p>

                <p className="mb-6 lg:mb-8">
                  These models utilize a human-readable external memory stored as markdown, and learned policies
                  (trained via reinforcement learning on synthetically generated data) to decide when to call Python
                  functions that retrieve, update, or clarify memory, allowing the assistant to maintain and refine
                  persistent knowledge across sessions.
                </p>
              </section>

              <hr className="border-black/10 my-8 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Looking forward
                </h2>

                <p className="mb-6 lg:mb-8">
                  We're building the next layer of private personalization: customizable memory, private sync,
                  verifiable identity, and a more open model ecosystem.
                </p>

                <ul className="list-disc space-y-4 pl-6 mb-6 lg:mb-8">
                  <li>
                    <strong>Memory extensions:</strong> Add support for LoRA-based memory extensions so individuals and
                    organizations can bring their own data and shape the assistant's behavior and tone on top of the
                    base memory model.
                  </li>
                  <li>
                    <strong>Sync:</strong> Build a reliable, peer-to-peer sync layer using{" "}
                    <a
                      href="https://www.iroh.computer/"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Iroh
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>{" "}
                    for private, device-to-device state sharing.
                  </li>
                  <li>
                    <strong>Identity:</strong> Ship a portable identity system using{" "}
                    <a
                      href="https://atproto.com/specs/did"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      AT Protocol DIDs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    , designed for device-anchored trust.
                  </li>
                  <li>
                    <strong>SDK and standards:</strong> Work with the{" "}
                    <a
                      href="https://darkshapes.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Darkshapes
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>{" "}
                    team to support the{" "}
                    <a
                      href="https://huggingface.co/darkshapes/MIR_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                    >
                      MIR
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>{" "}
                    (Machine Intelligence Resource) naming scheme in our Modelfile implementation.
                  </li>
                  <li>
                    <strong>Model distribution:</strong> Continue supporting Hugging Face, while designing a
                    decentralized registry for versioned, composable model layers using the open-source{" "}
                    <a
                      href="https://github.com/huggingface/xet-core"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      xet-core
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>{" "}
                    approach.
                  </li>
                  <li>
                    <strong>Research roadmap:</strong> As part of our research on private software personalization
                    infrastructure, we are investigating sparse memory finetuning, text diffusion models, Trusted
                    Execution Environments (TEEs), and Per-Layer Embeddings (PLE) with offloading to flash storage.
                  </li>
                </ul>

                <p>
                  We are seeking design partners for training workloads that align with our goal of ensuring a
                  verifiable privacy perimeter. If you're interested, please reach out to us at{" "}
                  <a href="mailto:hello@tiles.run" className="text-blue-600 hover:text-blue-700">
                    hello@tiles.run
                  </a>
                  .
                </p>
              </section>

              <hr className="border-black/10 my-8 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  References
                </h2>

                <ol className="list-decimal list-inside space-y-4">
                  <li id="ref-1">
                    <a
                      href="https://newsletter.squishy.computer/p/decentralizability"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Decentralizability, Gordon Brander
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li id="ref-2">
                    <a
                      href="https://keybase.io/blog/keybase-new-key-model"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Keybase's New Key Model
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li id="ref-3">
                    <a
                      href="https://www.sigstore.dev/how-it-works"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Sigstore: How It Works
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                  <li id="ref-4">
                    <a
                      href="https://docs.ollama.com/modelfile"
                      target="_blank"
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-black/80 underline"
                  >
                      Ollama Modelfile
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-2.5 w-2.5"
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                </ol>
              </section>
            </div>
          </article>

          {/* Newsletter Subscription Form */}
          <div className="mt-16 lg:mt-20 pt-12 lg:pt-16 border-t border-black/10">
            <div className="space-y-4 lg:space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2 lg:text-xl lg:mb-3">Stay updated</h3>
                <p className="text-sm text-black/60 lg:text-base">
                  Get notified when we publish new posts about privacy and personalization.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
