
import React from 'react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from '@/components/ui/context-menu';
import { AdminUserData } from '@/services/adminService';
import { User, Shirt, ShoppingBag, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserContextMenuProps {
  user: AdminUserData;
  children: React.ReactNode;
  onDelete?: (user: AdminUserData) => void;
}

const UserContextMenu: React.FC<UserContextMenuProps> = ({ user, children, onDelete }) => {
  const { toast } = useToast();
  const isAdmin = user.email.includes('admin@') || 
                  user.email.includes('sevans@') || 
                  user.email.includes('pedro@');

  const handleViewProfile = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir le profil de ${user.email}`,
    });
  };

  const handleViewClothes = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les vêtements de ${user.email}`,
    });
  };

  const handleViewEnsembles = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les ensembles de ${user.email}`,
    });
  };

  const handleViewDetails = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les détails de ${user.email}`,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(user);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={handleViewProfile} className="flex items-center gap-2 cursor-pointer">
          <User className="h-4 w-4 text-blue-500" />
          <span>Voir le profil</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={handleViewClothes} className="flex items-center gap-2 cursor-pointer">
          <Shirt className="h-4 w-4 text-emerald-500" />
          <span>Vêtements</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={handleViewEnsembles} className="flex items-center gap-2 cursor-pointer">
          <ShoppingBag className="h-4 w-4 text-purple-500" />
          <span>Ensembles</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={handleViewDetails} className="flex items-center gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-cyan-500" />
          <span>Détails</span>
        </ContextMenuItem>
        
        {!isAdmin && onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={handleDelete} 
              className="flex items-center gap-2 text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span>Supprimer</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default UserContextMenu;
