import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";
import { Loader2 } from "lucide-react";
import { Vetement } from "@/services/vetement/types";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import { SelectedItems } from "@/hooks/ensembles/useEnsembleSubmission";

interface EnsembleFormProps {
  vetements: Vetement[];
  selectedItems: SelectedItems;
  onItemsSelected: (items: SelectedItems) => void;
  creating: boolean;
  onSubmit: () => void;
}

const EnsembleForm: React.FC<EnsembleFormProps> = ({
  vetements,
  selectedItems,
  onItemsSelected,
  creating,
  onSubmit
}) => {
  return (
    <Card className="shadow-lg border-primary/10 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 border-b">
        <Heading className="text-lg text-center">Créez votre ensemble</Heading>
      </div>
      <CardContent className="p-6">
        <Text className="text-center text-muted-foreground mb-6 text-sm">
          Sélectionnez un vêtement pour chaque catégorie, vous pouvez choisir parmi vos vêtements ou ceux de vos amis.
        </Text>
        
        <EnsembleCreator 
          vetements={vetements} 
          onItemsSelected={onItemsSelected} 
          selectedItems={selectedItems}
          showOwner={true}
        />
        
        <div className="flex justify-center mt-8 pt-4 border-t">
          <Button 
            size="lg" 
            className="gap-2 px-6 min-w-40" 
            onClick={onSubmit} 
            disabled={creating || !selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures}
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : "Créer cet ensemble"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnsembleForm;
