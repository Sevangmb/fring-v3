
import React, { useEffect, useState } from "react";
import Layout from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAmis, accepterDemandeAmi, rejeterDemandeAmi, Ami } from "@/services/amiService";
import { useToast } from "@/hooks/use-toast";

import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import DemandesRecuesSection from "@/components/organisms/DemandesRecuesSection";
import DemandesEnvoyeesSection from "@/components/organisms/DemandesEnvoyeesSection";
import AmisAcceptesSection from "@/components/organisms/AmisAcceptesSection";
import AjouterAmiDialog from "@/components/molecules/AjouterAmiDialog";

const MesAmisPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [amis, setAmis] = useState<Ami[]>([]);
  const [loadingAmis, setLoadingAmis] = useState(true);
  const [ajouterAmiDialogOpen, setAjouterAmiDialogOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const chargerAmis = async () => {
      if (!user) {
        setLoadingAmis(false);
        return;
      }

      try {
        setLoadingAmis(true);
        const listeAmis = await fetchAmis();
        setAmis(listeAmis);
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

    chargerAmis();
  }, [user, toast]);

  const handleAccepterDemande = async (amiId: number) => {
    // Éviter les clics multiples
    if (processingIds[`accept-${amiId}`]) return;
    
    try {
      setProcessingIds(prev => ({ ...prev, [`accept-${amiId}`]: true }));
      
      const amiAccepte = await accepterDemandeAmi(amiId);
      
      if (amiAccepte) {
        toast({
          title: "Demande acceptée",
          description: "Vous êtes maintenant amis !",
        });
        
        // Mettre à jour la liste des amis
        const listeAmis = await fetchAmis();
        setAmis(listeAmis);
      } else {
        toast({
          title: "Attention",
          description: "La demande a été traitée mais n'a pas pu être retrouvée. Veuillez actualiser la page.",
          variant: "destructive",
        });
        
        // Rafraîchir la liste quand même
        const listeAmis = await fetchAmis();
        setAmis(listeAmis);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      
      // Message d'erreur détaillé pour debug
      const errorMessage = error?.message || "Une erreur inconnue s'est produite";
      
      toast({
        title: "Erreur lors de l'acceptation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [`accept-${amiId}`]: false }));
    }
  };

  const handleRejeterDemande = async (amiId: number) => {
    // Éviter les clics multiples
    if (processingIds[`reject-${amiId}`]) return;
    
    try {
      setProcessingIds(prev => ({ ...prev, [`reject-${amiId}`]: true }));
      
      await rejeterDemandeAmi(amiId);
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée.",
      });
      
      // Mettre à jour la liste des amis
      const listeAmis = await fetchAmis();
      setAmis(listeAmis);
    } catch (error: any) {
      console.error("Erreur lors du rejet de la demande:", error);
      
      const errorMessage = error?.message || "Une erreur inconnue s'est produite";
      
      toast({
        title: "Erreur lors du rejet",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [`reject-${amiId}`]: false }));
    }
  };

  const handleAmiAdded = async () => {
    // Mettre à jour la liste des amis après avoir ajouté un ami
    try {
      const listeAmis = await fetchAmis();
      setAmis(listeAmis);
    } catch (error) {
      console.error("Erreur lors du chargement des amis:", error);
    }
  };

  // Filtrer les amis par statut
  const demandesRecues = amis.filter(ami => 
    ami.status === 'pending' && ami.ami_id === user?.id
  );
  
  const demandesEnvoyees = amis.filter(ami => 
    ami.status === 'pending' && ami.user_id === user?.id
  );
  
  const amisAcceptes = amis.filter(ami => 
    ami.status === 'accepted'
  );

  return (
    <Layout>
      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-12">
          {loadingAmis ? (
            <div className="flex justify-center">
              <div className="animate-pulse space-y-4">
                <div className="h-20 w-64 bg-muted rounded-lg"></div>
                <div className="h-20 w-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Demandes d'amis reçues */}
              <DemandesRecuesSection 
                demandes={demandesRecues} 
                onAccepter={handleAccepterDemande}
                onRejeter={handleRejeterDemande}
              />
              
              {/* Demandes d'amis envoyées */}
              <DemandesEnvoyeesSection 
                demandes={demandesEnvoyees} 
                onAnnuler={handleRejeterDemande}
              />
              
              {/* Amis confirmés */}
              <AmisAcceptesSection 
                amis={amisAcceptes} 
                onRetirer={handleRejeterDemande}
              />

              {/* Bouton pour ajouter des amis */}
              <div className="flex justify-center mt-8">
                <Button onClick={() => setAjouterAmiDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter des amis
                </Button>
              </div>
            </div>
          )}
          
          {/* Dialog pour ajouter des amis */}
          <AjouterAmiDialog 
            open={ajouterAmiDialogOpen}
            onClose={() => setAjouterAmiDialogOpen(false)}
            onAmiAdded={handleAmiAdded}
          />
        </div>
      )}
    </Layout>
  );
};

export default MesAmisPage;
