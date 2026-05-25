import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bot, Cpu, FileCode, KeyRound, Package, RefreshCw } from "lucide-react"

type ProductFeatureWidgetsVariant = "book" | "home"

function FeatureWidget({
  icon,
  title,
  children,
  variant,
}: {
  icon: ReactNode
  title: ReactNode
  children: ReactNode
  variant: ProductFeatureWidgetsVariant
}) {
  if (variant === "home") {
    return (
      <article className="min-w-0">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-black/38 dark:text-[#8A8A8A] sm:mt-1 sm:h-9 sm:w-9">
            {icon}
          </span>
          <div className="min-w-0 space-y-2 sm:space-y-2.5">
            <h3 className="text-[1.02rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.06rem]">
              {title}
            </h3>
            <div className="max-w-[32rem] text-[0.98rem] leading-[1.58] text-black/58 dark:text-[#ADADAD] sm:text-[1rem] sm:leading-[1.55]">
              {children}
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 text-foreground dark:bg-white/10">
          {icon}
        </span>
        <h3 className="text-base font-semibold text-foreground lg:text-lg">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] lg:text-base">{children}</div>
    </div>
  )
}

const bookFeatureLinkClass =
  "font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"

const homeFeatureLinkClass =
  "underline decoration-black/30 underline-offset-4 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"

export function ProductFeatureWidgets({
  className,
  variant = "book",
}: {
  className?: string
  variant?: ProductFeatureWidgetsVariant
}) {
  const featureLinkClass = variant === "home" ? homeFeatureLinkClass : bookFeatureLinkClass
  const gridClass =
    variant === "home"
      ? "grid grid-cols-1 gap-11 sm:gap-12 min-[900px]:grid-cols-2 min-[900px]:gap-x-12 min-[900px]:gap-y-14 lg:gap-x-14 lg:gap-y-16 xl:gap-x-16 [&>*:last-child:nth-child(odd)]:min-[900px]:col-span-2 [&>*:last-child:nth-child(odd)]:min-[900px]:max-w-[34rem]"
      : "grid gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12"

  return (
    <div className={[gridClass, className].filter(Boolean).join(" ")}>
      <FeatureWidget variant={variant} icon={<Bot className="h-4 w-4" strokeWidth={1.75} />} title="Agent Harness">
        Native{" "}
        <a href="https://pi.dev" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Pi
        </a>{" "}
        agent harness for knowledge work, built around{" "}
        <span className="inline-flex items-center gap-1.5 rounded bg-black/[0.045] px-1.5 py-0.5 align-baseline dark:bg-white/[0.08]">
          <Image src="/openai-logo.svg" alt="OpenAI logo" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-[0.95em]">gpt-oss-20b</span>
        </span>{" "}
        powered on-device by{" "}
        <a
          href="https://ml-explore.github.io/mlx/build/html/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={featureLinkClass}
        >
          MLX
        </a>
        .
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<Cpu className="h-4 w-4" strokeWidth={1.75} />} title="On-device Models">
        Sensible default on-device models with{" "}
        <Link href="/book/tilekit#modelfile-reference" className={featureLinkClass}>
          Modelfile
        </Link>{" "}
        support for building and sharing weights. Powered by{" "}
        <a
          href="https://ml-explore.github.io/mlx/build/html/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={featureLinkClass}
        >
          MLX
        </a>{" "}
        on Apple Silicon.
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<KeyRound className="h-4 w-4" strokeWidth={1.75} />} title="Decentralized Identity">
        Locally generated{" "}
        <a href="https://www.w3.org/TR/did-core/" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          DIDs
        </a>
        , with the private key always stored locally on device.
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<RefreshCw className="h-4 w-4" strokeWidth={1.75} />} title="P2P Sync">
        Encrypted peer-to-peer sync for chats across your linked devices, online or on your local network, with{" "}
        <a href="https://www.iroh.computer/" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Iroh&apos;s
        </a>{" "}
        QUIC networking stack.
      </FeatureWidget>

      <FeatureWidget
        variant={variant}
        icon={<span className="text-base font-semibold leading-none">@</span>}
        title="Shared Links"
      >
        Create a public or private link to a chat session, published through{" "}
        <a href="https://atproto.com" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          ATProto
        </a>
        .
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<Package className="h-4 w-4" strokeWidth={1.75} />} title="Offline Installer">
        Fully offline installer for secure, air-gapped installations.
      </FeatureWidget>

      <FeatureWidget
        variant={variant}
        icon={<FileCode className="h-4 w-4" strokeWidth={1.75} />}
        title={
          <Link
            href="/book/tilekit"
            className="inline-flex items-baseline gap-1 !no-underline decoration-transparent hover:!no-underline"
          >
            <span>Developer SDK</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="inline-block h-2.5 w-2.5 align-baseline opacity-70"
              aria-hidden="true"
            >
              <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        }
      >
        Use Tilekit as an app-server runtime to integrate identity, memory, sync, and agents in your own app,
        built with standards like{" "}
        <a href="https://www.openresponses.org" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Open Responses API
        </a>
        .
      </FeatureWidget>
    </div>
  )
}
