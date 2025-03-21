
import React, { useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import AmisPageContent from "@/components/templates/AmisPageContent";
import { useAmis } from "@/hooks/useAmis";
import { Helmet } from "react-helmet";

const MesAmisPage = () => {
  const { user, loading } = useAuth();
  const { 
    loadingAmis, 
    filteredAmis, 
    handleAccepterDemande, 
    handleRejeterDemande,
    chargerAmis 
  } = useAmis();

  // Charger les amis lorsque l'utilisateur se connecte
  useEffect(() => {
    if (user && !loadingAmis) {
      chargerAmis();
    }
  }, [user]);

  return (
    <Layout>
      <Helmet>
        <title>Mes Amis | Gestion des amis</title>
        <meta name="description" content="Gérez vos amis, acceptez ou refusez des demandes d'amitié" />
      </Helmet>

      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-8">
          <AmisPageContent 
            loadingAmis={loadingAmis}
            demandesRecues={filteredAmis.demandesRecues}
            demandesEnvoyees={filteredAmis.demandesEnvoyees}
            amisAcceptes={filteredAmis.amisAcceptes}
            onAccepterDemande={handleAccepterDemande}
            onRejeterDemande={handleRejeterDemande}
            onAmiAdded={chargerAmis}
          />
        </div>
      )}
    </Layout>
  );
};

export default MesAmisPage;
