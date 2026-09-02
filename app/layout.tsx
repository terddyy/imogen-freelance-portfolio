import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { Header } from "@/components/Header";
import { SideNav } from "@/components/SideNav";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SiteEntryLoader } from "@/components/SiteEntryLoader";
import { getSiteOrigin } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-manrope",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
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
    <html
      lang="en"
      className={`${archivo.variable} ${GeistMono.variable} ${GeistSans.variable} ${GeistPixelSquare.variable}`}
      data-theme="light"
    >
      <body>
        <SiteEntryLoader />
        <SideNav />
        <Header />
        <div className="siteShell">
          {children}
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
