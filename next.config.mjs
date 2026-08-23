/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    return [{ source: "/api/:path*", destination: `${target}/api/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mtm.yildiz.edu.tr",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
