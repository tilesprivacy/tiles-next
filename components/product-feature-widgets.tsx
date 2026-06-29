import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bot, Cpu, FileCode, KeyRound, Link as LinkIcon, Package, RefreshCw, Share2 } from "lucide-react"
import { SHOW_REMOTE_LINK } from "@/lib/feature-flags"
import { marketingPageSubsectionTitleClass } from "@/lib/marketing-page-title-classes"

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
        <div className="flex items-center gap-2.5 text-black/72 dark:text-[#D6D6D8] sm:gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-black/52 dark:text-white/58 [&>span]:text-[1.05rem] [&>span]:leading-none [&>span]:font-semibold [&_svg]:h-4.5 [&_svg]:w-4.5 [&_svg]:stroke-[1.85]">
            {icon}
          </span>
          <h3 className="min-w-0 text-[0.9rem] font-normal leading-snug tracking-[-0.005em] sm:text-[0.94rem] lg:text-[0.98rem] [&_a]:text-inherit [&_a]:no-underline [&_a]:transition-opacity [&_a]:hover:opacity-80">
            {title}
          </h3>
        </div>
      </article>
    )
  }

  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 sm:gap-y-2.5">
      <span className="row-start-1 flex h-9 w-9 self-center items-center justify-center rounded-lg bg-black/5 text-foreground dark:bg-white/10 [&>span]:text-base [&>span]:font-semibold [&>span]:leading-none [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <h3 className={`row-start-1 m-0 min-w-0 -translate-y-px self-center !leading-[1.15] ${marketingPageSubsectionTitleClass}`}>{title}</h3>
      <div className="col-start-2 row-start-2 text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] lg:text-base">
        {children}
      </div>
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
      ? "grid grid-cols-2 gap-x-4 gap-y-3.5 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-4 lg:grid-cols-3 min-[1180px]:grid-cols-4"
      : "grid gap-7 sm:gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12"

  return (
    <div className={[gridClass, className].filter(Boolean).join(" ")}>
      <FeatureWidget variant={variant} icon={<Bot strokeWidth={1.75} />} title="Agent Harness">
        Native{" "}
        <a href="https://pi.dev" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Pi
        </a>{" "}
        agent harness for knowledge work, built around{" "}
        <span className="inline-flex items-center gap-1.5 rounded bg-black/[0.045] px-1.5 py-0.5 align-baseline dark:bg-white/[0.08]">
          <Image src="/openai-logo.svg" alt="OpenAI logo" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-[0.95em]">gpt-oss-20b</span>
        </span>
        .
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<Cpu strokeWidth={1.75} />} title="On-device Models">
        Built-in on-device models with{" "}
        <Link href="/book/tilekit#modelfile-reference" className={featureLinkClass}>
          Modelfile
        </Link>{" "}
        support for building and sharing custom weights. Powered by{" "}
        <a
          href="https://ml-explore.github.io/mlx/build/html/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={featureLinkClass}
        >
          MLX
        </a>{" "}
        on Apple Silicon and{" "}
        <a href="https://llama.app" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          llama.cpp
        </a>{" "}
        on Linux.
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<KeyRound strokeWidth={1.75} />} title="User Owned Identity">
        User-owned identity with Decentralized Identifiers{" "}
        <a href="https://www.w3.org/TR/did-1.1/" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          (DIDs)
        </a>{" "}
        and User Controlled Authorization Networks{" "}
        <a href="https://ucan.xyz" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          (UCANs)
        </a>{" "}
        for authorization.
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<RefreshCw strokeWidth={1.75} />} title="P2P Sync">
        E2EE peer-to-peer chat sync across linked devices, online or on your local network, via{" "}
        <a href="https://www.iroh.computer/" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Iroh
        </a>
        .
      </FeatureWidget>

      {SHOW_REMOTE_LINK ? (
        <FeatureWidget variant={variant} icon={<LinkIcon strokeWidth={1.75} />} title="Remote Link">
          Reach your local assistant across devices with a secure remote link.
        </FeatureWidget>
      ) : null}

      <FeatureWidget
        variant={variant}
        icon={<Share2 strokeWidth={1.75} />}
        title="Shared Links"
      >
        Create a public or private link to a chat session, published through{" "}
        <a href="https://atproto.com" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          ATProto
        </a>
        .
      </FeatureWidget>

      <FeatureWidget variant={variant} icon={<Package strokeWidth={1.75} />} title="Offline Installer">
        Fully offline installer for secure, air-gapped installations.
      </FeatureWidget>

      <FeatureWidget
        variant={variant}
        icon={<FileCode strokeWidth={1.75} />}
        title={
          variant === "book" ? (
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
          ) : (
            "Developer SDK"
          )
        }
      >
        Use Tilekit as an app server runtime within your own app, built on open standards such as the{" "}
        <a href="https://www.openresponses.org" target="_blank" rel="noopener noreferrer" className={featureLinkClass}>
          Open Responses API
        </a>
        .
      </FeatureWidget>
    </div>
  )
}
