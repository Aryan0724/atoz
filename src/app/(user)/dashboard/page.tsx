import React from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { Package, Clock, Star, Settings } from 'lucide-react';

export default function DashboardPage() {
  const accountStats = [
    { label: "Active Orders", value: "02", icon: <Package /> },
    { label: "Design Drafts", value: "05", icon: <Clock /> },
    { label: "Brand Points", value: "1250", icon: <Star /> },
  ];

  return (
    <div className="bg-white min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <SectionHeading 
            badge="Welcome Back"
            title="Your Brand Panel"
            subtitle="Manage your customized orders and brand assets here."
            align="left"
          />
          <button className="flex items-center gap-3 px-8 py-4 bg-brand-lightGray rounded-2xl text-brand-dark font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all">
            <Settings className="h-5 w-5" />
            Account Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {accountStats.map((stat, idx) => (
            <div key={idx} className="p-10 bg-brand-dark rounded-[48px] text-white flex justify-between items-center group overflow-hidden relative">
              <div className="relative z-10">
                <div className="text-5xl font-black tracking-tighter mb-2">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
              <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all transform group-hover:rotate-12">
                {React.cloneElement(stat.icon as React.ReactElement, { className: "h-8 w-8" })}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            </div>
          ))}
        </div>

        <div className="bg-brand-lightGray rounded-[64px] p-12 md:p-20 text-center border border-gray-100">
           <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Package className="h-10 w-10 text-brand-dark" />
           </div>
           <h3 className="text-2xl font-black text-brand-dark mb-4">No recent orders found.</h3>
           <p className="text-gray-400 font-medium mb-12 max-w-sm mx-auto uppercase text-xs tracking-widest leading-relaxed">
             Start your first design and launch your brand merchandise today.
           </p>
           <a href="/products" className="inline-flex py-5 px-12 bg-brand-pink text-white rounded-full font-black text-lg hover:shadow-2xl hover:shadow-pink-200 transition-all">
             Explore Product Catalog
           </a>
        </div>
      </div>
    </div>
  );
}
