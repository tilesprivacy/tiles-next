import nextra from 'nextra'

const withNextra = nextra({
  // Mount the book content at `/book` in the URL space
  // Nextra will use the default `content` directory on disk
  contentDirBasePath: '/book',
  // Enable git timestamp for last updated dates
  defaultShowCopyCode: true,
})

const BRANDING_ASSET_FILES = [
  'lighticon.png',
  'grey.png',
  'light.png',
  'logo.png',
  'og-logo.png',
  'apple-logo.svg',
  'apple-logo-white.svg',
  'tiles_banner_outline_blk.svg',
  'tiles_banner_outline_wht.svg',
  'tiles_tlogo_banner_v1.2/svg/tiles_banner_fill_blk.svg',
  'ua-logo.svg',
  'apple-icon.png',
  'favicon.ico',
  'icon0.svg',
  'icon1.png',
  'tilescli.png',
]

const brandingCacheControlHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, must-revalidate',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Transpile nextra packages to fix Turbopack ESM issues
  transpilePackages: ['nextra', 'nextra-theme-docs'],
  images: {
    // Enable Next.js image optimization
    // Images will be automatically optimized, lazy-loaded, and served in modern formats
  },
  async headers() {
    return [
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/install.sh',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
      ...BRANDING_ASSET_FILES.map((file) => ({
        source: `/${file}`,
        headers: brandingCacheControlHeaders,
      })),
    ]
  },
  async redirects() {
    return [
      {
        source: '/book/modelfile',
        destination: '/book/tilekit#modelfile',
        permanent: true,
      },
      {
        source: '/modelfile',
        destination: '/book/tilekit#modelfile',
        permanent: true,
      },
      {
        source: '/tilekit',
        destination: '/book/tilekit',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/llms.txt',
        destination: '/api/llms',
      },
    ]
  },
}

export default withNextra(nextConfig)
