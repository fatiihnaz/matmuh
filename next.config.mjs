import os from "node:os";

// Telefondan yerel sunucuya bakarken Next, LAN adresini yabanci koken sayip
// /_next/hmr'i blokluyor; istemci parcalari yuklenemeyince sayfa hidrate
// olmuyor ve menu gibi etkilesimli parcalar olu geliyor. Adresi elle yazmak
// yerine makinenin arayuzlerinden okuyoruz, IP degisince duzeltme gerekmesin.
const lanOrigins = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface?.family === "IPv4" && !iface.internal)
  .map((iface) => iface.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  allowedDevOrigins: lanOrigins,
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
      {
        protocol: "https",
        hostname: "matmuh.yusufacmaci.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
