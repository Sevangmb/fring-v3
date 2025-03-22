
import React from "react";
import { Helmet } from "react-helmet";
import Layout from "@/components/templates/Layout";
import { Card } from "@/components/ui/card";
import MesFavorisTab from "@/components/vetements/tabs/MesFavorisTab";
import { Heading, Text } from "@/components/atoms/Typography";
import { Heart } from "lucide-react";

const MesFavoris: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Mes Favoris | Garde-Robe</title>
        <meta name="description" content="Consultez vos éléments favoris" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-full bg-primary/10">
            <Heart className="text-primary h-6 w-6" />
          </div>
          <div>
            <Heading as="h1" className="text-3xl font-bold">
              Mes Favoris
            </Heading>
            <Text className="text-muted-foreground">
              Retrouvez tous vos vêtements, ensembles et utilisateurs favoris
            </Text>
          </div>
        </div>

        <Card className="p-0 border-none shadow-none">
          <MesFavorisTab />
        </Card>
      </div>
    </Layout>
  );
};

export default MesFavoris;
