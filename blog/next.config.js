/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.us-east-1.amazonaws.com"
      },
    ],
  },
};

module.exports = nextConfig;