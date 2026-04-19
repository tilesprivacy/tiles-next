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
      { label: 'Memory support', status: 'planned' },
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
      { label: 'DID:key based local accounts', status: 'shipped' },
      { label: 'ATProto accounts', status: 'active' },
    ],
  },
  {
    label: 'Sync',
    items: [
      { label: 'Peer-to-peer encrypted sync', status: 'shipped' },
      { label: 'Shared Links', status: 'active' },
      { label: 'Remote Link', status: 'planned' },
      { label: 'Capability based Sync', status: 'planned' },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Notarized builds', status: 'shipped' },
      { label: 'Encrypted SQLite database', status: 'shipped' },
      { label: 'Agent Sandbox', status: 'planned' },
      {
        label: 'Inference runtime hardening',
        status: 'planned',
      },
    ],
  },
]

const roadmapLegend = [
  { label: 'Shipped', status: 'shipped' as const },
  { label: 'Work in progress', status: 'active' as const },
  { label: 'Planned', status: 'planned' as const },
]

const roadmapCtaClass =
  'inline-flex items-center gap-1 rounded-sm border border-black/5 bg-black/[0.035] px-3.5 py-1.5 text-[0.82rem] font-medium text-foreground shadow-none transition-colors hover:bg-black/[0.06] dark:border-white/5 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] lg:text-sm'

const paragraphClass = 'text-[0.92rem] leading-[1.75] text-foreground/72'

const getRoadmapItemClassName = (status: RoadmapStatus) => {
  switch (status) {
    case 'shipped':
      return 'border-[#171717] bg-[#171717] text-white dark:border-white dark:bg-white dark:text-black'
    case 'active':
      return 'border-[#2a2a2a] bg-white text-[#171717] dark:border-white/82 dark:bg-white dark:text-black'
    case 'planned':
      return 'border-[#c7c7c7] border-dashed bg-transparent text-black/52 dark:border-white/24 dark:text-white/40'
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
          className="mb-8 px-2 pb-10 scroll-mt-28 sm:px-4 lg:mb-10 lg:px-0 lg:pb-12 lg:scroll-mt-40"
        >
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-3 font-sans text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-[3rem] lg:text-[3.35rem]">
              Roadmap
            </h1>
            <p className="mb-7 max-w-[46rem] text-[0.96rem] leading-[1.7] text-muted-foreground lg:mb-9">
              Current focus is on building a basic CLI-based chat experience. In the near future, we will add
              connector support, introduced only with proper sandboxing and a documented threat model, along with a
              client app.
            </p>
            <div className="mb-9">
              <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[0.88rem] text-muted-foreground">
                {roadmapLegend.map((item) => (
                  <div key={item.label} className="inline-flex items-center gap-2">
                    <span
                      className={`h-4 w-9 border ${getRoadmapItemClassName(item.status)}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-9 lg:space-y-10">
                {roadmapTracks.map((track) => (
                  <div key={track.label} className="space-y-4">
                    <h2 className="whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.22em] text-foreground/72 sm:text-[0.74rem]">
                      {track.label}
                    </h2>
                    <div className="pb-1">
                      <div className="flex flex-wrap items-start gap-2.5 lg:gap-2 lg:gap-y-3">
                        {track.items.map((item, itemIndex) => (
                          <div key={item.label} className="contents">
                            <div
                              className={`inline-flex min-h-[2.8rem] items-center border px-4 py-2 text-[0.92rem] font-normal tracking-[-0.02em] ${getRoadmapItemClassName(item.status)} lg:min-h-[2.7rem]`}
                            >
                              {item.label}
                            </div>
                            {itemIndex < track.items.length - 1 && (
                              <div
                                className="hidden h-[2.7rem] w-6 items-center justify-center text-black/14 dark:text-white/16 lg:flex"
                                aria-hidden="true"
                              >
                                <svg viewBox="0 0 32 12" className="h-2.5 w-6" fill="none">
                                  <path d="M2 6H28" stroke="currentColor" strokeWidth="1.5" />
                                  <path d="M23 2L28 6L23 10" stroke="currentColor" strokeWidth="1.5" />
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
