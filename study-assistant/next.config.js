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
  functions: {
    'api/chat': {
      maxDuration: 60,
    },
    'api/stt': {
      maxDuration: 60,
    },
    'api/tts': {
      maxDuration: 60,
    },
  },
}

module.exports = nextConfig
