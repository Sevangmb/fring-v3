
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/organisms/Hero";
import MesVetements from "@/components/organisms/MesVetements";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => navigate("/dashboard");
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <Layout>
      <Hero />
      <MesVetements isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-16 bg-accent/10">
        <div className="max-w-3xl mx-auto text-center">
          <Heading variant="h2" className="mb-6">
            Commencez dès aujourd'hui
          </Heading>
          <Text className="mb-8 text-lg">
            Une application complète avec authentification, tableau de bord et profil utilisateur.
            Construite avec React, Atomic Design et Supabase.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {loading ? (
              <div className="animate-pulse p-4">Chargement...</div>
            ) : user ? (
              <>
                <Button onClick={handleNavigateToDashboard} size="lg">
                  Mon tableau de bord
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleLogin} size="lg">
                  Connexion
                </Button>
                <Button variant="outline" onClick={handleRegister} size="lg">
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
