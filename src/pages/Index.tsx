
import React from "react";
import Layout from "@/components/templates/Layout";
import Hero from "@/components/organisms/Hero";
import MesVetements from "@/components/organisms/MesVetements";
import Footer from "@/components/organisms/Footer";
import { useAuth } from "@/contexts/AuthContext";

const IndexPage = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <Hero />
      <MesVetements isAuthenticated={!!user} />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
