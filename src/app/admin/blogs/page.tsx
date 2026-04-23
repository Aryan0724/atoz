"use client";

import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CmsContent } from '@/lib/supabase/types';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function BlogManagerPage() {
  const [blogs, setBlogs] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('type', 'Blog')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      toast.error('Failed to load blogs: ' + err.message);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('cms_content')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setBlogs(blogs.filter(b => b.id !== id));
        toast.success('Blog post deleted successfully');
      } catch (err: any) {
        toast.error('Error deleting blog: ' + err.message);
      }
    }
  };

  const toggleStatus = async (blog: CmsContent) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({ status: newStatus })
        .eq('id', blog.id);

      if (error) throw error;
      
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, status: newStatus } : b));
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
    } catch (err: any) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author_name && b.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Blogs' }]} />
          <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-4 flex items-center gap-4">
            Editorial <span className="text-brand-pink italic">Intelligence</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-pink" /> 
            Active Blog Repository • {blogs.length} Articles
          </p>
        </div>
        <Link 
          href="/admin/blogs/new"
          className="group relative flex items-center gap-3 px-10 py-5 bg-brand-dark text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl hover:shadow-brand-pink/20 hover:-translate-y-1 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink to-brand-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
          <Plus className="h-5 w-5 text-brand-pink" />
          Create New Article
        </Link>
      </header>

      {/* Futuristic Toolbar */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-brand-pink transition-colors" />
          <input 
            type="text"
            placeholder="Search by title, slug, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/10 focus:outline-none font-bold text-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-8 py-4 bg-gray-50/50 border border-transparent rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 focus:outline-none focus:bg-white focus:border-brand-pink/10 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <button className="px-6 py-4 bg-gray-50/50 text-gray-400 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark border border-transparent hover:border-gray-100 transition-all">
            <Filter className="h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-pink/20 blur-2xl rounded-full animate-pulse" />
              <Loader2 className="h-12 w-12 text-brand-pink animate-spin relative z-10" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Accessing Database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
             <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching articles found.</p>
             <button onClick={() => {setSearchQuery(''); setStatusFilter('all');}} className="mt-4 text-[10px] font-black text-brand-pink uppercase tracking-widest underline underline-offset-4">Reset Filters</button>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog.id} className="group bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="relative h-56 overflow-hidden">
                {blog.featured_image ? (
                  <Image src={blog.featured_image} alt={blog.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-200" />
                  </div>
                )}
                <div className="absolute top-5 right-5 z-10">
                  <button 
                    onClick={() => toggleStatus(blog)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border transition-all",
                      blog.status === 'published' 
                        ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500 hover:text-white" 
                        : "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500 hover:text-white"
                    )}
                  >
                    {blog.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {blog.status}
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                   <div className="flex gap-2 w-full">
                      <Link href={`/admin/blogs/${blog.id}/edit`} className="flex-1 bg-white py-3 rounded-xl text-brand-dark text-[10px] font-black uppercase tracking-widest text-center hover:bg-brand-pink hover:text-white transition-all">Edit Post</Link>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="w-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black text-brand-pink uppercase tracking-widest bg-brand-pink/5 px-3 py-1 rounded-lg border border-brand-pink/10">Blog Post</span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {blog.reading_time || 5} Min Read
                  </span>
                </div>
                <h3 className="text-xl font-black text-brand-dark leading-tight mb-4 group-hover:text-brand-pink transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs font-medium text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                  {blog.excerpt || "No excerpt provided for this article."}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-brand-dark uppercase tracking-tight">{blog.author_name || 'Admin'}</div>
                      <div className="text-[9px] font-bold text-gray-300 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> 
                        {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Just now'}
                      </div>
                    </div>
                  </div>
                  <Link href={`/blogs/${blog.slug}`} target="_blank" className="p-2 text-gray-300 hover:text-brand-cyan transition-colors">
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Futuristic Pagination */}
      {!loading && filteredBlogs.length > 0 && (
        <div className="mt-16 flex items-center justify-between p-8 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/30">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Showing <span className="text-brand-dark">{filteredBlogs.length}</span> results in intelligence matrix</p>
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-30 cursor-not-allowed" disabled>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-brand-dark border border-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand-dark/20">
              1
            </button>
            <button className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-30 cursor-not-allowed" disabled>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
