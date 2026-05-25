import Image from "next/image"
import { SQLCIPHER_MARK_LETTER_PATH, SQLCIPHER_MARK_SHACKLE_PATH } from "@/lib/sqlcipher-mark-path"

type TechAttributionVariant = "light" | "dark"
type TechAttributionSize = "default" | "lg" | "intro" | "section" | "hero"

const logoLinkClass = "inline-flex shrink-0 items-center transition-opacity hover:opacity-75"

function squareLogoClass(size: TechAttributionSize) {
  const align = "align-[-0.12em]"
  switch (size) {
    case "hero":
      return `${logoLinkClass} h-[1.15em] w-[1.15em] ${align}`
    case "section":
      return `${logoLinkClass} h-[1.2em] w-[1.2em] ${align}`
    case "lg":
      return `${logoLinkClass} h-[1.12em] w-[1.12em] ${align}`
    default:
      return `${logoLinkClass} h-[1em] w-[1em] ${align}`
  }
}

function mlxLogoClass(size: TechAttributionSize) {
  switch (size) {
    case "hero":
      return `${logoLinkClass} h-[0.68em] align-[-0.06em]`
    case "section":
      return `${logoLinkClass} h-[0.72em] align-[-0.06em]`
    case "lg":
      return `${logoLinkClass} h-[0.68em] align-[-0.06em]`
    default:
      return `${logoLinkClass} h-[0.62em] align-[-0.06em]`
  }
}

function sqlCipherLogoClass(size: TechAttributionSize) {
  return `${squareLogoClass(size)} justify-center text-inherit`
}

function SqlCipherLogo({
  containerClass,
  size = "default",
}: {
  containerClass?: string
  size?: TechAttributionSize
}) {
  return (
    <a
      href="https://www.zetetic.net/sqlcipher/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="SQLCipher"
      className={containerClass ?? sqlCipherLogoClass(size)}
    >
      <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
        <path fill="currentColor" d={SQLCIPHER_MARK_SHACKLE_PATH} />
        <rect
          x="24"
          y="42"
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="miter"
        />
        <path fill="currentColor" d={SQLCIPHER_MARK_LETTER_PATH} />
      </svg>
      <span className="sr-only">SQLCipher</span>
    </a>
  )
}

function techLogoImageClass(variant: TechAttributionVariant, size: TechAttributionSize = "default") {
  const opacity = size === "hero" ? "opacity-75" : "opacity-90"
  return variant === "dark"
    ? `h-full w-auto max-w-none brightness-0 ${opacity} invert`
    : `h-full w-auto max-w-none brightness-0 ${opacity}`
}

function TechLogo({
  href,
  src,
  label,
  width,
  height,
  variant,
  containerClass,
  className = "",
  size = "default",
}: {
  href: string
  src: string
  label: string
  width: number
  height: number
  variant: TechAttributionVariant
  containerClass?: string
  className?: string
  size?: TechAttributionSize
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[containerClass, className].filter(Boolean).join(" ")}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className={techLogoImageClass(variant, size)}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </a>
  )
}

function MlxLogo({ variant, size = "default" }: { variant: TechAttributionVariant; size?: TechAttributionSize }) {
  return (
    <a
      href="https://mlx-framework.org"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="MLX"
      className={mlxLogoClass(size)}
    >
      <Image
        src={variant === "light" ? "/icon-mlx-wordmark-light.png" : "/icon-mlx-wordmark.png"}
        alt=""
        width={805}
        height={276}
        className={techLogoImageClass(variant, size)}
        aria-hidden
      />
      <span className="sr-only">MLX</span>
    </a>
  )
}

const sizeClasses: Record<TechAttributionSize, string> = {
  default: "gap-x-2 gap-y-1.5 text-[0.72rem] font-medium leading-none sm:text-[0.76rem]",
  lg: "gap-x-3 gap-y-2 text-[0.8125rem] font-medium leading-none sm:gap-x-3.5 sm:text-[0.9rem] lg:text-[0.96rem]",
  intro:
    "gap-x-2.5 gap-y-2 text-[0.98rem] font-normal leading-[1.55] sm:gap-x-3 sm:text-[1rem]",
  section:
    "gap-x-2.5 gap-y-2.5 text-[clamp(1.02rem,2.6vw,1.2rem)] font-medium leading-[1.35] sm:gap-x-3 sm:text-[1.08rem] lg:text-[1.12rem]",
  hero: "gap-x-3 gap-y-2 text-inherit font-medium leading-[1.45] sm:gap-x-3.5",
}

export function TechAttribution({
  className = "",
  variant = "dark",
  size = "default",
  "aria-label": ariaLabel,
}: {
  className?: string
  variant?: TechAttributionVariant
  size?: TechAttributionSize
  "aria-label"?: string
}) {
  const textColor = size === "hero" ? "" : variant === "dark" ? "text-[#9A9A9A]" : "text-black/55"
  const squareLogo = squareLogoClass(size)

  return (
    <div
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center ${sizeClasses[size]} ${textColor} ${className}`.trim()}
    >
      <span
        className={
          size === "intro"
            ? "leading-[1.55]"
            : size === "section"
              ? "leading-[1.35]"
              : size === "hero"
                ? "leading-[1.4]"
                : "leading-5"
        }
      >
        Powered by
      </span>
      <TechLogo
        href="https://www.rust-lang.org"
        src="/icon-rust.svg"
        label="Rust"
        width={144}
        height={144}
        variant={variant}
        size={size}
        containerClass={squareLogo}
      />
      <MlxLogo variant={variant} size={size} />
      <TechLogo
        href="https://pi.dev"
        src="/icon-pi.svg"
        label="Pi"
        width={800}
        height={800}
        variant={variant}
        size={size}
        containerClass={squareLogo}
      />
      <TechLogo
        href="https://atproto.com"
        src="/icon-atproto.png"
        label="ATProto"
        width={48}
        height={48}
        variant={variant}
        size={size}
        containerClass={squareLogo}
      />
      <TechLogo
        href="https://www.iroh.computer"
        src="/icon-iroh-mark.svg"
        label="Iroh"
        width={64}
        height={64}
        variant={variant}
        size={size}
        containerClass={squareLogo}
      />
      <SqlCipherLogo size={size} />
    </div>
  )
}
