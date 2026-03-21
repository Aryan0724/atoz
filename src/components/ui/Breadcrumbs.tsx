import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex flex-wrap items-center text-sm text-gray-500 mb-6 font-medium", className)} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-brand-pink transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
          {item.href && index !== items.length - 1 ? (
            <Link 
              href={item.href}
              className="hover:text-brand-pink transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
