import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import TopBanner from "@/components/layout/TopBanner";
import SupportWidget from "@/components/layout/SupportWidget";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: "A to Z Prints",
  description: "Premium customized printing & corporate gifting brand in India. High-quality prints for packaging, apparel, and merchandise.",
  url: "https://atozprints.com", // Placeholder
  ogImage: "/og-image.png", // Placeholder
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Printing", "Customized Prints", "Cooperate Gifting", "Dropshipping India", "A to Z Prints"],
  authors: [{ name: "A to Z Prints Team" }],
  creator: "A to Z Prints",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@atozprints",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBanner />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SupportWidget />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
