
import React from "react";
import { VetementType } from "@/services/meteo/tenue";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import { Skeleton } from "@/components/ui/skeleton";

interface EnsembleContentDisplayProps {
  ensemble: any | null;
  loading: boolean;
  error: string | null;
  vetementsByType: Record<string, any[]>;
}

const EnsembleContentDisplay: React.FC<EnsembleContentDisplayProps> = ({
  ensemble,
  loading,
  error,
  vetementsByType
}) => {
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="grid grid-cols-3 gap-2 w-full max-w-md">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center my-4 text-destructive">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!ensemble) {
    return (
      <div className="text-center my-4">
        <p className="text-muted-foreground">Aucune information d'ensemble disponible</p>
      </div>
    );
  }
  
  return (
    <div className="text-center mb-3">
      <h3 className="text-lg font-medium mb-2">{ensemble.nom || "Ensemble sans nom"}</h3>
      
      <div className="flex justify-center items-center mb-3 p-2 bg-background/50 border border-input rounded-md min-h-[150px]">
        <EnsembleImages 
          vetementsByType={vetementsByType} 
          className="w-full max-w-md mx-auto"
        />
      </div>
      
      {ensemble.description && (
        <p className="text-sm text-muted-foreground mb-4">{ensemble.description}</p>
      )}
    </div>
  );
};

export default EnsembleContentDisplay;
