
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Shield } from 'lucide-react';
import AdminUserActions from '@/components/molecules/AdminUserActions';

interface AdminUsersTableProps {
  users: any[];
  loading: boolean;
  error: string | null;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onToggleAdmin: (user: any) => void;
}

const AdminUsersTable = ({ 
  users, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onToggleAdmin 
}: AdminUsersTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email) 
                    ? <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"><Shield className="h-3 w-3 mr-1" />Admin</span>
                    : <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Utilisateur</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <AdminUserActions 
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleAdmin={onToggleAdmin}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  error ? null : "Aucun utilisateur trouvé"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUsersTable;
