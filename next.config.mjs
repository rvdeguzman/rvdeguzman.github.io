/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/rafdeguzman.github.io",
  assetPrefix: "/rafdeguzman.github.io/",
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
