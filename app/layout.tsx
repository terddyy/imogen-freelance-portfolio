import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppContact } from "@/components/WhatsAppContact";
import { CookieConsent } from "@/components/CookieConsent";
import { MobileNav } from "@/components/MobileNav";
import { SiteEntryLoader } from "@/components/SiteEntryLoader";
import { getSiteOrigin } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070b" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Imogen Inocentes | Lead Developer | Full Stack/AI",
  description:
    "Portfolio of Imogen Inocentes — Lead Developer building full stack applications and AI-powered solutions.",
  openGraph: {
    title: "Imogen Inocentes | Lead Developer | Full Stack/AI",
    description:
      "Portfolio of Imogen Inocentes — Lead Developer building full stack applications and AI-powered solutions.",
    url: "/",
    siteName: "Imogen Inocentes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Hero-background.webp",
        width: 1920,
        height: 1080,
        alt: "Imogen Inocentes portfolio — Lead Developer, Full Stack/AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imogen Inocentes | Lead Developer | Full Stack/AI",
    description:
      "Portfolio of Imogen Inocentes — Lead Developer building full stack applications and AI-powered solutions.",
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
        <SiteEntryLoader />
        <Header />
        {children}
        <Footer />
        <WhatsAppContact />
        <CookieConsent />
        <MobileNav />
      </body>
    </html>
  );
}
