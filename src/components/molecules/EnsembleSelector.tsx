
import React from "react";
import { Ensemble } from "@/services/ensemble/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EnsembleSelectorProps {
  ensembles: Ensemble[];
  selectedEnsembleId: number | null;
  onSelectEnsemble: (id: number) => void;
}

const EnsembleSelector: React.FC<EnsembleSelectorProps> = ({
  ensembles,
  selectedEnsembleId,
  onSelectEnsemble
}) => {
  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <RadioGroup
        value={selectedEnsembleId?.toString() || ""}
        onValueChange={(value) => onSelectEnsemble(parseInt(value))}
        className="space-y-4"
      >
        {ensembles.map((ensemble) => {
          // Extraire les vêtements par type (si disponible)
          const haut = ensemble.vetements?.find((v: any) => 
            v.vetement?.categorie_id === 1 || 
            v.vetement?.categorie_id === 4
          );
          
          const bas = ensemble.vetements?.find((v: any) => 
            v.vetement?.categorie_id === 2 || 
            v.vetement?.categorie_id === 5
          );
          
          const chaussures = ensemble.vetements?.find((v: any) => 
            v.vetement?.categorie_id === 3
          );
          
          return (
            <div
              key={ensemble.id}
              className={`relative flex items-start border rounded-md p-4 transition-all ${
                selectedEnsembleId === ensemble.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/30"
              }`}
            >
              <RadioGroupItem
                value={ensemble.id.toString()}
                id={`ensemble-${ensemble.id}`}
                className="absolute top-4 left-4"
              />
              <div className="ml-8 w-full">
                <Label
                  htmlFor={`ensemble-${ensemble.id}`}
                  className="text-base font-medium cursor-pointer"
                >
                  {ensemble.nom}
                </Label>
                
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {/* Aperçu des vêtements */}
                  {haut && haut.vetement?.image_url && (
                    <div className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={haut.vetement.image_url}
                        alt={haut.vetement.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {bas && bas.vetement?.image_url && (
                    <div className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={bas.vetement.image_url}
                        alt={bas.vetement.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {chaussures && chaussures.vetement?.image_url && (
                    <div className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={chaussures.vetement.image_url}
                        alt={chaussures.vetement.nom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {ensemble.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {ensemble.description}
                  </p>
                )}
                
                <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-2">
                  {ensemble.occasion && (
                    <span className="bg-secondary/30 px-2 py-1 rounded-full">
                      {ensemble.occasion}
                    </span>
                  )}
                  {ensemble.saison && (
                    <span className="bg-secondary/30 px-2 py-1 rounded-full">
                      {ensemble.saison}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </ScrollArea>
  );
};

export default EnsembleSelector;
