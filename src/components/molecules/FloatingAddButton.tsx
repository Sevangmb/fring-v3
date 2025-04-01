
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingAddButtonProps {
  visible: boolean;
  onClick?: () => void;
  routePath?: string;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ 
  visible, 
  onClick,
  routePath = "/mes-vetements/ajouter"
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (!visible || !isMobile) return null;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(routePath);
    }
  };
  
  return (
    <div className="fixed bottom-8 right-6 z-40">
      <Button
        size="lg"
        className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={handleClick}
      >
        <Plus size={28} />
      </Button>
    </div>
  );
};

export default FloatingAddButton;
