
import { useNavigate } from "react-router-dom";
import { deleteVetement } from '@/services/vetement';
import { useToast } from "@/hooks/use-toast";

export function useVetementOperations() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce vêtement ?")) {
      try {
        await deleteVetement(id);
        
        toast({
          title: "Vêtement supprimé",
          description: "Le vêtement a été supprimé avec succès.",
        });
        
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer ce vêtement.",
          variant: "destructive",
        });
        return false;
      }
    }
    return false;
  };

  const navigateToAdd = () => navigate("/mes-vetements/ajouter");
  const navigateToLogin = () => navigate("/login");
  const navigateToFriends = () => navigate("/mes-amis");

  return {
    handleDelete,
    navigateToAdd,
    navigateToLogin,
    navigateToFriends
  };
}
