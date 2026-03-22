"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Box, Zap, Shield, Globe, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/data/mockProducts';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function HomePage() {
  return (
    <div className="flex flex-col relative w-full overflow-hidden bg-[#fafafa]">
      
      {/* Decorative Background Mesh */}
      <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-brand-pink/5 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-brand-cyan/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>


      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="lg:grid lg:grid-cols-2 lg:gap-16 items-center"
          >
            <div className="text-center lg:text-left">
              <motion.div variants={fadeInUp} className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-brand-pink/20 shadow-glow text-brand-pink text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                India&apos;s #1 Print-on-Demand Partner
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[80px] font-black text-brand-dark leading-[1.05] tracking-tight mb-8">
                Your Design. <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff7e5f]">Our Impression.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Launch your own brand or create premium corporate gifts with zero inventory. High-quality customization tailored for your business needs.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link href="/products" className="group relative inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 rounded-full bg-brand-dark text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-dark/30 hover:-translate-y-1">
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
                  <span className="relative flex items-center">
                    Start Designing
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 rounded-full bg-white border border-gray-200 text-brand-dark font-bold text-lg hover:border-brand-pink/30 hover:bg-pink-50/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-gray-200/50">
                  Bulk Pricing
                </Link>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="mt-14 flex items-center justify-center lg:justify-start gap-10">
                <div>
                  <div className="text-3xl font-black text-brand-dark tracking-tight">10K+</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-1">Happy Clients</div>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-black text-brand-dark tracking-tight">100+</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mt-1">Premium Products</div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="hidden lg:block relative mt-16 lg:mt-0"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-300/50 border-[12px] border-white transform transition-transform duration-700 hover:scale-[1.02]">
                <div className="w-full aspect-[4/5] bg-gray-50 relative">
                  <Image 
                    src="/hero_showcase.png"
                    alt="Premium Product Customization Showcase"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Floating badges overlay - Glassmorphism */}
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-10 -left-8 glass-morphism p-4 rounded-3xl"
                  >

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-inner shadow-white/30">
                        <span className="text-2xl drop-shadow-md">✨</span>
                      </div>
                      <div className="pr-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5">Quality</p>
                        <p className="text-base font-black text-brand-dark leading-none">Premium Print</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-16 -right-10 glass-morphism p-4 rounded-3xl"
                  >

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-inner shadow-white/30">
                        <span className="text-2xl drop-shadow-md">🚀</span>
                      </div>
                      <div className="pr-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5">Delivery</p>
                        <p className="text-base font-black text-brand-dark leading-none">48hr Dispatch</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Trust Marquee - Sticky & Premium */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden relative shadow-sm z-20">
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        <div className="flex animate-marquee whitespace-nowrap items-center gap-16 sm:gap-32 opacity-50 hover:opacity-100 transition-opacity duration-500">
          {[
            "CREATIVE AD AGENCY", "GLOBAL TECH CORP", "STARTUP HUB", "EVENT MASTERS", 
            "RETAIL GIANTS", "EDU INSTITUTION", "MEDIA HOUSE", "FASHION HUB",
            "CREATIVE AD AGENCY", "GLOBAL TECH CORP", "STARTUP HUB", "EVENT MASTERS"
          ].map((brand, idx) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-pink/50 group-hover:bg-brand-pink group-hover:scale-150 transition-all duration-300 shadow-[0_0_15px_rgba(233,30,99,0.5)]"></div>
              <span className="text-base font-black text-brand-dark tracking-[0.4em] uppercase">{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid - Glass Cards */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight">Why Choose AtoZ Print?</h2>
            <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Scale your business with our robust infrastructure designed for speed, quality, and extreme reliability.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Shield, color: "text-brand-pink", bg: "bg-pink-100", title: "White Label", desc: "Ship products under your own brand. No mention of AtoZ Print anywhere on the package." },
              { icon: Box, color: "text-brand-cyan", bg: "bg-cyan-100", title: "Print on Demand", desc: "No inventory risks. We print items only after you make a sale. Start small, scale fast." },
              { icon: Zap, color: "text-amber-500", bg: "bg-amber-100", title: "Fast Fulfillment", desc: "Industry-leading turnaround. Most orders are printed and shipped within 48-72 hours." },
              { icon: Globe, color: "text-blue-500", bg: "bg-blue-100", title: "India Wide", desc: "We deliver to over 19,000+ pin codes across India with premium logistics partners." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${feature.bg} rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700 blur-2xl`}></div>
                
                <div className={`w-16 h-16 ${feature.bg} rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-sm relative z-10`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-brand-dark relative z-10">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-base relative z-10 font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white border-y border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            badge="Top Categories"
            title="Premium Corporate Gifts"
            subtitle="Explore our most popular customizable products, crafted for quality and designed to leave a lasting impression."
            align="center"
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          >
            {mockProducts.slice(0, 4).map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-20 text-center">
            <Link href="/products" className="group inline-flex items-center text-brand-dark font-black text-xl hover:text-brand-pink transition-colors">
              <span className="relative overflow-hidden pb-1">
                View Entire Catalog
                <span className="absolute bottom-0 left-0 w-full h-1 bg-brand-pink transform translate-y-1 block group-hover:-translate-y-0 transition-transform duration-300"></span>
              </span>
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Dark Dramatic */}
      <section className="py-32 bg-brand-dark relative overflow-hidden text-white z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl font-black tracking-tight mb-6">4 Simple Steps to Success</h2>
            <div className="h-2 w-24 bg-gradient-to-r from-brand-pink to-[#ff7e5f] mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { step: "01", title: "Pick a Product", desc: "Choose from our wide catalog of premium apparel, tech, or lifestyle products." },
              { step: "02", title: "Add Your Design", desc: "Use our intuitive design tool to upload your artwork or create something new." },
              { step: "03", title: "Place Your Order", desc: "Order a sample or start a storefront. We handle bulk and single orders with ease." },
              { step: "04", title: "We Ship Directly", desc: "We print, quality check, and ship it directly to your customer or office." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative group p-8 rounded-[32px] hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors duration-500"
              >
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-6 z-0 group-hover:text-brand-pink/20 transition-colors duration-500 select-none">
                  {item.step}
                </div>
                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extreme CTA Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-brand-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            {/* Inner dynamic glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-pink opacity-30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-cyan opacity-20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                Ready to Build Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-[#ff7e5f]">Printing Empire?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
                Join 10,000+ businesses and creators who trust AtoZ Print for their custom merchandise.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-brand-dark font-black text-lg rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                  Create Free Account
                </Link>
                <Link href="/contact" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black text-lg rounded-full hover:bg-white/10 transition-all backdrop-blur-sm">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
