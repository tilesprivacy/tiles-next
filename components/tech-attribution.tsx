import Image from "next/image"

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

function llamaCppLogoClass(size: TechAttributionSize) {
  const align = "align-[-0.12em]"
  switch (size) {
    case "hero":
      return `${logoLinkClass} h-[1.02em] w-[1.02em] items-center justify-center ${align}`
    case "section":
      return `${logoLinkClass} h-[1.06em] w-[1.06em] items-center justify-center ${align}`
    case "lg":
      return `${logoLinkClass} h-[1em] w-[1em] items-center justify-center ${align}`
    default:
      return `${logoLinkClass} h-[0.9em] w-[0.9em] items-center justify-center ${align}`
  }
}

function rustLogoClass(size: TechAttributionSize) {
  const align = "align-[-0.12em]"
  switch (size) {
    case "hero":
      return `${logoLinkClass} h-[1.36em] w-[1.36em] ${align}`
    case "section":
      return `${logoLinkClass} h-[1.42em] w-[1.42em] ${align}`
    case "lg":
      return `${logoLinkClass} h-[1.32em] w-[1.32em] ${align}`
    default:
      return `${logoLinkClass} h-[1.18em] w-[1.18em] ${align}`
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

function piLogoClass(size: TechAttributionSize) {
  const align = "align-[-0.12em]"
  switch (size) {
    case "hero":
      return `${logoLinkClass} h-[1.32em] w-[1.32em] ${align}`
    case "section":
      return `${logoLinkClass} h-[1.38em] w-[1.38em] ${align}`
    case "lg":
      return `${logoLinkClass} h-[1.28em] w-[1.28em] ${align}`
    default:
      return `${logoLinkClass} h-[1.15em] w-[1.15em] ${align}`
  }
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
  hero: "gap-x-3 gap-y-2 text-[0.9rem] font-medium leading-snug tracking-[-0.005em] sm:gap-x-3.5 sm:text-[0.94rem] lg:text-[0.98rem]",
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
                ? "leading-snug"
                : "leading-5"
        }
      >
        Built with
      </span>
      <TechLogo
        href="https://www.rust-lang.org"
        src="/icon-rust.svg"
        label="Rust"
        width={144}
        height={144}
        variant={variant}
        size={size}
        containerClass={rustLogoClass(size)}
      />
      <MlxLogo variant={variant} size={size} />
      <TechLogo
        href="https://llama.app"
        src="/icon-llamacpp.svg"
        label="llama.cpp"
        width={600}
        height={600}
        variant={variant}
        size={size}
        containerClass={llamaCppLogoClass(size)}
      />
      <TechLogo
        href="https://pi.dev"
        src="/icon-pi.svg"
        label="Pi"
        width={800}
        height={800}
        variant={variant}
        size={size}
        containerClass={piLogoClass(size)}
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
      <TechLogo
        href="https://atproto.com"
        src="/icon-atproto.png"
        label="ATproto"
        width={48}
        height={48}
        variant={variant}
        size={size}
        containerClass={squareLogo}
      />
    </div>
  )
}
