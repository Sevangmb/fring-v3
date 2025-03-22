
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { useToast } from "@/hooks/use-toast";
import { useModifierVetement } from "@/hooks/useModifierVetement";
import ModifierVetementHeader from "@/components/vetements/modifier/ModifierVetementHeader";
import ModifierVetementContent from "@/components/vetements/modifier/ModifierVetementContent";

/**
 * Page de modification d'un vêtement
 * Permet à l'utilisateur de modifier les informations d'un vêtement existant
 */
const ModifierVetementPage = () => {
  const { id } = useParams<{ id: string }>();
  const vetementId = parseInt(id || "0");
  const { toast } = useToast();
  
  // Chargement des données avec notre hook personnalisé
  const { user, vetement, marques, isLoading, error } = useModifierVetement(vetementId);

  return (
    <Layout>
      <ModifierVetementHeader />
      
      <div className="container mx-auto px-4 py-8">
        <ModifierVetementContent
          vetementId={vetementId}
          user={user}
          vetement={vetement}
          marques={marques}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </Layout>
  );
};

export default ModifierVetementPage;
