/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compression
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },

  // Environment variables
  env: {
    // Use NEXT_PUBLIC_* prefix for client-side variables
    // SERVER_ONLY_VAR will be server-only
  },

  // Headers for security & caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects (old URLs to new ones)
  async redirects() {
    return [
      // Example:
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ]
  },

  // Rewrites (internal routing)
  async rewrites() {
    return {
      beforeFiles: [
        // Example:
        // {
        //   source: '/api/:path*',
        //   destination: 'http://backend:3001/api/:path*',
        // },
      ],
    }
  },

  // Webpack customization (if needed)
  webpack: (config, { isServer }) => {
    // Custom webpack configuration
    return config
  },

  // TypeScript strict mode
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Experimental features (optional)
  experimental: {
    // appDir: true,  // Enabled by default in Next.js 13+
  },

  // Performance optimizations
  swcMinify: true,
}

module.exports = nextConfig
