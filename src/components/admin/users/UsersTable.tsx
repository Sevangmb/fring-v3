
import React from 'react';
import { AdminUserData } from '@/services/adminService';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import UserListItem from './UserListItem';

interface UsersTableProps {
  users: AdminUserData[];
  userStats: Record<string, { vetements: number; ensembles: number }>;
  onDeleteUser: (user: AdminUserData) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, userStats, onDeleteUser }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Vêtements</TableHead>
            <TableHead>Ensembles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserListItem 
              key={user.id}
              user={user}
              userStats={userStats}
              onDelete={onDeleteUser}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
