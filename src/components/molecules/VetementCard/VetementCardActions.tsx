
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';
import FavoriButton from '@/components/atoms/FavoriButton';

interface VetementCardActionsProps {
  vetement: Vetement;
  onDelete: (id: number) => Promise<void>;
  showOwner?: boolean;
}

const VetementCardActions: React.FC<VetementCardActionsProps> = ({ 
  vetement, 
  onDelete,
  showOwner = false
}) => {
  const navigate = useNavigate();
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/mes-vetements/modifier/${vetement.id}`);
  };

  const handleDelete = async () => {
    try {
      await onDelete(vetement.id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  
  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <FavoriButton 
          type="vetement" 
          elementId={vetement.id} 
          nom={vetement.nom}
        />
        {!showOwner && (
          <div className="flex items-center gap-1">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 bg-theme-teal-dark text-white hover:bg-theme-teal-medium shadow-sm"
              onClick={handleEdit}
              title="Modifier"
            >
              <Edit size={14} />
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleDelete}
              title="Supprimer"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile edit button - only visible on small screens */}
      {!showOwner && (
        <div className="sm:hidden absolute right-2 bottom-2 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="bg-theme-teal-dark text-white hover:bg-theme-teal-medium shadow"
            onClick={handleEdit}
          >
            <Edit className="mr-1 h-4 w-4" /> Modifier
          </Button>
        </div>
      )}
    </>
  );
};

export default VetementCardActions;
