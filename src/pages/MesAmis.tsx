
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";

const MesAmisPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Mes Amis</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Retrouvez et gérez tous vos amis dans cette section.
          </Text>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contenu à venir */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <Text className="font-medium mb-2">Aucun ami pour le moment</Text>
            <Text variant="small" className="text-muted-foreground">
              Commencez à ajouter des amis pour les voir apparaître ici.
            </Text>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MesAmisPage;
