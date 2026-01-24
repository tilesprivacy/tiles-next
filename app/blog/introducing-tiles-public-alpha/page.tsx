'use client'

import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import NewsletterForm from "@/components/newsletter-form"
import { BlogReference } from "@/components/blog-reference"
import { ReadingTime } from "@/components/reading-time"
import { blogPosts } from "@/lib/blog-posts"

export default function HowTilesWorksPage() {
  const post = blogPosts.find(p => p.slug === "introducing-tiles-public-alpha")

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteHeader themeAware />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-32 pb-20 lg:px-6 lg:pt-32 lg:pb-24 gap-6 lg:gap-12 overflow-x-hidden">
        {/* Bottom Card - Blog Post Content */}
        <div className="w-full max-w-2xl px-4 py-6 lg:px-16 lg:py-16 relative">
          {/* Blog Title */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl font-semibold text-black dark:text-[#E6E6E6] mb-4 lg:text-6xl lg:mb-5 tracking-tight">
              Introducing Tiles Public Alpha
            </h1>
            <p className="text-base text-black/50 dark:text-[#8A8A8A] lg:text-xl mb-3 lg:mb-4">
              Building an everyday AI assistant with privacy-first engineering at its core.
            </p>
            <div className="flex items-center gap-3 lg:gap-4">
              <p className="text-sm text-black/40 dark:text-[#8A8A8A] lg:text-lg">January 2, 2026</p>
              {post && (
                <>
                  <span className="text-black/20 dark:text-[#5a5a5a]">·</span>
                  <ReadingTime 
                    content={post.content} 
                    className="text-sm text-black/40 dark:text-[#8A8A8A] lg:text-lg"
                  />
                </>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-8 lg:mb-16">
            <Image
              src="/kingston.webp"
              alt="Cover image for Introducing Tiles Public Alpha"
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <article className="blog-article-container relative">
            {/* Container for side references on desktop */}
            <div className="blog-reference-container hidden lg:block absolute left-0 top-0 w-full h-full pointer-events-none" />

            <div className="space-y-6 text-base leading-relaxed text-black/70 dark:text-[#B3B3B3] lg:space-y-10 lg:text-xl lg:leading-relaxed relative z-10">
              <p>
                Today, we're releasing the public alpha of Tiles, our first step toward a privacy-first AI assistant built to run entirely on the user's device. Tiles brings together local-first models, personalized experiences, and verifiable privacy guarantees, so data remains under the user's control by default. We see identity and memory as inseparable parts of the same system, and Tiles is designed around that idea: an AI assistant that acts as a user-owned agent rather than a centralized service.
              </p>

              <p className="mb-6 lg:mb-8">
                Our first alpha is a CLI assistant app for Apple Silicon devices, and a Modelfile
                <BlogReference id={1}>
                  <a
                    href="https://docs.ollama.com/modelfile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/45 dark:text-[#8A8A8A] hover:text-black/60 dark:hover:text-[#B3B3B3] underline decoration-black/20 dark:decoration-[#5a5a5a] hover:decoration-black/30 dark:hover:decoration-[#8A8A8A] underline-offset-2 transition-colors"
                  >
                    Ollama Modelfile
                  </a>
                  <span className="text-black dark:text-[#E6E6E6]">{" "}is the blueprint to create and share customized models using Ollama.</span>
                </BlogReference>
                {" "}based SDK that lets developers customize local models and agent experiences within Tiles. We aim to evolve Modelfile in
                collaboration with the community, establishing it as the standard for model customization.
              </p>

              <hr className="border-black/10 dark:border-[#2a2a2a] my-10 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-[#E6E6E6] mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Philosophy
                </h2>

                <p className="mb-6 lg:mb-8">
                  Our goal with Tiles is to co-design fine-tuned models and the underlying ML infrastructure to maximize efficiency for local and offline inference and training.
                </p>

                <p className="mb-6 lg:mb-8">
                  The project is defined by four interdependent design choices:
                  <BlogReference id={2}>
                    <span className="text-black dark:text-[#E6E6E6]">From </span>
                    <a
                      href="https://newsletter.squishy.computer/p/decentralizability"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/45 dark:text-[#8A8A8A] hover:text-black/60 dark:hover:text-[#B3B3B3] underline decoration-black/20 dark:decoration-[#5a5a5a] hover:decoration-black/30 dark:hover:decoration-[#8A8A8A] underline-offset-2 transition-colors"
                    >
                      Decentralizability
                    </a>
                    <span className="text-black dark:text-[#E6E6E6]"> (Gordon Brander): Immutable data, universal IDs, user-controlled keys… and just using HTTP. I think this is probably minimum viable decentralizability.</span>
                  </BlogReference>
                 
                </p>

                <ol className="list-decimal list-inside space-y-5 lg:space-y-7 ml-4">
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Device-anchored identity with keyless ops:</strong> Clients are provisioned through the
                    device keychain and cannot access the registry by identity alone.
                    <BlogReference id={3}>
                      <a
                        href="https://keybase.io/blog/keybase-new-key-model"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/45 dark:text-[#8A8A8A] hover:text-black/60 dark:hover:text-[#B3B3B3] underline decoration-black/20 dark:decoration-[#5a5a5a] hover:decoration-black/30 dark:hover:decoration-[#8A8A8A] underline-offset-2 transition-colors"
                      >
                        Keybase's New Key Model
                      </a>
                    </BlogReference>
                    Keyless operations are only enabled after an identity is verified and linked to the device key,
                    allowing third-party agent access under user-defined policies.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Immutable model builds:</strong> Every build is version-locked and reproducible, ensuring
                    consistency and reliability across updates and platforms.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Content-hashed model layers:</strong> Models are stored and referenced by cryptographic
                    hashes of their layers, guaranteeing integrity and enabling efficient deduplication and sharing.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Verifiable transparency and attestations:</strong> Every signing and build event is logged
                    in an append-only transparency log, producing cryptographic attestations that can be independently
                    verified. This ensures accountability, prevents hidden modifications, and provides an auditable
                    history of model provenance across devices and registries.
                  </li>
                </ol>
              </section>

              <hr className="border-black/10 dark:border-[#2a2a2a] my-10 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-[#E6E6E6] mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Implementation
                </h2>

                <p className="mb-6 lg:mb-8">
                  In our regular Tiles builds, we support running fully offline models, models pulled directly from the Hugging Face registry, and a built-in code interpreter for executing Python functions. We use{" "}
                  <a
                    href="https://venvstacks.lmstudio.ai/overview/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
                  >
                    venvstacks
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
                  , layered Python virtual environments, to ensure Tiles does not interfere with system dependencies and remains portable across platforms.
                </p>

                <div className="my-8 lg:my-12">
                  <Image
                    src="/newtilescli.png"
                    alt="Tiles CLI - Your private AI assistant running locally"
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                <p className="mb-6 lg:mb-8">
                  We also offer an Insiders channel that includes experimental features, including our AI memory capabilities powered by fine-tuned memory models that manage context and memories locally on-device with hyperlinked markdown files. Currently, we use{" "}
                  <a
                    href="https://huggingface.co/driaforall/mem-agent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                    className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                  <code className="rounded bg-black/5 dark:bg-[#1a1a1a] px-1.5 py-0.5 font-mono text-sm text-black dark:text-[#E6E6E6]">qwen3-4B-thinking-2507</code>),
                  and are in the process of training our initial in-house memory models.
                </p>

                <p className="mb-6 lg:mb-8">
                  These models utilize a human-readable external memory stored as markdown, and learned policies
                  (trained via reinforcement learning on synthetically generated data) to decide when to call Python
                  functions that retrieve, update, or clarify memory, allowing the assistant to maintain and refine
                  persistent knowledge across sessions.
                </p>
              </section>

              <hr className="border-black/10 dark:border-[#2a2a2a] my-10 lg:my-12" />

              <section>
                <h2 className="text-2xl font-semibold text-black dark:text-[#E6E6E6] mb-6 lg:text-4xl lg:mb-8 tracking-tight">
                  Looking forward
                </h2>

                <p className="mb-6 lg:mb-8">
                  We're building the next layer of private personalization: customizable memory, private sync,
                  verifiable identity, and a more open model ecosystem.
                </p>

                <ul className="list-disc space-y-4 pl-6 mb-6 lg:mb-8">
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Memory extensions:</strong> Add support for LoRA-based memory extensions so individuals and
                    organizations can bring their own data and shape the assistant's behavior and tone on top of the
                    base memory model.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Sync:</strong> Build a reliable, peer-to-peer sync layer using{" "}
                    <a
                      href="https://www.iroh.computer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                    <strong className="text-black dark:text-[#E6E6E6]">Identity:</strong> Ship a portable identity system using{" "}
                    <a
                      href="https://atproto.com/specs/did"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                    <strong className="text-black dark:text-[#E6E6E6]">Modelfile SDK:</strong> Work with the{" "}
                    <a
                      href="https://darkshapes.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                    (Machine Intelligence Resource) naming scheme and integrate{" "}
                    <a
                      href="https://dspy.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
                    >
                      DSPy
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
                    for prompt optimization in our Modelfile implementation.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Registry:</strong> Continue supporting Hugging Face, while designing a
                    decentralized registry for versioned, composable model layers using the open-source{" "}
                    <a
                      href="https://github.com/huggingface/xet-core"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
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
                    client tech.
                  </li>
                  <li>
                    <strong className="text-black dark:text-[#E6E6E6]">Research roadmap:</strong> As part of our research on private software personalization
                    infrastructure, we are investigating sparse memory finetuning, text diffusion models, Trusted
                    Execution Environments (TEEs), and Per-Layer Embeddings (PLE) with offloading to flash storage.
                  </li>
                </ul>

                <p>
                  We are seeking design partners for training workloads that align with our goal of ensuring a
                  verifiable privacy perimeter. If you're interested, please reach out to us at{" "}
                  <a href="mailto:hello@tiles.run" className="text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline">
                    hello@tiles.run
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>

          {/* Blog Footer Text */}
          <div className="mt-16 lg:mt-20">
            <div className="space-y-2 text-xs text-black/60 dark:text-[#8A8A8A] lg:space-y-3 lg:text-sm mb-8 lg:mb-10">
              <p>
                You're reading the{" "}
                <a
                  href="https://tiles.run"
                  className="text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline"
                >
                  Tiles
                </a>{" "}
                blog.
              </p>
              <p>
              Tiles is a private AI assistant for everyday use.
              </p>
              <p>
                There are{" "}
                <Link href="/blog" className="text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline">
                  more posts
                </Link>
                .
              </p>
              <p>
                When you're done, you can{" "}
                <Link href="/download" className="text-black dark:text-[#E6E6E6] hover:text-black/80 dark:hover:text-[#B3B3B3] underline">
                  install Tiles
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Newsletter Subscription Form */}
          <div className="pt-12 lg:pt-16 border-t border-black/10 dark:border-[#2a2a2a]">
            <div className="space-y-4 lg:space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-[#E6E6E6] mb-2 lg:text-xl lg:mb-3">Stay updated</h3>
                <p className="text-sm text-black/60 dark:text-[#B3B3B3] lg:text-base">
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
