
import React from "react";
import { Ami } from "@/services/amis/types";
import AmisList from "@/components/templates/AmisList";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import { useLocation } from "react-router-dom";

interface AmisPageContentProps {
  loadingAmis: boolean;
  demandesRecues: Ami[];
  demandesEnvoyees: Ami[];
  amisAcceptes: Ami[];
  onAccepterDemande: (id: number) => Promise<void>;
  onRejeterDemande: (id: number) => Promise<void>;
  onAmiAdded: () => Promise<void>;
}

const AmisPageContent: React.FC<AmisPageContentProps> = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Afficher le contenu des vêtements des amis si l'utilisateur est sur cette page
  if (currentPath.includes("/vetements-amis")) {
    return <VetementsContainer defaultTab="vetements-amis" />;
  }

  return <AmisList {...props} />;
};

export default AmisPageContent;
