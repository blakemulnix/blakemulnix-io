/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.test.photos.blakemulnix.io',
        protocol: 'https',
      },
      {
        hostname: 'cdn.photos.blakemulnix.io',
        protocol: 'https',
      },
    ],
  },
}

module.exports = nextConfig
