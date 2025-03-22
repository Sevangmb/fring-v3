
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DefiForm from "./DefiForm";

const CreateDefiDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un défi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau défi</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour créer un nouveau défi pour la communauté.
          </DialogDescription>
        </DialogHeader>
        
        <DefiForm onClose={() => setOpen(false)} />
        
      </DialogContent>
    </Dialog>
  );
};

export default CreateDefiDialog;
