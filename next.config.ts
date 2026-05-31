import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Fix for @xenova/transformers in Webpack
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    }
    return config;
  },
  // Empty turbopack config to silence the warning when using Webpack config
  turbopack: {},
  serverExternalPackages: ['@xenova/transformers'],
};

export default nextConfig;
