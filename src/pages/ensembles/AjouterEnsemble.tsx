
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useEnsembleCreation } from "@/hooks/useEnsembleCreation";
import EnsembleLoading from "@/components/ensembles/EnsembleLoading";
import EnsembleEmptyState from "@/components/ensembles/EnsembleEmptyState";
import EnsembleForm from "@/components/ensembles/EnsembleForm";

const AjouterEnsemble = () => {
  const { user } = useAuth();
  const {
    allVetements,
    loading,
    selectedItems,
    creating,
    setSelectedItems,
    handleCreateEnsemble
  } = useEnsembleCreation();
  
  return (
    <Layout>
      <Helmet>
        <title>Créer un Ensemble | Garde-Robe</title>
        <meta name="description" content="Créez un nouvel ensemble de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <EnsembleLoading />
          ) : allVetements.length === 0 ? (
            <EnsembleEmptyState />
          ) : (
            <EnsembleForm 
              vetements={allVetements}
              selectedItems={selectedItems}
              onItemsSelected={setSelectedItems}
              creating={creating}
              onSubmit={handleCreateEnsemble}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AjouterEnsemble;
