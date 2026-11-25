const isGithubActions = !!process.env.GITHUB_ACTIONS;
const basePath = isGithubActions ? '/kozmoteo' : (process.env.NEXT_PUBLIC_BASE_PATH || '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
