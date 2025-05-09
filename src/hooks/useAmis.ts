import { useState, useEffect, useCallback } from "react";
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

  const chargerAmis = useCallback(async () => {
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
  }, [user, toast]);

  useEffect(() => {
    chargerAmis();
  }, [chargerAmis]);

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
      
      console.log("Début de l'acceptation de la demande", amiId);
      const amiAccepte = await accepterDemandeAmi(amiId);
      console.log("Résultat de l'acceptation:", amiAccepte);
      
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
      console.error("Erreur détaillée lors de l'acceptation de la demande:", error);
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
