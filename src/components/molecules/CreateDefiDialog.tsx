import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DefiForm from "./DefiForm";
interface CreateDefiDialogProps {
  onDefiCreated?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
const CreateDefiDialog: React.FC<CreateDefiDialogProps> = ({
  onDefiCreated,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange : setInternalOpen;
  const handleDefiCreated = () => {
    setIsOpen(false);
    if (onDefiCreated) {
      onDefiCreated();
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau défi</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour créer un nouveau défi pour la communauté.
          </DialogDescription>
        </DialogHeader>
        
        <DefiForm onClose={() => setIsOpen(false)} onSuccess={handleDefiCreated} />
        
      </DialogContent>
    </Dialog>;
};
export default CreateDefiDialog;