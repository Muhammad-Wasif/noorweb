/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com', 'e7.pngegg.com'],
  },
  transpilePackages: ['three'],
}

module.exports = nextConfig
