import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ['firebase-admin'],
  },
  // Environment variables available on the server
  env: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
};

export default nextConfig;
