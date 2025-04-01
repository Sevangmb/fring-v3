
import React from 'react';
import { AdminUserData } from '@/services/adminService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  User, 
  Trash2, 
  ShoppingBag, 
  FileText,
  Shirt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserListItemProps {
  user: AdminUserData;
  userStats: Record<string, { vetements: number; ensembles: number }>;
  onDelete: (user: AdminUserData) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, userStats, onDelete }) => {
  const isAdmin = user.email.includes('admin@') || 
                  user.email.includes('sevans@') || 
                  user.email.includes('pedro@');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewProfile = () => {
    // Dans un cas réel, naviguer vers le profil de l'utilisateur
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir le profil de ${user.email}`,
    });
  };

  const handleViewClothes = () => {
    // Dans un cas réel, naviguer vers les vêtements de l'utilisateur
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les vêtements de ${user.email}`,
    });
  };

  const handleViewEnsembles = () => {
    // Dans un cas réel, naviguer vers les ensembles de l'utilisateur
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les ensembles de ${user.email}`,
    });
  };

  const handleViewDetails = () => {
    // Dans un cas réel, naviguer vers les détails de l'utilisateur
    toast({
      title: "Fonctionnalité à venir",
      description: `Voir les détails de ${user.email}`,
    });
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {user.user_metadata?.avatar_url && (
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
            )}
            <AvatarFallback>
              {user.email.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{user.user_metadata?.full_name || 'Utilisateur'}</span>
            {isAdmin && (
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {formatDistance(new Date(user.created_at), new Date(), {
          addSuffix: true,
          locale: fr
        })}
      </TableCell>
      <TableCell>
        {userStats[user.id] ? (
          <div className="flex items-center">
            <Shirt className="h-4 w-4 mr-1 text-muted-foreground" />
            {userStats[user.id].vetements}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {userStats[user.id] ? (
          <div className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-1 text-muted-foreground" />
            {userStats[user.id].ensembles}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleViewProfile}
            >
              <User className="h-4 w-4 text-blue-500" />
              <span>Voir le profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleViewClothes}
            >
              <Shirt className="h-4 w-4 text-emerald-500" />
              <span>Vêtements</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleViewEnsembles}
            >
              <ShoppingBag className="h-4 w-4 text-purple-500" />
              <span>Ensembles</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleViewDetails}
            >
              <FileText className="h-4 w-4 text-cyan-500" />
              <span>Détails</span>
            </DropdownMenuItem>
            {/* Ne pas afficher l'option de suppression pour les admins */}
            {!isAdmin && (
              <DropdownMenuItem 
                className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserListItem;
