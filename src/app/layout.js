import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/app/providers";

import Header from "./components/Header/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jb-mono",
});

export const SITE_URL = "https://matmuh.yildiz.edu.tr";
const SITE_NAME = "YTÜ Matematik Mühendisliği";
const SITE_DESCRIPTION =
  "Yıldız Teknik Üniversitesi Matematik Mühendisliği Bölümü: müfredat, ders programları, personel, duyurular ve haberler.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Yıldız Teknik Üniversitesi`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Yıldız Teknik Üniversitesi`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${jbMono.variable}`}>
      <Providers>
        <body className={`font-sans antialiased flex flex-col min-h-screen bg-background overflow-x-hidden`}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
