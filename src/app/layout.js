import { Inter } from 'next/font/google'
import "./globals.css";

import Header from "./components/Header/Header";

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: "Mat Muh Site",
  description: "dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${font.className} font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
