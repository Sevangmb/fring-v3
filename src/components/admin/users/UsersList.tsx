
import React from 'react';
import { AdminUserData } from '@/services/adminService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UsersListProps {
  users: AdminUserData[];
  isLoading: boolean;
}

const UsersList: React.FC<UsersListProps> = ({ users, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p>Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date d'inscription</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.user_metadata?.full_name || 'Utilisateur'}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {formatDistance(new Date(user.created_at), new Date(), {
                  addSuffix: true,
                  locale: fr
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
