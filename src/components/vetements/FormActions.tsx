
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: React.ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  onCancel,
  submitLabel = "Ajouter le vêtement",
  cancelLabel = "Annuler",
  submitIcon = <Plus className="mr-2 h-4 w-4" />
}) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            {submitIcon}
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
