
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DefiForm from "./DefiForm";

interface CreateDefiDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDefiCreated?: () => void;
}

const CreateDefiDialog: React.FC<CreateDefiDialogProps> = ({
  open,
  onOpenChange,
  onDefiCreated
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(open || false);
  
  const handleOpenChange = (value: boolean) => {
    setIsDialogOpen(value);
    if (onOpenChange) {
      onOpenChange(value);
    }
  };
  
  const handleDefiCreated = () => {
    handleOpenChange(false);
    if (onDefiCreated) {
      onDefiCreated();
    }
  };
  
  return (
    <Dialog open={open !== undefined ? open : isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Créer un défi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau défi</DialogTitle>
          <DialogDescription>
            Créez un défi pour la communauté et invitez les utilisateurs à y participer avec leurs ensembles.
          </DialogDescription>
        </DialogHeader>
        
        <DefiForm
          onClose={() => handleOpenChange(false)}
          onSuccess={handleDefiCreated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDefiDialog;
