
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Edit, Trash2 } from 'lucide-react';

interface AdminUserActionsProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onToggleAdmin: (user: any) => void;
}

const AdminUserActions = ({ 
  user, 
  onEdit, 
  onDelete, 
  onToggleAdmin 
}: AdminUserActionsProps) => {
  
  const isAdmin = user.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onToggleAdmin(user)}
        title={isAdmin ? "Révoquer les droits d'administrateur" : "Promouvoir administrateur"}
      >
        <Shield className={`h-4 w-4 ${isAdmin ? 'text-primary' : 'text-muted-foreground'}`} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEdit(user)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDelete(user)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default AdminUserActions;
