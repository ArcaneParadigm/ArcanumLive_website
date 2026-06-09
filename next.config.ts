import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'vimeo.com' },
      { protocol: 'https', hostname: '*.vimeocdn.com' },
      { protocol: 'https', hostname: 'i.etsystatic.com' },
    ],
  },
  experimental: {
    // Exclude realm image assets from serverless function bundle.
    // They are static files served by Vercel CDN — the function doesn't need them traced.
    outputFileTracingExcludes: {
      '**/*': [
        './public/realms/**/*',
        './public/audio/**/*',
      ],
    },
  },
}

export default nextConfig
