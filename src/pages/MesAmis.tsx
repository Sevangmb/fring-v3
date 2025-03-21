
import React from "react";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import AmisPageContent from "@/components/templates/AmisPageContent";
import { useAmis } from "@/hooks/useAmis";

const MesAmisPage = () => {
  const { user, loading } = useAuth();
  const { 
    loadingAmis, 
    filteredAmis, 
    handleAccepterDemande, 
    handleRejeterDemande,
    chargerAmis 
  } = useAmis();

  return (
    <Layout>
      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-12">
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
