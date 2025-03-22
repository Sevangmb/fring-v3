
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, UserPlus } from "lucide-react";

const MiesPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Mies | Page</title>
        <meta name="description" content="Page Mies" />
      </Helmet>
      
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Mies</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Bienvenue sur la page Mies
          </Text>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button asChild variant="default">
              <Link to="/messages">
                <Mail className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/mes-amis">
                <UserPlus className="mr-2 h-4 w-4" />
                Mes Amis
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-8 border text-center">
          <Text>Contenu de la page Mies</Text>
        </div>
      </div>
    </Layout>
  );
};

export default MiesPage;
