
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import VetementsPageContent from "@/components/templates/VetementsPageContent";

const MesVetements: React.FC = () => {
  const { initialized } = useAppInitialization();
  const location = useLocation();
  const initialTab = location.state?.activeTab || "mes-vetements";

  return (
    <Layout>
      {initialized && (
        <div className="container mx-auto px-4">
          <VetementsPageContent initialTab={initialTab} />
        </div>
      )}
    </Layout>
  );
};

export default MesVetements;
