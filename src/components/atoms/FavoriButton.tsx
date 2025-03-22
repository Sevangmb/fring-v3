
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElementFavori } from '@/hooks/useElementFavori';

interface FavoriButtonProps {
  type: 'utilisateur' | 'vetement' | 'ensemble';
  elementId: string | number;
  nom?: string;
  variant?: 'default' | 'ghost' | 'icon';
  className?: string;
}

const FavoriButton: React.FC<FavoriButtonProps> = ({
  type,
  elementId,
  nom,
  variant = 'icon',
  className
}) => {
  const { estFavori, loading, toggleFavori } = useElementFavori(type, elementId, nom);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavori();
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 bg-background/80 backdrop-blur-sm",
          className
        )}
        onClick={handleClick}
        disabled={loading}
        aria-label={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            estFavori ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        />
      </Button>
    );
  }

  if (variant === 'ghost') {
    return (
      <Button
        variant="ghost"
        className={cn(
          "group flex items-center gap-1.5",
          className
        )}
        onClick={handleClick}
        disabled={loading}
      >
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            estFavori ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover:text-red-500"
          )}
        />
        <span>{estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      className={cn(
        "flex items-center gap-1.5",
        className
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <Heart
        size={16}
        className={cn(
          "transition-colors",
          estFavori ? "fill-red-500" : ""
        )}
      />
      <span>{estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
    </Button>
  );
};

export default FavoriButton;
