
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEnsembleVetements } from "@/hooks/ensembles/useEnsembleVetements";
import { useModifierEnsemble } from "@/hooks/ensembles/useModifierEnsemble";
import EnsembleFormSkeleton from "@/components/ensembles/EnsembleFormSkeleton";
import ModifierEnsembleForm from "@/components/ensembles/ModifierEnsembleForm";

const ModifierEnsemble = () => {
  const { id } = useParams<{ id: string }>();
  const ensembleId = parseInt(id || "0");
  const navigate = useNavigate();
  const { allVetements, loading: loadingVetements } = useEnsembleVetements();
  
  const {
    ensemble,
    formData,
    loading,
    saving,
    handleChange,
    handleItemsSelected,
    handleSubmit,
    initializeSelectedItems
  } = useModifierEnsemble(ensembleId);

  // Initialize selected items when vetements are loaded
  useEffect(() => {
    if (ensemble && allVetements.length > 0) {
      initializeSelectedItems(allVetements);
    }
  }, [ensemble, allVetements]);

  if (loading || loadingVetements) {
    return (
      <Layout>
        <EnsembleFormSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Modifier un ensemble | Garde-Robe</title>
        <meta name="description" content="Modifier un ensemble de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/ensembles")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux ensembles
          </Button>
          
          <ModifierEnsembleForm
            formData={formData}
            onChange={handleChange}
            onItemsSelected={handleItemsSelected}
            onSubmit={handleSubmit}
            saving={saving}
            vetements={allVetements}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ModifierEnsemble;
