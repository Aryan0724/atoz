import React from 'react';
import { PRODUCTS } from '@/config/products';
import { ProductCard } from '@/components/configurator/ProductCard';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
            Custom Printing <span className="text-indigo-600">Made Simple</span>
          </h1>
          <p className="text-lg text-gray-600">
            Select a product to start customizing. High-quality materials, premium finishes, and real-time pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
