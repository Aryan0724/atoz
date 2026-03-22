import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Box, Zap, Shield, Globe } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/data/mockProducts';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-50 text-brand-pink text-xs md:text-sm font-bold mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-brand-pink mr-3 animate-pulse"></span>
                India&apos;s #1 Print-on-Demand Partner
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-brand-dark leading-tight mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                Your Design. <br className="hidden lg:block" />
                <span className="text-brand-pink italic">Our Impression.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                Launch your own brand or create premium corporate gifts with zero inventory. High-quality customization tailored for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
                <Link href="/products" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full bg-brand-pink text-white font-bold text-lg hover:shadow-xl hover:shadow-pink-200 transform hover:-translate-y-1 transition-all duration-300">
                  Start Designing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full border-2 border-gray-100 text-brand-dark font-bold text-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-300">
                  Bulk Pricing
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                <div>
                  <div className="text-2xl font-bold text-brand-dark">10K+</div>
                  <div className="text-sm text-gray-400">Happy Clients</div>
                </div>
                <div className="h-10 w-px bg-gray-100"></div>
                <div>
                  <div className="text-2xl font-bold text-brand-dark">100+</div>
                  <div className="text-sm text-gray-400">Premium Products</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="w-full aspect-[4/5] bg-gray-100 relative">
                  <Image 
                    src="/hero_showcase.png"
                    alt="Premium Product Customization Showcase"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Floating badges overlay */}
                  <div className="absolute top-8 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">✨</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quality</p>
                        <p className="text-sm font-black text-brand-dark">Premium Print</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-12 -right-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                        <p className="text-sm font-black text-brand-dark">48hr Dispatch</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-cyan opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-pink opacity-10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Trust Marquee */}
      <section className="py-8 md:py-12 bg-white border-y border-gray-100 overflow-hidden relative mt-8 md:mt-0">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="flex animate-marquee whitespace-nowrap items-center gap-12 sm:gap-24 opacity-40 hover:opacity-100 transition-opacity">
          {[
            "CREATIVE AD AGENCY", "GLOBAL TECH CORP", "STARTUP HUB", "EVENT MASTERS", 
            "RETAIL GIANTS", "EDU INSTITUTION", "MEDIA HOUSE", "FASHION HUB",
            "CREATIVE AD AGENCY", "GLOBAL TECH CORP", "STARTUP HUB", "EVENT MASTERS"
          ].map((brand, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-2 h-2 rounded-full bg-brand-pink group-hover:scale-150 transition-transform"></div>
              <span className="text-sm font-black text-brand-dark tracking-[0.3em] uppercase">{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-brand-lightGray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Why Choose AtoZ Print?</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
              Scale your business with our robust infrastructure designed for speed, quality, and reliability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-float hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-brand-pink" />
              </div>
              <h3 className="text-xl font-bold mb-3 md:mb-4">White Label</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Ship products under your own brand. No mention of AtoZ Print anywhere on the package.
              </p>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-float hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                <Box className="h-7 w-7 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-bold mb-3 md:mb-4">Print on Demand</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                No inventory risks. We print items only after you make a sale. Start small, scale fast.
              </p>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-float hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 md:mb-4">Fast Fulfillment</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Industry-leading turnaround. Most orders are printed and shipped within 48-72 hours.
              </p>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-float hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                <Globe className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 md:mb-4">India Wide</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                We deliver to over 19,000+ pin codes across India with premium logistics partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            badge="Top Categories"
            title="Premium Corporate Gifts"
            subtitle="Explore our most popular customizable products, crafted for quality and designed to leave a lasting impression."
            align="center"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/products" className="inline-flex items-center text-brand-pink font-bold text-lg hover:underline decoration-2 underline-offset-8 transition-all">
              View Entire Catalog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-brand-dark">4 Simple Steps to Success</h2>
            <div className="h-1.5 w-24 bg-brand-pink mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Pick a Product", desc: "Choose from our wide catalog of premium apparel, tech, or lifestyle products." },
              { step: "02", title: "Add Your Design", desc: "Use our intuitive design tool to upload your artwork or create something new." },
              { step: "03", title: "Place Your Order", desc: "Order a sample or start a storefront. We handle bulk and single orders with ease." },
              { step: "04", title: "We Ship Directly", desc: "We print, quality check, and ship it directly to your customer or office." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="text-7xl font-black text-gray-50 absolute -top-10 -left-4 z-0 group-hover:text-pink-50 transition-colors duration-300">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-brand-dark mb-4">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-pink rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-cyan rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">
            Ready to Build Your <br className="md:hidden" /><span className="text-brand-pink">Printing Empire?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Join 10,000+ businesses and creators who trust AtoZ Print for their custom merchandise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/register" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-brand-pink text-white font-bold text-lg md:text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-900/20">
              Create Free Account
            </Link>
            <Link href="/contact" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-brand-dark font-bold text-lg md:text-xl rounded-full hover:bg-gray-100 transition-all">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
