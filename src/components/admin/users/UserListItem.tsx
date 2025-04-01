
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

interface UserListItemProps {
  user: AdminUserData;
  userStats: Record<string, { vetements: number; ensembles: number }>;
  onDelete: (user: AdminUserData) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, userStats, onDelete }) => {
  const isAdmin = user.email.includes('admin@') || 
                  user.email.includes('sevans@') || 
                  user.email.includes('pedro@');

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
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Voir le profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              <span>Vêtements</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Ensembles</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Détails</span>
            </DropdownMenuItem>
            {/* Ne pas afficher l'option de suppression pour les admins */}
            {!isAdmin && (
              <DropdownMenuItem 
                className="flex items-center gap-2 text-destructive focus:text-destructive"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-4 w-4" />
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
