/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Duyuru ve haber fotoğrafları bölümün mevcut medya sunucusunda duruyor.
    // Bu izin olmadan next/image uzak kaynağı reddeder ve görseller kırılır.
    remotePatterns: [
      { protocol: "https", hostname: "mtm.yildiz.edu.tr", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
