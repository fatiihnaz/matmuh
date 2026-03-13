import "./globals.css";
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from "@/app/providers"

import Header from "./components/Header/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jb-mono',
});

export const metadata = {
  title: "Mat Muh Site",
  description: "dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${jbMono.variable}`}>
      <Providers>
        <body className={`font-sans antialiased flex flex-col min-h-screen bg-background`}>
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