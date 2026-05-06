'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConfigStore } from '@/store/useConfigStore';
import { LivePreview } from '@/components/configurator/LivePreview';
import { ConfigForm } from '@/components/configurator/ConfigForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProductConfigPage() {
  const { id } = useParams();
  const router = useRouter();
  const { selectedProduct, setProduct, reset } = useConfigStore();

  useEffect(() => {
    if (id && typeof id === 'string') {
      setProduct(id);
    }
    
    return () => reset();
  }, [id, setProduct, reset]);

  if (!selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/products"
                className="flex items-center justify-center rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h1>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {selectedProduct.category}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
              <Sparkles size={14} />
              Premium Configuration
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-10">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left Side: Preview */}
          <div className="w-full lg:w-5/12">
            <LivePreview />
          </div>

          {/* Right Side: Configuration Form */}
          <div className="w-full lg:w-7/12">
            <ConfigForm />
          </div>
        </div>
      </main>
    </div>
  );
}
