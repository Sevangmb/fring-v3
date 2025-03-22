
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import { TabType } from "@/components/vetements/VetementsContainer";
import MesEnsemblesTab from "@/components/vetements/tabs/MesEnsemblesTab";
import { TabsContent } from "@/components/ui/tabs";

const EnsemblesAmis = () => {
  const { user, loading } = useAuth();

  return (
    <Layout>
      <Helmet>
        <title>Ensembles des Amis | Garde-Robe</title>
        <meta name="description" content="Consultez les ensembles de vêtements de vos amis" />
      </Helmet>

      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-8">
          <VetementsContainer defaultTab="mes-ensembles">
            <TabsContent value="mes-ensembles">
              <MesEnsemblesTab />
            </TabsContent>
          </VetementsContainer>
        </div>
      )}
    </Layout>
  );
};

export default EnsemblesAmis;
