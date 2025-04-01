
import React from 'react';
import { AdminUserData } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: AdminUserData | null;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onOpenChange,
  userToDelete,
  isDeleting,
  onDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'utilisateur 
            <strong> {userToDelete?.email}</strong> ? 
            Cette action est irréversible et supprimera toutes ses données.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-700">
            La suppression d'un utilisateur entraînera la perte de tous ses vêtements, ensembles et préférences.
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
