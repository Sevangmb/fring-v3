
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CreateDefiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDefiCreated?: () => void;
}

const CreateDefiDialog: React.FC<CreateDefiDialogProps> = ({
  open,
  onOpenChange,
  onDefiCreated
}) => {
  return (
    <Button 
      onClick={() => onOpenChange(true)}
      className="flex items-center gap-1"
      variant="outline"
    >
      <PlusCircle className="h-4 w-4" />
      <span>Nouveau</span>
    </Button>
  );
};

export default CreateDefiDialog;
