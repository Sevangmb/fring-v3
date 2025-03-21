
import React from "react";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";

const ListeVetementsPage = () => {
  const { user, loading: authLoading } = useAuth();

  return (
    <Layout>
      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
      />
      
      <div className="container mx-auto px-4 py-8">
        {!authLoading && <VetementsContainer />}
      </div>
    </Layout>
  );
};

export default ListeVetementsPage;
