
import React from "react";
import PageLayout from "@/components/templates/PageLayout";
import { Loader2 } from "lucide-react";

const DefiPageLoading: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement du défi...</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default DefiPageLoading;
