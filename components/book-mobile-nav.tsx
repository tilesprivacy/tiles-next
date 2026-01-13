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
    title: 'Tiles Book',
    description: 'Documentation for Tiles, the consumer offering, and Tilekit, the developer-facing, Rust-based Modelfile SDK.',
    href: '/book',
  },
  {
    number: '02',
    title: 'CLI Reference',
    description: 'Command-line interface reference for Tiles CLI commands and usage examples.',
    href: '/book/cli',
  },
  {
    number: '03',
    title: 'Models Reference',
    description: 'Reference documentation for memory models bundled with Tiles for on-device context and memory management.',
    href: '/book/models',
  },
  {
    number: '04',
    title: 'Modelfile Reference',
    description: 'Complete reference for the Modelfile parser, grammar, instructions, parameters, and API usage.',
    href: '/book/modelfile',
  },
  {
    number: '05',
    title: 'MIR Extension',
    description: 'MIR (Machine Intelligence Resource) naming schema extension for model classification and reproducibility.',
    href: '/book/mir',
  },
  {
    number: '06',
    title: 'Resources',
    description: 'A living index of resources that inform and inspire our work.',
    href: '/book/resources',
  },
]

export function BookMobileNav() {
  return (
    <div className="block md:hidden space-y-6 my-10">
      {bookPages.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className="block group"
          style={{ textDecoration: 'none' }}
        >
          <div className="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all duration-200 p-8 rounded-2xl" style={{ textDecoration: 'none' }}>
            <div className="text-black/35 dark:text-white/40 text-base font-medium mb-4 tracking-tight" style={{ textDecoration: 'none' }}>
              {page.number}
            </div>
            <h2 className="text-3xl font-semibold text-black dark:text-white mb-4 tracking-tight group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors leading-tight" style={{ textDecoration: 'none' }}>
              {page.title}
            </h2>
            <p className="text-black/60 dark:text-white/70 text-base leading-relaxed" style={{ textDecoration: 'none' }}>
              {page.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
