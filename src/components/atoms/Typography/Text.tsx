
import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  variant?: 'small' | 'muted' | 'lead' | 'large' | 'subtle' | 'h1' | 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
  className?: string;
  weight?: string;
  title?: string;
  as?: React.ElementType;
}

const Text = ({
  variant,
  children,
  className,
  weight,
  title,
  as: Component = 'p',
  ...props
}: TextProps) => {
  const styles = {
    small: 'text-sm text-muted-foreground',
    muted: 'text-muted-foreground',
    lead: 'text-xl text-muted-foreground',
    large: 'text-lg',
    subtle: 'text-sm text-gray-500',
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight'
  };

  const weightStyle = weight ? `font-${weight}` : '';
  
  // Fix the props issue by using destructuring and spreading properly
  const componentProps = {
    className: cn(
      variant && styles[variant],
      weightStyle,
      className
    ),
    title,
    ...props
  };
  
  return <Component {...componentProps}>{children}</Component>;
};

export default Text;
