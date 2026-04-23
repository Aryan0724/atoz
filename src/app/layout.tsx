import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Toaster } from 'sonner';
import AuthProvider from "@/components/providers/AuthProvider";
import dynamic from 'next/dynamic';
import MetaPixel from "@/components/analytics/MetaPixel";
import { Suspense } from 'react';

const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer"), { ssr: false });
const SupportWidget = dynamic(() => import("@/components/layout/SupportWidget"), { ssr: false });

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

const siteConfig = {
  name: "AtoZ Print",
  description: "India's trusted premium printing & corporate gifting partner. Delivering high-quality, affordable, and reliable printing solutions across PAN India.",
  url: "https://atozprint.in",
};

export const viewport: Viewport = {
  themeColor: "#E91E63",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Printing", "Customized Prints", "Corporate Gifting", "Dropshipping India", "AtoZ Print", "Quality Printing", "Bulk Orders India"],
  authors: [{ name: "AtoZ Print Team" }],
  creator: "AtoZ Print",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://atozprint.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "AtoZ Print - Premium Printing & Corporate Gifting",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["https://atozprint.in/og-image.png"],
    creator: "@atozprints",
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
      <body className={`${inter.variable} ${manrope.variable} font-body antialiased`}>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          <TopBanner />
          <Navbar />
          <main className="min-h-screen pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <SupportWidget />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
