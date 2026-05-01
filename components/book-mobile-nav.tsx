import Link from 'next/link'

interface BookPage {
  number: string
  title: string
  description: string
  href: string
}

const bookPages: BookPage[] = [
  {
    number: '01',
    title: 'Overview',
    description: 'Tiles, our consumer product, and Tilekit, the SDK for developers.',
    href: '/book/overview',
  },
  {
    number: '02',
    title: 'Manual',
    description: 'Command-line interface reference for Tiles, with usage examples',
    href: '/book/manual',
  },
  {
    number: '03',
    title: 'Models',
    description: 'Our approach to model selection and optimization for different tasks and hardware constraints.',
    href: '/book/models',
  },
  {
    number: '04',
    title: 'Memory',
    description: 'Our work on memory model research for on-device context and memory management.',
    href: '/book/memory',
  },
  {
    number: '05',
    title: 'Tilekit',
    description: 'Tilekit CLI usage for Modelfiles, plus parser grammar, instructions, parameters, and API usage.',
    href: '/book/tilekit',
  },
  {
    number: '06',
    title: 'MIR Extension',
    description: 'MIR (Machine Intelligence Resource) naming schema extension for model classification and reproducibility.',
    href: '/book/mir',
  },
  {
    number: '07',
    title: 'Security',
    description: 'How Tiles approaches privacy, local data protection, identity, sync, and operational security boundaries.',
    href: '/book/security',
  },
  {
    number: '08',
    title: 'Community',
    description: 'See how you can make Tiles better.',
    href: '/book/community',
  },
  {
    number: '09',
    title: 'Resources',
    description: 'A living index of resources that inform and inspire our work.',
    href: '/book/resources',
  },
]

export function BookMobileNav() {
  return (
    <div className="space-y-6 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block group"
            style={{ textDecoration: 'none' }}
          >
            <div className="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] p-8 rounded-sm h-full" style={{ textDecoration: 'none' }}>
              <div className="flex flex-col items-start gap-3">
                <div
                  className="text-sm lg:text-base leading-none tabular-nums text-black/35 dark:text-white/40 font-medium tracking-tight"
                  style={{ textDecoration: 'none' }}
                >
                  {page.number}
                </div>
                <h2
                  className="text-3xl font-semibold leading-[1.05] text-black dark:text-white tracking-tight group-hover:text-black/80 dark:group-hover:text-white/80"
                  style={{ textDecoration: 'none' }}
                >
                  {page.title}
                </h2>
              </div>
              <p className="mt-4 text-black/60 dark:text-white/70 text-base leading-relaxed" style={{ textDecoration: 'none' }}>
                {page.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
