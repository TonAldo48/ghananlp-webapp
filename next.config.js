/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config options
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 