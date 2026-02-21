import nextra from 'nextra'

const withNextra = nextra({
  // Mount the book content at `/book` in the URL space
  // Nextra will use the default `content` directory on disk
  contentDirBasePath: '/book',
  // Enable git timestamp for last updated dates
  defaultShowCopyCode: true,
})

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
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/tilescli.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
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
