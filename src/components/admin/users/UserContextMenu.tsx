
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import UserProfileDialog from './UserProfileDialog';

interface UserContextMenuProps {
  user: AdminUserData;
  children: React.ReactNode;
  onDelete?: (user: AdminUserData) => void;
}

const UserContextMenu: React.FC<UserContextMenuProps> = ({ user, children, onDelete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user.email.includes('admin@') || 
                  user.email.includes('sevans@') || 
                  user.email.includes('pedro@');
  
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleViewProfile = () => {
    setProfileDialogOpen(true);
  };

  const handleViewClothes = () => {
    toast({
      title: "Navigation vers vêtements",
      description: `Vêtements de ${user.email}`,
    });
    // Dans un cas réel
    // navigate(`/admin/users/${user.id}/vetements`);
  };

  const handleViewEnsembles = () => {
    toast({
      title: "Navigation vers ensembles",
      description: `Ensembles de ${user.email}`,
    });
    // Dans un cas réel
    // navigate(`/admin/users/${user.id}/ensembles`);
  };

  const handleViewDetails = () => {
    toast({
      title: "Navigation vers détails",
      description: `Détails de ${user.email}`,
    });
    // Dans un cas réel
    // navigate(`/admin/users/${user.id}/details`);
  };

  const handleDelete = () => {
    if (onDelete) {
      toast({
        title: "Suppression d'utilisateur",
        description: `Demande de suppression de ${user.email}`,
      });
      onDelete(user);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem 
            onClick={handleViewProfile} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4 text-blue-500" />
            <span>Voir le profil</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={handleViewClothes} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <Shirt className="h-4 w-4 text-emerald-500" />
            <span>Vêtements</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={handleViewEnsembles} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-purple-500" />
            <span>Ensembles</span>
          </ContextMenuItem>
          
          <ContextMenuItem 
            onClick={handleViewDetails} 
            className="flex items-center gap-2 cursor-pointer"
          >
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
      
      <UserProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen} 
        user={user} 
      />
    </>
  );
};

export default UserContextMenu;
