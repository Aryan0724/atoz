import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Building2, Gift, Users, Zap, Globe, Star, Shield, Palette, CheckCircle2, Ticket, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import CouponCard from '@/components/common/CouponCard';

export const revalidate = 60; // Cache for 60 seconds

async function getData() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const { data: cms } = await supabase
    .from('site_settings')
    .select('config')
    .eq('id', 'cms_pages')
    .single();

  return { 
    categories: categories || [], 
    coupons: coupons || [],
    cms: cms?.config?.services || {
      heroTitle: "Our Products & Services",
      heroSubtitle: "High-quality printing for your business and brand.",
      ctaHeading: "Ready to start a project?",
      ctaDesc: "Need custom boxes or brand kits? Our team is here to help you grow."
    }
  };
}

export default async function CategoryPage() {
  const { categories, coupons, cms } = await getData();
  
  return (
    <div className="bg-white min-h-screen py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-32">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <SectionHeading 
            badge="Our Catalog"
            title={cms.heroTitle}
            subtitle={cms.heroSubtitle}
            align="center"
          />
        </div>

        {/* Categories / Services Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
          {categories.map((category: any, idx: number) => (
            <div key={category.id} className="group flex flex-col bg-white rounded-[48px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                {category.image ? (
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-pink/5">
                    <Package className="h-16 w-16 text-brand-pink/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-10 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-brand-dark tracking-tighter italic">{category.name}</h3>
                  <div className="h-10 w-10 bg-brand-pink/10 rounded-xl flex items-center justify-center text-brand-pink opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
                
                <p className="text-gray-500 font-medium mb-8 leading-relaxed line-clamp-3">
                  {category.long_description || `Best ${category.name.toLowerCase()} solutions for your business needs.`}
                </p>
                
                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                   <Link 
                     href={`/products?category=${category.slug}`}
                     className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark hover:text-brand-pink transition-colors"
                   >
                     View All
                   </Link>
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                     Premium Grade
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupons Section */}
        {coupons.length > 0 && (
          <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/10 text-brand-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <Ticket className="w-3.5 h-3.5" />
                  Special Offers
                </div>
                <h2 className="text-4xl font-black text-brand-dark tracking-tighter italic">Active <span className="text-brand-cyan">Discounts</span></h2>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-xs md:text-right">
                Use these codes at checkout to save money on your order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((coupon: any) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="p-12 md:p-24 bg-brand-dark rounded-[64px] relative overflow-hidden text-center shadow-2xl shadow-brand-dark/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 via-transparent to-brand-cyan/20 opacity-30"></div>
          <Zap className="h-12 w-12 text-brand-pink mx-auto mb-8 animate-pulse relative z-10" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter max-w-4xl mx-auto leading-tight relative z-10 italic">
             {cms.ctaHeading}
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            {cms.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link href="/contact" className="inline-flex py-5 px-12 bg-white text-brand-dark rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl shadow-white/10">
              Inquire Now
            </Link>
            <Link href="/products" className="inline-flex py-5 px-12 bg-transparent text-white border-2 border-white/20 rounded-full font-black text-lg hover:bg-white/5 transition-all">
              View Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
