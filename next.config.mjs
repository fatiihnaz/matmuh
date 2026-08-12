/** @type {import('next').NextConfig} */
const nextConfig = {
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
