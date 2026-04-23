"use client";

import React from 'react';
import { ShieldCheck, Zap, Sparkles, Heart, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  {
    icon: ShieldCheck,
    title: "Archival Quality",
    desc: "Premium inks that never fade or crack.",
    color: "text-brand-pink",
    bg: "bg-brand-pink/5"
  },
  {
    icon: Zap,
    title: "48hr Dispatch",
    desc: "Proprietary automation for rapid fulfillment.",
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/5"
  },
  {
    icon: Sparkles,
    title: "5-Step Audit",
    desc: "Every single item is manually inspected.",
    color: "text-brand-dark",
    bg: "bg-gray-50"
  },
  {
    icon: Heart,
    title: "Eco-Friendly",
    desc: "Organic materials & water-based inks.",
    color: "text-brand-olive",
    bg: "bg-brand-olive/5"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <motion.div 
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-5 p-8 rounded-[32px] border border-gray-50 hover:border-brand-pink/20 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${badge.bg} flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                <badge.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark mb-2">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
