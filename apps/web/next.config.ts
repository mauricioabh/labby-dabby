import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@labby-dabby/types', '@labby-dabby/ui', '@labby-dabby/utils'],
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default nextConfig;
