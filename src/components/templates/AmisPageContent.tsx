
import React from "react";
import { Ami } from "@/services/amis/types";
import AmisList from "@/components/templates/AmisList";

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
  return <AmisList {...props} />;
};

export default AmisPageContent;
