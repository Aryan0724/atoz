import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'sonner';
import AuthProvider from "@/components/providers/AuthProvider";
import dynamic from 'next/dynamic';
import MetaPixel from "@/components/analytics/MetaPixel";
import { Suspense } from 'react';
import SmoothScroll from "@/components/common/SmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";
import Preloader from "@/components/common/Preloader";

const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer"), { ssr: false });
const SupportWidget = dynamic(() => import("@/components/layout/SupportWidget"), { ssr: false });

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

const siteConfig = {
  name: "ATOZPRINTS",
  description: "Bespoke corporate printing and gifting solutions. We engineer tactile experiences that command absolute respect.",
  url: "https://atozprint.in",
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ATOZPRINTS | Premium Corporate Solutions",
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
    title: "ATOZPRINTS | Premium Corporate Solutions",
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
    title: "ATOZPRINTS | Premium Corporate Solutions",
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
      <body className={`${playfair.variable} ${manrope.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <AuthProvider>
          <SmoothScroll>
            <Preloader />
            <CustomCursor />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <SupportWidget />
          </SmoothScroll>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
