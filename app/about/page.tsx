import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white">
      {/* Back Link */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 text-sm text-black/60 transition-colors hover:text-black lg:left-6 lg:top-6 lg:text-base"
      >
        ← Back
      </Link>

      {/* Top Bar */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 lg:right-6 lg:top-6 lg:gap-3">
        <Button
          asChild
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 lg:px-5"
        >
          <a href="https://download.tiles.run/" className="flex items-center gap-2">
            <Image
              src="/apple-logo-white.svg"
              alt="Apple"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>Download</span>
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-2 border-black bg-white px-5 py-2 text-sm font-medium text-black hover:bg-black/5 lg:px-6"
        >
          <a href="https://registry.tiles.run/login">Login</a>
        </Button>
      </div>

      {/* Centered Content */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 lg:px-12">
        <div className="w-full max-w-2xl text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-3 lg:mb-8 lg:gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm lg:h-14 lg:w-14">
              <Image
                src="/logo.png"
                alt="Tiles Logo"
                width={40}
                height={40}
                className="h-7 w-7 lg:h-10 lg:w-10"
              />
            </div>
            <h1 className="text-3xl font-bold text-black lg:text-5xl">Tiles Privacy</h1>
          </Link>
          
          <div className="space-y-5 text-sm leading-relaxed text-black/80 lg:space-y-6 lg:text-base lg:leading-relaxed">
            <p className="text-base font-medium text-black lg:text-lg">
              Our mission is to shape the future of software personalization with decentralized memory networks.
            </p>

            <p>
              Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you. We strive to deliver the best privacy-focused engineering while also offering unmatched convenience in our consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both through your personal user agent.
            </p>

            <p>
              Founded by Ankesh Bharti (
              <a
                href="https://x.com/feynon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-2 hover:text-black/70"
              >
                @feynon
              </a>
              ), an applied researcher and technologist focused on on-device AI and secure identity, Tiles is built for privacy conscious users who want intelligence without renting their memory to centralized providers. Our first product is an on-device memory management system paired with an SDK that lets developers securely access user memory and create deeply personalized agent experiences.
            </p>

            <p>
              We are seeking design partners for training workloads that align with our goal of ensuring a verifiable privacy perimeter. If you're interested, please reach out to us at{" "}
              <a
                href="mailto:hello@tiles.run"
                className="text-black underline underline-offset-2 hover:text-black/70"
              >
                hello@tiles.run
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
