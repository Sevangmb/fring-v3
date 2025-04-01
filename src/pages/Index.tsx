
import React from "react";
import Layout from "@/components/templates/Layout";
import Hero from "@/components/organisms/Hero";
import Footer from "@/components/organisms/Footer";
import MeteoSection from "@/components/organisms/Meteo/MeteoSection";
import MesVetements from "@/components/organisms/MesVetements";
import { useAuth } from "@/contexts/AuthContext";

const IndexPage = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <Hero />
      {user && (
        <div className="container mx-auto px-4">
          <MeteoSection />
          <MesVetements isAuthenticated={!!user} />
        </div>
      )}
      <Footer />
    </Layout>
  );
};

export default IndexPage;
