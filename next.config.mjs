import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/book/content',
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
        source: '/install.sh',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
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
