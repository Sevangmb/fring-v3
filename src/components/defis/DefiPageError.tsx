
import React from "react";
import PageLayout from "@/components/templates/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DefiPageErrorProps {
  error: string | null;
  onBack: () => void;
}

const DefiPageError: React.FC<DefiPageErrorProps> = ({ error, onBack }) => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Défi non trouvé</h1>
        <p className="text-muted-foreground mb-6">{error || "Ce défi n'existe pas ou a été supprimé"}</p>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    </PageLayout>
  );
};

export default DefiPageError;
