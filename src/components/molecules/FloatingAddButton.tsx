
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  visible: boolean;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ visible }) => {
  const navigate = useNavigate();
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-6 right-6 md:hidden">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => navigate("/mes-vetements/ajouter")}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default FloatingAddButton;
