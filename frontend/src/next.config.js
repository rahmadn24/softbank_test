/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Tetap unoptimized karena mode export
    domains: [],       // Tambahkan domain gambar jika perlu
  },
  webpack: (config) => {
    // Menambahkan support alias @ untuk path
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },
  reactStrictMode: true,       // Mode strict React untuk debugging lebih baik
  swcMinify: true,             // SWC untuk build lebih cepat
  trailingSlash: true,         // Tambahkan trailing slash untuk routing static
  experimental: {
    appDir: true,              // Jika menggunakan App Directory (Next.js 13+)
  },
};

module.exports = nextConfig;
