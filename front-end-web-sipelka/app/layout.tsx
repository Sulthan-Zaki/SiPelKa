import type { Metadata } from "next";
import { Manrope, Public_Sans, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SiPelKa | Institutional Research Platform",
  description: "Sistem Manajemen Penelitian dan Pengabdian Masyarakat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${publicSans.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols Outlined — needed for icons across all pages */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className="bg-surface text-on-surface min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-public-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
