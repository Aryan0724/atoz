import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

import { CmsContent } from '@/lib/supabase/types';

async function getBlog(slug: string): Promise<CmsContent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cms_content')
    .select('*')
    .eq('slug', slug)
    .eq('type', 'Blog')
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as CmsContent;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  
  if (!blog) return { title: 'Not Found' };

  return {
    title: `${blog.title} | AtoZ Prints Blog`,
    description: blog.meta_description || blog.excerpt || `Read about ${blog.title} on AtoZ Prints.`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.meta_description,
      images: blog.featured_image ? [blog.featured_image] : [],
      type: 'article',
      publishedTime: blog.created_at,
      authors: [blog.author_name || 'AtoZ Prints Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.meta_description,
      images: blog.featured_image ? [blog.featured_image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlog(params.slug);

  if (!blog) notFound();

  return (
    <article className="min-h-screen bg-white pb-32">
      {/* Article Header */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <Link 
            href="/blogs" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-brand-pink transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Matrix
          </Link>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {blog.tags?.map((tag: string) => (
              <span key={tag} className="px-4 py-1.5 bg-brand-pink/10 text-brand-pink border border-brand-pink/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                {tag}
              </span>
            )) || (
              <span className="px-4 py-1.5 bg-brand-pink/10 text-brand-pink border border-brand-pink/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                Editorial
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-10 uppercase italic">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 py-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center border border-brand-pink/20">
                <User className="w-6 h-6 text-brand-pink" />
              </div>
              <div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">{blog.author_name || 'Admin'}</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">Principal Strategist</div>
              </div>
            </div>
            
            <div className="h-8 w-px bg-white/5 hidden md:block" />
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                  <Calendar className="w-4 h-4 text-brand-pink" />
                  {new Date(blog.created_at || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-brand-pink" />
                  {blog.reading_time || 5} Min Read
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featured_image && (
        <div className="max-w-6xl mx-auto px-8 -mt-24 relative z-20">
          <div className="relative aspect-[21/9] rounded-[60px] overflow-hidden shadow-2xl border-8 border-white group">
            <Image 
              src={blog.featured_image} 
              alt={blog.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-8 mt-20 grid md:grid-cols-[1fr_80px] gap-12">
        <div className="prose prose-lg prose-pink max-w-none">
           {/* We use a simple whitespace-preserving rendering if we don't have a MD parser, 
               but ideally we'd use something like react-markdown here. 
               For now, let's render paragraphs based on newlines. */}
           <div className="text-xl font-bold text-brand-dark/80 italic leading-relaxed mb-12 border-l-4 border-brand-pink pl-8 bg-gray-50 py-8 rounded-r-3xl">
              {blog.excerpt}
           </div>
           
           <div className="space-y-6 text-gray-700 font-medium leading-loose whitespace-pre-wrap">
              {blog.content}
           </div>
           
           {/* Tags / Footer */}
           <div className="mt-20 pt-12 border-t border-gray-100 flex flex-wrap gap-3">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-pink" /> Knowledge Clusters:
              </span>
              {blog.tags?.map((tag: string) => (
                <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-transparent hover:border-brand-pink/20 hover:text-brand-pink transition-all cursor-default">
                  #{tag}
                </span>
              ))}
           </div>
        </div>

        {/* Sidebar Sharing */}
        <aside className="hidden md:block">
           <div className="sticky top-32 flex flex-col items-center gap-6">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180 mb-4">Share Intel</span>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-pink hover:text-white hover:shadow-xl hover:shadow-brand-pink/20 transition-all group">
                 <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-cyan hover:text-white hover:shadow-xl hover:shadow-brand-cyan/20 transition-all group">
                 <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-dark hover:text-white hover:shadow-xl hover:shadow-brand-dark/20 transition-all group">
                 <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-pink hover:text-white hover:shadow-xl hover:shadow-brand-pink/20 transition-all group">
                 <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
           </div>
        </aside>
      </div>

      {/* Author Card */}
      <section className="max-w-4xl mx-auto px-8 mt-32">
         <div className="bg-gray-50 rounded-[48px] p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-[40px] bg-brand-dark flex items-center justify-center relative overflow-hidden group">
               <User className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-brand-pink opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <span className="text-[10px] font-black text-brand-pink uppercase tracking-[0.3em] mb-2 block">Written Intelligence By</span>
               <h3 className="text-3xl font-black text-brand-dark uppercase italic mb-4">{blog.author_name || 'AtoZ Admin'}</h3>
               <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xl">
                 Crafting high-fidelity custom merchandise solutions for modern brands. Our mission is to bridge the gap between creative vision and physical reality with unparalleled precision.
               </p>
               <div className="mt-8 flex justify-center md:justify-start gap-4">
                  <Link href="/blogs" className="text-[10px] font-black uppercase tracking-widest text-brand-dark hover:text-brand-pink transition-colors underline underline-offset-8 decoration-brand-pink/30">View All Author Intelligence →</Link>
               </div>
            </div>
         </div>
      </section>
    </article>
  );
}
