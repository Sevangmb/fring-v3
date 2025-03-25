
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import DefiCard from "@/components/molecules/DefiCard";
import CreateDefiDialog from "@/components/molecules/CreateDefiDialog";
import { fetchDefis } from "@/services/defi";

interface DefisTabContentProps {
  isLoading?: boolean;
}

const DefisTabContent: React.FC<DefisTabContentProps> = ({
  isLoading: externalLoading
}) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleDefiCreated = () => {
    // Placeholder function
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Défis de la communauté</h2>
          <Text className="text-muted-foreground">
            Participez aux défis de la communauté et montrez votre style
          </Text>
        </div>
        
        <div className="flex gap-2">
          <CreateDefiDialog
            open={openCreateDialog}
            onOpenChange={setOpenCreateDialog}
            onDefiCreated={handleDefiCreated}
          />
        </div>
      </div>

      <div className="text-center p-8">
        <Text className="text-muted-foreground italic">
          Cette fonctionnalité a été temporairement désactivée.
        </Text>
      </div>
    </div>
  );
};

export default DefisTabContent;
