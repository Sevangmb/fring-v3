
import React from "react";
import { Loader2 } from "lucide-react";

const EnsembleLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <span className="text-muted-foreground">Chargement de vos vêtements...</span>
    </div>
  );
};

export default EnsembleLoading;
