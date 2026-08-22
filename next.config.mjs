/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
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
