
import React, { useState } from "react";
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
  detectingColor: boolean;
}

const COULEURS_PREDEFINIES = [
  "blanc", "noir", "gris", "bleu", "rouge", "vert", 
  "jaune", "orange", "violet", "rose", "marron", "beige", "multicolore"
];

const CouleurField: React.FC<CouleurFieldProps> = ({ form, detectingColor }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nouvelleCouleur, setNouvelleCouleur] = useState("");
  const [couleurs, setCouleurs] = useState<string[]>(COULEURS_PREDEFINIES);
  
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
            <FormLabel>Couleur*</FormLabel>
            <Select 
              onValueChange={handleSelectChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={detectingColor ? "Détection en cours..." : "Sélectionner une couleur"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
