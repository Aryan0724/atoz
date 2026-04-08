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
      primary: 'bg-brand-dark text-white hover:bg-brand-dark/90 shadow-md shadow-brand-dark/20 active:scale-95 transition-all',
      secondary: 'bg-white border border-gray-200 text-brand-dark hover:bg-gray-50 shadow-sm active:scale-95 transition-all',
      outline: 'bg-transparent border border-gray-200 text-brand-dark hover:border-brand-pink hover:text-brand-pink active:scale-95 transition-all',
      ghost: 'bg-transparent text-brand-dark hover:bg-gray-100 active:scale-95 transition-all',
      brand: 'bg-brand-pink text-white hover:bg-brand-pink/90 shadow-md shadow-brand-pink/30 active:scale-95 transition-all',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs font-bold rounded-lg',
      md: 'px-6 py-3 text-sm font-bold rounded-xl',
      lg: 'px-8 py-4 text-base font-bold rounded-xl',
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
