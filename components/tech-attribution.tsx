import Image from "next/image"

type TechAttributionVariant = "light" | "dark"

const techLogoClass =
  "inline-flex h-[1em] shrink-0 items-center align-[-0.12em] transition-opacity hover:opacity-75"
const rustLogoClass =
  "inline-flex h-[1.12em] w-[1.12em] shrink-0 items-center align-[-0.12em] transition-opacity hover:opacity-75"
const mlxLogoClass =
  "inline-flex h-[0.62em] shrink-0 items-center align-[-0.06em] transition-opacity hover:opacity-75"
const piLogoClass =
  "inline-flex h-[1.12em] w-[1.12em] shrink-0 items-center align-[-0.12em] transition-opacity hover:opacity-75"

function techLogoImageClass(variant: TechAttributionVariant) {
  return variant === "dark"
    ? "h-full w-auto max-w-none brightness-0 opacity-90 invert"
    : "h-full w-auto max-w-none brightness-0 opacity-90"
}

function TechLogo({
  href,
  src,
  label,
  width,
  height,
  variant,
  containerClass = techLogoClass,
  className = "",
}: {
  href: string
  src: string
  label: string
  width: number
  height: number
  variant: TechAttributionVariant
  containerClass?: string
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${containerClass} ${className}`}>
      <Image src={src} alt="" width={width} height={height} className={techLogoImageClass(variant)} aria-hidden />
      <span className="sr-only">{label}</span>
    </a>
  )
}

function MlxLogo({ variant }: { variant: TechAttributionVariant }) {
  return (
    <a
      href="https://mlx-framework.org"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="MLX"
      className={mlxLogoClass}
    >
      <Image
        src={variant === "light" ? "/icon-mlx-wordmark-light.png" : "/icon-mlx-wordmark.png"}
        alt=""
        width={805}
        height={276}
        className="h-full w-auto max-w-none"
        aria-hidden
      />
      <span className="sr-only">MLX</span>
    </a>
  )
}

type TechAttributionSize = "default" | "lg" | "intro"

const sizeClasses: Record<TechAttributionSize, string> = {
  default: "gap-x-2 gap-y-1.5 text-[0.72rem] font-medium leading-none sm:text-[0.76rem]",
  lg: "gap-x-3 gap-y-2 text-[0.8125rem] font-medium leading-none sm:gap-x-3.5 sm:text-[0.9rem] lg:text-[0.96rem]",
  intro:
    "gap-x-2.5 gap-y-2 text-[0.98rem] font-normal leading-[1.55] sm:gap-x-3 sm:text-[1rem]",
}

export function TechAttribution({
  className = "",
  variant = "dark",
  size = "default",
}: {
  className?: string
  variant?: TechAttributionVariant
  size?: TechAttributionSize
}) {
  const textColor = variant === "dark" ? "text-[#9A9A9A]" : "text-black/55"

  return (
    <div
      className={`flex flex-wrap items-center ${sizeClasses[size]} ${textColor} ${className}`}
    >
      <span className={size === "intro" ? "leading-[1.55]" : "leading-5"}>Built with</span>
      <TechLogo
        href="https://www.rust-lang.org"
        src="/icon-rust.svg"
        label="Rust"
        width={144}
        height={144}
        variant={variant}
        containerClass={rustLogoClass}
      />
      <MlxLogo variant={variant} />
      <TechLogo
        href="https://pi.dev"
        src="/icon-pi.svg"
        label="Pi"
        width={800}
        height={800}
        variant={variant}
        containerClass={piLogoClass}
      />
      <TechLogo
        href="https://atproto.com"
        src="/icon-atproto.png"
        label="ATProto"
        width={48}
        height={48}
        variant={variant}
      />
      <TechLogo href="https://www.iroh.computer" src="/icon-iroh-mark.svg" label="Iroh" width={64} height={64} variant={variant} />
    </div>
  )
}
