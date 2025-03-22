
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import EnsembleFormFields from "@/components/ensembles/EnsembleFormFields";
import { ModifierEnsembleFormData } from "@/hooks/ensembles/useModifierEnsemble";
import { Vetement } from "@/services/vetement/types";

interface ModifierEnsembleFormProps {
  formData: ModifierEnsembleFormData;
  onChange: (field: keyof Omit<ModifierEnsembleFormData, 'selectedItems'>, value: string) => void;
  onItemsSelected: (items: {
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }) => void;
  onSubmit: () => void;
  saving: boolean;
  vetements: Vetement[];
}

const ModifierEnsembleForm: React.FC<ModifierEnsembleFormProps> = ({
  formData,
  onChange,
  onItemsSelected,
  onSubmit,
  saving,
  vetements
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier l'ensemble</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EnsembleFormFields 
            formData={formData}
            onChange={onChange}
          />
          
          <div className="space-y-4">
            <h3 className="font-medium">Sélectionner les vêtements</h3>
            <div className="border rounded-md p-4">
              <EnsembleCreator 
                vetements={vetements}
                selectedItems={formData.selectedItems}
                onItemsSelected={onItemsSelected}
                showOwner={true}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={saving || !formData.nom || !formData.selectedItems.haut || !formData.selectedItems.bas || !formData.selectedItems.chaussures}
              className="min-w-32"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModifierEnsembleForm;
