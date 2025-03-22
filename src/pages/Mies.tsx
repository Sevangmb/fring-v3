
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import { Text } from "@/components/atoms/Typography";

const MiesPage = () => {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Mies | Demandes d'amis en attente</title>
        <meta name="description" content="Gérez vos demandes d'amis en attente" />
      </Helmet>
      
      <AmisPageHeader user={user} loading={loading} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-8 border text-center">
          <Text>Contenu de la page Mies - Affichage des demandes d'amis en attente</Text>
        </div>
      </div>
    </Layout>
  );
};

export default MiesPage;
