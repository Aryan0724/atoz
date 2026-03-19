"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/types';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProductManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Error deleting product');
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">Manage <span className="text-brand-pink">Inventory</span></h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Products: {products.length}</p>
        </div>
        <Link 
          href="/admin/products/add"
          className="flex items-center gap-3 px-8 py-4 bg-brand-pink text-white rounded-2xl font-bold shadow-xl shadow-pink-100 hover:-translate-y-1 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </Link>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-pink/20 focus:outline-none font-medium text-sm transition-all"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-500 focus:outline-none focus:bg-white focus:border-brand-pink/20 transition-all appearance-none cursor-pointer pr-10"
        >
          <option value="all">All Categories</option>
          <option value="Packaging">Packaging</option>
          <option value="Stationary">Stationary</option>
          <option value="Apparel">Apparel</option>
          <option value="Merchandise">Merchandise</option>
        </select>
        <button className="px-6 py-3 bg-brand-dark text-white rounded-2xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-gray-100">
          <Filter className="h-4 w-4" />
          Advanced
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 text-brand-pink animate-spin" />
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Updating Inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">
                     No products found in the catalog.
                   </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                               <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-dark text-sm mb-1 group-hover:text-brand-pink transition-colors">{product.name}</h4>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: {product.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-brand-lightGray rounded-lg text-[10px] font-black text-brand-dark uppercase tracking-widest border border-gray-100">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-brand-dark">₹{product.base_price?.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-500">MOQ: {product.moq}</span>
                          <span className="text-[10px] text-gray-300 font-black uppercase">{product.delivery_days} Days Delivery</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/edit/${product.slug}`}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-pink hover:border-brand-pink/20 transition-all shadow-sm block"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link 
                          href={`/products/${product.slug}`}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-brand-cyan hover:border-brand-cyan/20 transition-all shadow-sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div className="px-8 py-6 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredProducts.length} of {products.length} Products</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 disabled:opacity-50" disabled>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
