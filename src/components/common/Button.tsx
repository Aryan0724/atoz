import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-brand-darkBlue text-white hover:bg-brand-gold shadow-lg shadow-brand-darkBlue/20 active:scale-95 transition-all font-sans',
      secondary: 'bg-white border border-brand-darkBlue/10 text-brand-darkBlue hover:bg-brand-base shadow-sm active:scale-95 transition-all font-sans',
      outline: 'bg-transparent border border-brand-darkBlue/10 text-brand-darkBlue hover:border-brand-gold hover:text-brand-gold active:scale-95 transition-all font-sans',
      ghost: 'bg-transparent text-brand-darkBlue hover:bg-brand-base active:scale-95 transition-all font-sans',
      brand: 'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/30 active:scale-95 transition-all font-sans',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold rounded-full',
      md: 'px-6 py-3 text-sm font-bold rounded-full',
      lg: 'px-10 py-4 text-sm font-bold rounded-full uppercase tracking-widest',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-brand-pink/20',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
