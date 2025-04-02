
import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'lead' | 'large' | 'small' | 'muted' | 'subtle'; // Ajout de 'subtle'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'; // Ajout de la prop weight
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Ajout des éléments de titre
  className?: string;
  title?: string; // Ajout du titre
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'muted',
  as = 'p',
  weight = 'normal',
  className = '',
  title,
  ...props
}) => {
  const Component = as;
  
  const getVariantClass = () => {
    switch (variant) {
      case 'lead':
        return 'text-xl text-muted-foreground';
      case 'large':
        return 'text-lg font-semibold';
      case 'small':
        return 'text-sm font-medium';
      case 'muted':
        return 'text-sm text-muted-foreground';
      case 'subtle': // Ajout de la variante 'subtle'
        return 'text-sm text-muted-foreground opacity-75';
      default:
        return 'text-base text-foreground';
    }
  };
  
  const getWeightClass = () => {
    switch (weight) {
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };
  
  return (
    <Component
      className={cn(getVariantClass(), getWeightClass(), className)}
      title={title}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
