/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  transpilePackages: ['three'],
};

module.exports = nextConfig;
