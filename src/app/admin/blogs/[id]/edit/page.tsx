"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { supabase } from '@/lib/supabase/client';
import { CmsContent } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<CmsContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (err: any) {
      console.error('Error fetching blog:', err);
      toast.error('Failed to load blog post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-12 w-12 text-brand-pink animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Article Data...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-bold">Article not found.</p>
      </div>
    );
  }

  return <BlogEditor initialData={blog} isEditing={true} />;
}
