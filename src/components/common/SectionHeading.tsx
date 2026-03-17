import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
  badge?: string;
}

const SectionHeading = ({ 
  title, 
  subtitle, 
  className, 
  align = 'center',
  badge 
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "mb-16",
      align === 'center' ? "text-center" : "text-left",
      className
    )}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg text-gray-500 max-w-2xl",
          align === 'center' ? "mx-auto" : "mr-auto"
        )}>
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1.5 w-20 bg-brand-pink mt-8 rounded-full",
        align === 'center' ? "mx-auto" : "mr-auto"
      )}></div>
    </div>
  );
};

export default SectionHeading;
