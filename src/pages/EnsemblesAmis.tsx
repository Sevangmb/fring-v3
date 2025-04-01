
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import EnsemblesAmisList from "@/components/ensembles/EnsemblesAmisList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Ensembles de vos amis</CardTitle>
            </CardHeader>
            <CardContent>
              <EnsemblesAmisList />
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default EnsemblesAmis;
