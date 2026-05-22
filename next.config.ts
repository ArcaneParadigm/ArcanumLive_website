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
}

export default nextConfig
