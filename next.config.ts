import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Keep production builds from replacing the running dev server's chunks.
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

export default nextConfig;

