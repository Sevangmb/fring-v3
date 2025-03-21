
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CouleurFieldProps {
  form: UseFormReturn<VetementFormValues>;
  loading: boolean;
}

// Couleurs prédéfinies standards
const COULEURS_PREDEFINIES = [
  "blanc", "noir", "gris", "bleu", "rouge", "vert", 
  "jaune", "orange", "violet", "rose", "marron", "beige", 
  "turquoise", "multicolore"
];

const CouleurField: React.FC<CouleurFieldProps> = ({ form, loading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nouvelleCouleur, setNouvelleCouleur] = useState("");
  const [couleurs, setCouleurs] = useState<string[]>(COULEURS_PREDEFINIES);
  
  // Récupérer la valeur actuelle pour l'afficher dans le label si elle existe
  const couleurValue = form.watch('couleur');
  const hasDetectedValue = !!couleurValue && !loading;
  
  // Effet pour ajouter automatiquement une couleur détectée si elle n'est pas dans la liste
  useEffect(() => {
    if (couleurValue && !couleurs.includes(couleurValue) && !loading) {
      setCouleurs(prev => [...prev, couleurValue]);
    }
  }, [couleurValue, couleurs, loading]);
  
  const handleAddCouleur = () => {
    if (nouvelleCouleur.trim() !== "") {
      const couleurNormalisee = nouvelleCouleur.trim().toLowerCase();
      
      // Vérifier si la couleur existe déjà
      if (!couleurs.includes(couleurNormalisee)) {
        setCouleurs(prev => [...prev, couleurNormalisee]);
      }
      
      // Définir la nouvelle couleur dans le formulaire
      form.setValue('couleur', couleurNormalisee);
      
      // Fermer le dialogue
      setNouvelleCouleur("");
      setIsDialogOpen(false);
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === "ajouter_nouvelle") {
      setIsDialogOpen(true);
    } else {
      form.setValue('couleur', value);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="couleur"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Couleur*
              {hasDetectedValue && (
                <span className="ml-2 text-primary font-normal">
                  (Détectée)
                </span>
              )}
            </FormLabel>
            <Select 
              onValueChange={handleSelectChange} 
              defaultValue={field.value}
              value={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Détection en cours..." : "Sélectionner une couleur"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center p-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    <span>Détection en cours...</span>
                  </div>
                ) : (
                  <>
                    {couleurs.map((couleur) => (
                      <SelectItem key={couleur} value={couleur}>
                        {couleur.charAt(0).toUpperCase() + couleur.slice(1)}
                      </SelectItem>
                    ))}
                    <SelectItem value="ajouter_nouvelle" className="text-primary">
                      <div className="flex items-center gap-2">
                        <Plus size={16} />
                        <span>Ajouter une autre couleur</span>
                      </div>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dialogue pour ajouter une nouvelle couleur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle couleur</DialogTitle>
          </DialogHeader>
          <div className="mt-4 mb-4">
            <Input
              value={nouvelleCouleur}
              onChange={(e) => setNouvelleCouleur(e.target.value)}
              placeholder="Nom de la couleur"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleAddCouleur}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CouleurField;
