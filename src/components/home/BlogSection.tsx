"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CmsContent } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

export default function BlogSection() {
  const [blogs, setBlogs] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('*')
          .eq('type', 'Blog')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        console.error('Error fetching latest blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 py-1.5 px-3 bg-brand-pink/10 text-brand-pink font-bold text-[10px] tracking-widest uppercase rounded-lg mb-6 border border-brand-pink/20"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Intelligence Repository
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-headline text-5xl md:text-6xl font-black text-brand-dark italic uppercase leading-none tracking-tighter"
            >
              The Editorial <span className="text-brand-pink">Dispatch</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/blogs" 
              className="flex items-center gap-3 px-8 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-pink transition-all shadow-xl shadow-gray-200 group"
            >
              Access All Intel
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-[48px] h-[500px] animate-pulse border border-gray-100" />
            ))
          ) : (
            blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 overflow-hidden h-full relative"
                >
                  <div className="relative h-64 overflow-hidden">
                    {blog.featured_image ? (
                      <Image 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-200">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-brand-dark shadow-xl border border-white/50">
                        {blog.tags?.[0] || 'Intelligence'}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-brand-pink" />
                        {new Date(blog.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-brand-pink" />
                        {blog.reading_time || 5} Min Read
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-brand-dark leading-tight mb-6 group-hover:text-brand-pink transition-colors line-clamp-2 uppercase italic">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm font-medium text-gray-400 line-clamp-3 mb-10 leading-relaxed">
                      {blog.excerpt || "Exploring the high-fidelity intersection of design and custom printing technology."}
                    </p>

                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                       <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest group-hover:text-brand-pink transition-colors">Read Full Dossier</span>
                       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all transform group-hover:translate-x-2">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
