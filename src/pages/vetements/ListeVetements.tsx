
import React from "react";
import { Helmet } from "react-helmet";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";

const ListeVetements = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Liste des vêtements | Garde-Robe</title>
        <meta name="description" content="Consultez tous vos vêtements et gérez votre collection" />
      </Helmet>

      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
      />

      <div className="container mx-auto px-4 py-8">
        <VetementsContainer />
      </div>
    </Layout>
  );
};

export default ListeVetements;
