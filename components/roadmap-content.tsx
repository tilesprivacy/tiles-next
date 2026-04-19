import { SiteFooter } from "@/components/site-footer"

type RoadmapStatus = 'shipped' | 'active' | 'planned'

interface RoadmapItem {
  label: string
  status: RoadmapStatus
}

interface RoadmapTrack {
  label: string
  items: RoadmapItem[]
}

const roadmapTracks: RoadmapTrack[] = [
  {
    label: 'Harness',
    items: [
      { label: 'Pi integration', status: 'active' },
      { label: 'Connectors support', status: 'planned' },
      { label: 'Automatic LoRA adapter training', status: 'planned' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { label: 'Mac backend with MLX', status: 'shipped' },
      { label: 'Modelfile support', status: 'shipped' },
      { label: 'Offline Installer', status: 'shipped' },
      { label: 'Apple Foundation Model support', status: 'planned' },
      { label: 'MIR integration', status: 'planned' },
      { label: 'TEE-based cloud models', status: 'planned' },
      { label: 'Continuous batching and KV cache improvements', status: 'planned' },
      { label: 'Modelfile deduplication and caching', status: 'planned' },
    ],
  },
  {
    label: 'Identity',
    items: [
      { label: 'DID-based local accounts', status: 'shipped' },
      { label: 'ATProto support', status: 'active' },
    ],
  },
  {
    label: 'Sync',
    items: [
      { label: 'Peer-to-peer encrypted sync', status: 'shipped' },
      { label: 'Shared Links', status: 'active' },
      { label: 'Remote link', status: 'planned' },
      { label: 'Capability based Sync', status: 'planned' },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Notarized builds', status: 'shipped' },
      { label: 'MicroVM Sandbox', status: 'planned' },
      {
        label:
          'Runtime hardening with Stage-2 hypervisor memory isolation and HW backed attestation',
        status: 'planned',
      },
    ],
  },
]

const roadmapLegend = [
  { label: 'Stable', status: 'shipped' as const },
  { label: 'Experimental', status: 'active' as const },
  { label: 'Future', status: 'planned' as const },
]

const roadmapCtaClass =
  'inline-flex items-center gap-1 rounded-sm border border-black/5 bg-black/[0.045] px-4 py-2 text-sm font-medium text-foreground shadow-none transition-colors hover:bg-black/[0.08] dark:border-white/5 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] lg:text-base'

const paragraphClass = 'text-sm leading-relaxed text-foreground/90'

const getRoadmapItemClassName = (status: RoadmapStatus) => {
  switch (status) {
    case 'shipped':
      return 'border-[#171717] bg-[#171717] text-white dark:border-white dark:bg-white dark:text-black'
    case 'active':
      return 'border-[#262626] bg-transparent text-[#171717] dark:border-white/85 dark:text-white'
    case 'planned':
      return 'border-[#bdbdbd] border-dashed bg-transparent text-black/56 dark:border-white/24 dark:text-white/42'
    default:
      return ''
  }
}

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="inline-block h-2.5 w-2.5 align-baseline"
    style={{ verticalAlign: 'baseline' }}
  >
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function RoadmapContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <section
          id="roadmap"
          className="mb-10 px-2 pb-10 scroll-mt-28 sm:px-4 lg:mb-12 lg:px-0 lg:pb-12 lg:scroll-mt-40"
        >
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-[3.6rem] font-normal leading-[0.92] tracking-[-0.08em] text-foreground sm:text-[4.25rem] lg:mb-4 lg:text-6xl">
              Roadmap
            </h1>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:mb-10">
              The current focus is on building a basic chat experience. In the near future we are adding connector
              support, introduced only with proper sandboxing, and a documented threat model.
            </p>
            <div className="mb-10">
              <div className="mb-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
                {roadmapLegend.map((item) => (
                  <div key={item.label} className="inline-flex items-center gap-2">
                    <span
                      className={`h-5 w-11 border-[2px] ${getRoadmapItemClassName(item.status)}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-10 lg:space-y-12">
                {roadmapTracks.map((track) => (
                  <div key={track.label} className="space-y-5">
                    <h2 className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-foreground/85 sm:text-sm">
                      {track.label}
                    </h2>
                    <div className="pb-1">
                      <div className="flex flex-wrap items-start gap-3 lg:gap-2.5 lg:gap-y-4">
                        {track.items.map((item, itemIndex) => (
                          <div key={item.label} className="contents">
                            <div
                              className={`inline-flex min-h-[3.35rem] items-center border-[2px] px-5 py-2.5 text-sm font-normal tracking-[-0.02em] ${getRoadmapItemClassName(item.status)} lg:min-h-[3.2rem]`}
                            >
                              {item.label}
                            </div>
                            {itemIndex < track.items.length - 1 && (
                              <div
                                className="hidden h-[3.2rem] w-8 items-center justify-center text-black/18 dark:text-white/18 lg:flex"
                                aria-hidden="true"
                              >
                                <svg viewBox="0 0 32 12" className="h-3 w-8" fill="none">
                                  <path d="M1 7H33" stroke="currentColor" strokeWidth="2" />
                                  <path d="M27 2L33 7L27 12" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className={`mb-5 ${paragraphClass}`}>
              If you would like to influence how we implement this roadmap, join the discussion in our RFCs.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://github.com/orgs/tilesprivacy/projects/4"
                target="_blank"
                rel="noopener noreferrer"
                className={roadmapCtaClass}
              >
                Track progress
                <ExternalLinkIcon />
              </a>
              <a
                href="https://github.com/orgs/tilesprivacy/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className={roadmapCtaClass}
              >
                View the RFCs
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
