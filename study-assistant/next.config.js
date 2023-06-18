/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mongoose', '@zilliz/milvus2-sdk-node'],
  },
  webpack(config) {
    config.experiments = {...config.experiments, topLevelAwait: true}
    return config
  },
}

module.exports = nextConfig
