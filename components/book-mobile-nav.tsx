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
    title: 'About Tiles Book',
    description: 'Privacy technology for everyone. Learn about Tiles, the consumer offering, and Tilekit, the developer-facing SDK.',
    href: '/book',
  },
  {
    number: '02',
    title: 'Proposal',
    description: 'Proposed implementation based on MIR and Modelfile specifications for AIGC/ML work.',
    href: '/book/proposal',
  },
  {
    number: '03',
    title: 'Implementation',
    description: 'Current implementation details of the Modelfile parser and supported instructions.',
    href: '/book/implementation',
  },
  {
    number: '04',
    title: 'Reference',
    description: 'Complete reference for Modelfile and MIR specifications.',
    href: '/book/reference',
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
          <div className="bg-black/[0.03] hover:bg-black/[0.05] transition-all duration-200 p-8 rounded-2xl" style={{ textDecoration: 'none' }}>
            <div className="text-black/35 text-base font-medium mb-4 tracking-tight" style={{ textDecoration: 'none' }}>
              {page.number}
            </div>
            <h2 className="text-3xl font-semibold text-black mb-4 tracking-tight group-hover:text-black/80 transition-colors leading-tight" style={{ textDecoration: 'none' }}>
              {page.title}
            </h2>
            <p className="text-black/60 text-base leading-relaxed" style={{ textDecoration: 'none' }}>
              {page.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
