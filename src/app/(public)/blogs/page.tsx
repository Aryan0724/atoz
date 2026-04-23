import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Calendar, Clock, User, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog | A to Z Prints - Custom Printing Insights',
  description: 'Explore the latest trends in custom printing, brand identity, and corporate gifting. Stay updated with our expert insights and stories.',
};

import { CmsContent } from '@/lib/supabase/types';
import NewsletterForm from '@/components/blog/NewsletterForm';

async function getBlogs(): Promise<CmsContent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cms_content')
    .select('*')
    .eq('type', 'Blog')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  return (data || []) as CmsContent[];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pink/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-brand-pink/10 text-brand-pink font-black text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 border border-brand-pink/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            Editorial Excellence
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-8 uppercase italic">
            The <span className="text-brand-pink">AtoZ</span> Dispatch
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-bold uppercase tracking-tight leading-relaxed">
            Exploring the intersection of high-fidelity design, custom manufacturing, and brand intelligence.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-8">
          {blogs.length === 0 ? (
            <div className="py-32 text-center bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
               <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
               <p className="text-xl font-black text-brand-dark uppercase tracking-widest italic">The matrix is currently empty.</p>
               <p className="text-gray-400 font-bold mt-2">Check back soon for fresh insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, idx) => (
                <Link 
                  key={blog.id} 
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 overflow-hidden h-full"
                >
                  <div className="relative h-72 overflow-hidden">
                    {blog.featured_image ? (
                      <Image 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-200" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-brand-dark shadow-xl border border-white/50">
                        {blog.tags?.[0] || 'Insight'}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-brand-pink" />
                        {new Date(blog.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-brand-pink" />
                        {blog.reading_time || 5} Min Read
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-brand-dark leading-tight mb-6 group-hover:text-brand-pink transition-colors line-clamp-2 uppercase italic">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm font-medium text-gray-500 line-clamp-3 mb-10 leading-relaxed">
                      {blog.excerpt || "Dive into this exploration of design and production excellence with AtoZ Prints."}
                    </p>

                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-pink/5 flex items-center justify-center">
                          <User className="w-5 h-5 text-brand-pink" />
                        </div>
                        <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">{blog.author_name || 'Admin'}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-pink group-hover:text-white transition-all transform group-hover:translate-x-2">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-32 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-brand-dark rounded-[64px] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-cyan/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="font-headline text-4xl md:text-6xl font-black text-white uppercase italic leading-none tracking-tighter mb-8">
              Stay Ahead of the <br /> <span className="text-brand-pink">Printing Curve</span>
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-12 max-w-lg mx-auto">
              Get bi-weekly insights on manufacturing trends and design intelligence directly in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
