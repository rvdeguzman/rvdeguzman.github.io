import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    // Keep production builds from replacing the running dev server's chunks.
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    output: 'export',
    // Includes mdx so webpack (dev) applies Next's React aliases to .mdx files;
    // without it, MDX pulls node_modules/react and crashes with two Reacts.
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

// Plugins are given by name (not imported) so Turbopack can serialize them.
const withMDX = createMDX({
    options: {
        // remark-frontmatter strips the YAML block; gray-matter reads it in src/lib/posts.ts.
        remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    },
});

export default withMDX(nextConfig);
