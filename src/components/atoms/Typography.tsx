
import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
}

export function Heading({ 
  as: Component = 'h2', 
  variant = 'h2', 
  children, 
  className 
}: HeadingProps) {
  const styles = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 text-base font-semibold tracking-tight',
  };

  return (
    <Component className={cn(styles[variant], className)}>
      {children}
    </Component>
  );
}

interface TextProps {
  variant?: 'lead' | 'large' | 'small' | 'muted';
  children: React.ReactNode;
  className?: string;
}

export function Text({ variant, children, className }: TextProps) {
  const styles = {
    lead: 'text-xl text-muted-foreground',
    large: 'text-lg font-semibold',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-muted-foreground',
    default: 'leading-7',
  };

  return (
    <p className={cn(styles[variant || 'default'], className)}>
      {children}
    </p>
  );
}
