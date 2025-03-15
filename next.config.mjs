import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.goat.com',
      },
      {
        protocol: 'https',
        hostname: 'demo.vercel.store',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Add localhost for local development
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Custom webpack configuration (if needed)
    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
