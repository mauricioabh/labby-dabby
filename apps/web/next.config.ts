import type { NextConfig } from 'next';
import path from 'path';

const monorepoRoot = path.join(__dirname, '../..');

const nextConfig: NextConfig = {
  transpilePackages: ['@labby-dabby/types', '@labby-dabby/ui', '@labby-dabby/utils'],
  // Required for Vercel/npm workspaces: trace deps hoisted at the monorepo root (e.g. client-only)
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
