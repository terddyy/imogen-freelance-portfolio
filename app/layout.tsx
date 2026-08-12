import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { MobileNav } from "@/components/MobileNav";
import { ProjectInquiryRoot } from "@/components/ProjectInquiryRoot";
import { getSiteOrigin } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Imogen Inocentes | Freelance Web Designer",
  description:
    "Portfolio and freelance services for clean, responsive websites by Imogen Inocentes.",
  openGraph: {
    title: "Imogen Inocentes | Freelance Web Designer",
    description:
      "Portfolio and freelance services for clean, responsive websites by Imogen Inocentes.",
    url: "/",
    siteName: "Imogen Inocentes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Hero-background.webp",
        width: 1920,
        height: 1080,
        alt: "Imogen Inocentes freelance web design portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imogen Inocentes | Freelance Web Designer",
    description:
      "Portfolio and freelance services for clean, responsive websites by Imogen Inocentes.",
    images: ["/Hero-background.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable}`} data-theme="dark">
      <body>
        <ProjectInquiryRoot>
          <Header />
          {children}
          <Footer />
          <WhatsAppContact />
          <MobileNav />
        </ProjectInquiryRoot>
      </body>
    </html>
  );
}
