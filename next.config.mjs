/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config) => {
    // Webpack-only rule; `next dev --turbo` would require a matching Turbopack rule.
    config.module.rules.push({
      test: /\.csv$/,
      type: "asset/source",
    })
    return config
  },
}

export default nextConfig
