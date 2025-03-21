
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchAmisWithEmails, 
  accepterDemandeAmi, 
  rejeterDemandeAmi, 
  Ami 
} from "@/services/amis";

export const useAmis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amis, setAmis] = useState<Ami[]>([]);
  const [loadingAmis, setLoadingAmis] = useState(true);
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  const chargerAmis = async () => {
    if (!user) {
      setLoadingAmis(false);
      return;
    }

    try {
      setLoadingAmis(true);
      const amisEnrichis = await fetchAmisWithEmails();
      setAmis(amisEnrichis);
    } catch (error) {
      console.error("Erreur lors du chargement des amis:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos amis.",
        variant: "destructive",
      });
    } finally {
      setLoadingAmis(false);
    }
  };

  useEffect(() => {
    chargerAmis();
  }, [user, toast]);

  const handleAccepterDemande = async (amiId: number) => {
    const processKey = `accept-${amiId}`;
    if (processingIds[processKey]) {
      console.log("Demande déjà en cours de traitement, ignorée");
      return;
    }
    
    try {
      setProcessingIds(prev => ({ ...prev, [processKey]: true }));
      
      const loadingToast = toast({
        title: "Traitement en cours",
        description: "Acceptation de la demande d'ami...",
      });
      
      const amiAccepte = await accepterDemandeAmi(amiId);
      
      if (loadingToast) {
        loadingToast.dismiss();
      }
      
      if (amiAccepte) {
        toast({
          title: "Demande acceptée",
          description: "Vous êtes maintenant amis !",
        });
        
        await chargerAmis();
      } else {
        toast({
          title: "Erreur",
          description: "La demande n'a pas pu être acceptée. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [processKey]: false }));
    }
  };

  const handleRejeterDemande = async (amiId: number) => {
    const processKey = `reject-${amiId}`;
    if (processingIds[processKey]) {
      return;
    }
    
    try {
      setProcessingIds(prev => ({ ...prev, [processKey]: true }));
      
      const loadingToast = toast({
        title: "Traitement en cours",
        description: "Rejet de la demande d'ami...",
      });
      
      await rejeterDemandeAmi(amiId);
      
      if (loadingToast) {
        loadingToast.dismiss();
      }
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée.",
      });
      
      await chargerAmis();
    } catch (error: any) {
      console.error("Erreur lors du rejet de la demande:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [processKey]: false }));
    }
  };

  const filteredAmis = {
    demandesRecues: amis.filter(ami => 
      ami.status === 'pending' && ami.ami_id === user?.id
    ),
    demandesEnvoyees: amis.filter(ami => 
      ami.status === 'pending' && ami.user_id === user?.id
    ),
    amisAcceptes: amis.filter(ami => 
      ami.status === 'accepted'
    )
  };

  return {
    amis,
    loadingAmis,
    filteredAmis,
    chargerAmis,
    handleAccepterDemande,
    handleRejeterDemande
  };
};
