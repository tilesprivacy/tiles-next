import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"

export default function ManifestoPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex items-center gap-2 text-base font-medium text-black lg:text-lg">
          <Link href="/" className="transition-colors hover:text-black/70">
            <Image src="/lighticon.png" alt="Tiles" width={32} height={32} className="h-7 w-7 lg:h-8 lg:w-8" />
          </Link>
          <span className="text-black/30">/</span>
          <Link href="/manifesto" className="font-bold transition-colors hover:text-black/70">
            Manifesto
          </Link>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src="/apple-logo-white.svg"
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
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

      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        {/* Content */}
        <main className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20 px-6 pb-20 pt-16 lg:px-12 lg:pb-32 lg:pt-20 w-full max-w-7xl mx-auto">
          <div className="w-full max-w-2xl text-justify">
            <div className="space-y-6 text-sm leading-relaxed text-black/80 sm:text-base lg:space-y-8 lg:text-xl lg:leading-relaxed">
              <p className="text-base font-medium text-black sm:text-lg lg:text-2xl">
                Our mission is to shape the future of software personalization with decentralized memory networks.
              </p>

              <p>
                Tiles Privacy was born from the{" "}
                <a
                  href="https://userandagents.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black hover:text-black/70 underline"
                >
                  User &amp; Agents
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
                community with a simple idea: software should understand you without taking anything from you. We strive
                to deliver the best privacy-focused engineering while also offering unmatched convenience in our
                consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both
                through your personal user agent.
              </p>

              <p>
                Founded by Ankesh Bharti (
                <a
                  href="https://x.com/feynon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black hover:text-black/70 underline"
                >
                  @feynon
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
                ), an independent researcher and technologist, Tiles is
                built for privacy conscious users who want intelligence without renting their memory to centralized
                providers. Our first product is an on-device memory management system paired with an SDK that lets
                developers securely access user memory and create deeply personalized agent experiences.
              </p>
            </div>
          </div>
          
          {/* Contributors & Sponsors Section */}
          <div className="w-full lg:w-auto lg:min-w-[220px] lg:max-w-[280px] mt-8 lg:mt-0">
            <div className="space-y-8">
              {/* Contributors */}
              <div>
                <h2 className="text-lg font-semibold text-black mb-4 lg:text-xl">Contributors</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-black/60 mb-2 lg:text-base">Keep Ankesh and Anandu in Core</h3>
                    <div className="space-y-1.5">
                      <div className="text-sm text-black/80 lg:text-base">Ankesh Bharti</div>
                      <div className="text-sm text-black/80 lg:text-base">Anandu Pavanan</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black/60 mb-2 lg:text-base">Keep Kshitij in Community</h3>
                    <div className="space-y-1.5">
                      <div className="text-sm text-black/80 lg:text-base">Kshitij Taneja</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sponsors */}
              <div>
                <h2 className="text-lg font-semibold text-black mb-4 lg:text-xl">Sponsors</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-black/60 mb-2 lg:text-base">Active:</h3>
                    <div className="space-y-1.5">
                      <div className="text-sm text-black/80 lg:text-base">Luke Hubbard</div>
                      <div className="text-sm text-black/80 lg:text-base">Dietrich Ayala</div>
                      <div className="text-sm text-black/80 lg:text-base">Xi Zhang</div>
                      <div className="text-sm text-black/80 lg:text-base">Hugo Duprez</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black/60 mb-2 lg:text-base">Past:</h3>
                    <div className="space-y-1.5">
                      <div className="text-sm text-black/80 lg:text-base">Boris Mann</div>
                      <div className="text-sm text-black/80 lg:text-base">Seref Yarar</div>
                      <div className="text-sm text-black/80 lg:text-base">Curran Dwyer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}
