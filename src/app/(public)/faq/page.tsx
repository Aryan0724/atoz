import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Calendar, Clock, User, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CmsContent } from '@/lib/supabase/types';
import NewsletterForm from '@/components/blog/NewsletterForm';

export const metadata: Metadata = {
  title: 'FAQ & Insights | A to Z Prints - Custom Printing Knowledge Base',
  description: 'Explore our knowledge base, frequently asked insights, and expert guides on custom printing, brand identity, and corporate gifting.',
};

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

export default async function FAQBlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-brand-base">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-brand-darkBlue">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-brand-gold/10 text-brand-gold font-bold text-[10px] tracking-[0.3em] uppercase rounded-full mb-8 border border-brand-gold/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            Knowledge Hub
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-8">
            Insights & <span className="italic text-brand-gold">Intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Exploring the intersection of high-fidelity design and manufacturing excellence.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-brand-base relative">
        <div className="max-w-7xl mx-auto px-8">
          {blogs.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm">
               <BookOpen className="w-16 h-16 text-gray-100 mx-auto mb-6" />
               <p className="text-xl font-serif text-brand-darkBlue italic">The archive is currently empty.</p>
               <p className="text-slate-400 font-sans mt-2">Check back soon for fresh manufacturing intel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog, idx) => (
                <Link 
                  key={blog.id} 
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col bg-white rounded-[2rem] border border-brand-blue/5 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden h-full"
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
                      <div className="w-full h-full bg-brand-base flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-brand-blue/10" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-darkBlue shadow-xl border border-white/50">
                        {blog.tags?.[0] || 'Perspective'}
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                        {new Date(blog.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5 text-brand-gold" />
                        {blog.reading_time || 5} Min Read
                      </div>
                    </div>

                    <h3 className="text-3xl font-serif text-brand-darkBlue leading-tight mb-6 group-hover:text-brand-gold transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm font-sans text-slate-500 line-clamp-3 mb-10 leading-relaxed">
                      {blog.excerpt || "Dive into this exploration of design and production excellence with AtoZ Prints."}
                    </p>

                    <div className="mt-auto pt-8 border-t border-brand-base flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-brand-gold" />
                        </div>
                        <span className="text-[10px] font-bold text-brand-darkBlue uppercase tracking-widest">{blog.author_name || 'Alchemist'}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-brand-darkBlue/10 flex items-center justify-center group-hover:bg-brand-darkBlue group-hover:text-white transition-all transform group-hover:translate-x-2">
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
      <section className="py-32 px-8 bg-white border-t border-brand-blue/5">
        <div className="max-w-5xl mx-auto bg-brand-darkBlue rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
              Stay Ahead of the <br /> <span className="italic text-brand-gold">Printing Curve.</span>
            </h2>
            <p className="text-white/40 font-sans font-medium text-lg mb-12 max-w-lg mx-auto">
              Get bi-weekly insights on manufacturing trends and design intelligence directly in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
