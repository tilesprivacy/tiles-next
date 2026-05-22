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

export function TechAttribution({
  className = "",
  variant = "dark",
}: {
  className?: string
  variant?: TechAttributionVariant
}) {
  const textColor = variant === "dark" ? "text-[#9A9A9A]" : "text-black/55"

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.72rem] font-medium leading-none ${textColor} sm:text-[0.76rem] ${className}`}
    >
      <span className="leading-5">Built with</span>
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
