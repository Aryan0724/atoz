import React from 'react';
import { supabase } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import SectionHeading from '@/components/common/SectionHeading';
import Link from 'next/link';

// NOTE: Since this intercepts at the root of (public) / [cms_slug]
// It acts as a fallback for any path that isn't a hardcoded directory.

export default async function CMSPublicRoute({ params }: { params: { cms_slug: string } }) {
  const { data: pageData, error } = await supabase
    .from('cms_content')
    .select('*')
    .eq('slug', params.cms_slug)
    .eq('status', 'published')
    .single();

  if (error || !pageData) {
    notFound();
  }

  return (
    <div className="bg-[#f7f7f2] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Breadcrumbs slug={params.cms_slug} title={pageData.title} />
        
        <header className="mb-16">
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-pink mb-4">
             {pageData.type}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tighter italic uppercase mb-6 leading-none">
             {pageData.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
             <span>By {pageData.author_name || 'AtoZ Admin'}</span>
             <span className="w-1 h-1 rounded-full bg-brand-pink" />
             <span>Updated {new Date(pageData.last_modified).toLocaleDateString()}</span>
          </div>
        </header>

        <article className="prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-headings:text-brand-dark prose-p:text-gray-600 prose-p:font-medium prose-a:text-brand-pink prose-strong:text-brand-dark">
          {/* Extremely simple Markdown renderer for the CMS content */}
          {pageData.content.split('\n').map((line: string, i: number) => {
             if (line.startsWith('# ')) return <h1 key={i} className="text-3xl mt-12 mb-6 uppercase italic tracking-tight">{line.replace('# ', '')}</h1>;
             if (line.startsWith('## ')) return <h2 key={i} className="text-2xl mt-10 mb-4">{line.replace('## ', '')}</h2>;
             if (line.startsWith('### ')) return <h3 key={i} className="text-xl mt-8 mb-3">{line.replace('### ', '')}</h3>;
             if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2">{line.replace('- ', '')}</li>;
             if (line.trim() === '') return <div key={i} className="h-4" />;
             return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
          })}
        </article>
      </div>
    </div>
  );
}

function Breadcrumbs({ slug, title }: { slug: string, title: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
       <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
       <span>/</span>
       <span className="text-brand-dark">{title}</span>
    </div>
  );
}
