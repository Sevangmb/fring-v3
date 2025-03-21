
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/organisms/Hero";
import Features from "@/components/organisms/Features";

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => navigate("/dashboard");
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Layout>
      <Hero />
      <Features />
      
      <div className="container mx-auto px-4 py-12">
        <Heading variant="h2" className="mb-6 text-center">
          Bienvenue sur Multi-User App
        </Heading>
        <Text className="text-center mb-8">
          Ceci est un modèle de démarrage pour créer des applications multi-utilisateurs avec React, Atomic Design et Supabase.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {loading ? (
            <Text>Chargement...</Text>
          ) : user ? (
            <>
              <Button onClick={handleNavigateToDashboard}>
                Tableau de bord
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin}>
                Connexion
              </Button>
              <Button variant="outline" onClick={handleRegister}>
                S'inscrire
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
