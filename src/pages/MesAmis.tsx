import React, { useEffect, useState } from "react";
import Layout from "@/components/templates/Layout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchAmisWithEmails, 
  accepterDemandeAmi, 
  rejeterDemandeAmi, 
  Ami 
} from "@/services/amis";
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

  const handleAmiAdded = async () => {
    await chargerAmis();
  };

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
              <DemandesRecuesSection 
                demandes={demandesRecues} 
                onAccepter={handleAccepterDemande}
                onRejeter={handleRejeterDemande}
              />
              
              <DemandesEnvoyeesSection 
                demandes={demandesEnvoyees} 
                onAnnuler={handleRejeterDemande}
              />
              
              <AmisAcceptesSection 
                amis={amisAcceptes} 
                onRetirer={handleRejeterDemande}
              />

              <div className="flex justify-center mt-8">
                <Button onClick={() => setAjouterAmiDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter des amis
                </Button>
              </div>
            </div>
          )}
          
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
