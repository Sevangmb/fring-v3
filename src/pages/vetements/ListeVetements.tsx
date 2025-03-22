
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import ViewModeSelector from "@/components/molecules/ViewModeSelector";

const ListeVetements = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis'>('mes-vetements');

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis') => {
    setViewMode(mode);
  };

  return (
    <Layout>
      <Helmet>
        <title>Liste des vêtements | Garde-Robe</title>
        <meta name="description" content="Consultez tous vos vêtements et gérez votre collection" />
      </Helmet>

      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode={viewMode}
      />

      <div className="container mx-auto px-4 py-8">
        <ViewModeSelector 
          viewMode={viewMode} 
          onViewModeChange={handleViewModeChange} 
        />
        
        <VetementsContainer 
          defaultTab={viewMode}
        />
      </div>
    </Layout>
  );
};

export default ListeVetements;
