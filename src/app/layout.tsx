import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import TopBanner from "@/components/layout/TopBanner";
import SupportWidget from "@/components/layout/SupportWidget";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

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
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
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
      <body className={inter.className}>
        <TopBanner />
        <Navbar />
        <main className="min-h-screen pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
        <SupportWidget />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
