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
      "mb-20",
      align === 'center' ? "text-center" : "text-left",
      className
    )}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-lg bg-brand-pink/5 text-brand-pink text-[10px] font-black uppercase tracking-widest mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg text-gray-500 font-medium max-w-2xl",
          align === 'center' ? "mx-auto" : "mr-auto"
        )}>
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-[3px] w-12 bg-brand-pink mt-10 rounded-full opacity-60",
        align === 'center' ? "mx-auto" : "mr-auto"
      )}></div>
    </div>
  );
};

export default SectionHeading;
