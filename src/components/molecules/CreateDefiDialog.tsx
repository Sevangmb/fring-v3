
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DefiForm from "./DefiForm";

interface CreateDefiDialogProps {
  onDefiCreated?: () => void;
}

const CreateDefiDialog: React.FC<CreateDefiDialogProps> = ({ onDefiCreated }) => {
  const [open, setOpen] = React.useState(false);

  const handleDefiCreated = () => {
    setOpen(false);
    if (onDefiCreated) {
      onDefiCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un défi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau défi</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour créer un nouveau défi pour la communauté.
          </DialogDescription>
        </DialogHeader>
        
        <DefiForm 
          onClose={() => setOpen(false)} 
          onSuccess={handleDefiCreated}
        />
        
      </DialogContent>
    </Dialog>
  );
};

export default CreateDefiDialog;
