const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configure Turbopack to silence the multiple lockfiles warning
  // and bypass the "webpack config but no turbopack config" error.
  turbopack: {
    root: path.join(__dirname, '..'),
  },

  // Configuration for Next.js Image Optimization to allow images from external domains.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  // These headers are required for SharedArrayBuffer to work, which is
  // likely used by the mGBA emulator in your project.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },

  // This ensures that WebAssembly modules are handled correctly by webpack.
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

module.exports = nextConfig;
