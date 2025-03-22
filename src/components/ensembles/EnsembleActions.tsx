
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { deleteEnsemble } from '@/services/ensemble';
import FavoriButton from '@/components/atoms/FavoriButton';

interface EnsembleActionsProps {
  ensembleId: number;
  onDelete?: () => void;
  nom?: string;
}

const EnsembleActions: React.FC<EnsembleActionsProps> = ({ 
  ensembleId, 
  onDelete,
  nom
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = () => {
    navigate(`/ensembles/modifier/${ensembleId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet ensemble ?")) {
      try {
        setIsDeleting(true);
        await deleteEnsemble(ensembleId);
        toast({
          title: "Succès",
          description: "L'ensemble a été supprimé avec succès"
        });
        if (onDelete) onDelete();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ensemble:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'ensemble",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="absolute top-2 right-2 flex gap-1 z-10">
      <FavoriButton 
        type="ensemble" 
        elementId={ensembleId} 
        nom={nom}
      />
      <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 bg-background/80 backdrop-blur-sm">
        <Edit size={16} className="text-muted-foreground hover:text-primary" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete} 
        className="h-8 w-8 bg-background/80 backdrop-blur-sm"
        disabled={isDeleting}
      >
        <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
};

export default EnsembleActions;
