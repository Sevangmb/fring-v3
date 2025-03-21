
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Heading variant="h1" className="mb-6 text-center">
          Bienvenue sur Multi-User App
        </Heading>
        <Text className="text-center mb-8">
          Ceci est un modèle de démarrage pour créer des applications multi-utilisateurs avec React, Atomic Design et des composants UI modernes.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {user ? (
            <>
              <Button asChild>
                <Link to="/dashboard">Tableau de bord</Link>
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
