import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AssistantWidget } from "@/components/AssistantWidget";
import { MobileNav } from "@/components/MobileNav";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imogen Inocentes | Freelance Web Designer",
  description:
    "Portfolio and freelance services for clean, responsive websites by Imogen Inocentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable}`} data-theme="dark">
      <body>
        <Header />
        {children}
        <Footer />
        <AssistantWidget />
        <MobileNav />
      </body>
    </html>
  );
}
