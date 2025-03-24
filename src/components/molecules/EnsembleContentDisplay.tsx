
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Triangle } from "lucide-react";

interface EnsembleContentDisplayProps {
  ensemble: any;
  loading: boolean;
  error: string;
  vetementsByType: Record<string, any[]>;
}

const EnsembleContentDisplay: React.FC<EnsembleContentDisplayProps> = ({
  ensemble,
  loading,
  error,
  vetementsByType
}) => {
  // Rendu pendant le chargement
  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-32 w-full rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-24 rounded-md" />
          <Skeleton className="h-24 rounded-md" />
        </div>
      </div>
    );
  }

  // Rendu en cas d'erreur
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <Triangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Rendu si l'ensemble n'est pas disponible
  if (!ensemble) {
    return (
      <Alert className="my-4">
        <AlertTitle>Aucun ensemble disponible</AlertTitle>
        <AlertDescription>
          L'ensemble n'a pas pu être chargé ou n'existe pas.
        </AlertDescription>
      </Alert>
    );
  }

  // Calcul du nombre total de vêtements
  const totalVetements = Object.values(vetementsByType).reduce(
    (total, items) => total + items.length,
    0
  );

  return (
    <div className="space-y-4 my-4">
      <div className="text-center">
        <h3 className="font-semibold">{ensemble.nom || "Ensemble sans nom"}</h3>
        {ensemble.description && (
          <p className="text-sm text-muted-foreground">{ensemble.description}</p>
        )}
      </div>

      <ScrollArea className="h-64 rounded-md border p-4">
        {totalVetements > 0 ? (
          <div className="space-y-4">
            {Object.entries(vetementsByType).map(
              ([type, vetements]) =>
                vetements.length > 0 && (
                  <div key={type} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize">{type}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {vetements.map((vetement) => (
                        <div
                          key={vetement.id}
                          className="rounded-md border p-2 text-xs"
                        >
                          <div className="font-medium">{vetement.nom}</div>
                          <div className="text-muted-foreground">
                            {vetement.marque}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-muted-foreground">
            Aucun vêtement dans cet ensemble
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EnsembleContentDisplay;
