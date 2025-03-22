
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";

const VetementsAmis = () => {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Vêtements des Amis | Garde-Robe</title>
        <meta name="description" content="Consultez les vêtements de vos amis" />
      </Helmet>

      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-8">
          <VetementsContainer defaultTab="vetements-amis" />
        </div>
      )}
    </Layout>
  );
};

export default VetementsAmis;
