
import React, { useState } from 'react';
import { AdminUserData, getUserStats } from '@/services/adminService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
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
  Shirt,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface UsersListProps {
  users: AdminUserData[];
  isLoading: boolean;
  onDeleteUser: (userId: string) => Promise<void>;
}

const UsersList: React.FC<UsersListProps> = ({ users, isLoading, onDeleteUser }) => {
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<Record<string, { vetements: number; ensembles: number }>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUserData | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  // Charger les statistiques pour un utilisateur
  const loadUserStats = async (userId: string) => {
    if (userStats[userId]) return;
    
    try {
      const stats = await getUserStats(userId);
      setUserStats(prev => ({
        ...prev,
        [userId]: stats
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeletingUser(true);
    try {
      await onDeleteUser(userToDelete.id);
      setDialogOpen(false);
      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur ${userToDelete.email} a été supprimé avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setDeletingUser(false);
      setUserToDelete(null);
    }
  };

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

  const confirmDeleteUser = (user: AdminUserData) => {
    setUserToDelete(user);
    setDialogOpen(true);
  };

  return (
    <>
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
              <TableRow 
                key={user.id}
                onMouseEnter={() => loadUserStats(user.id)}
              >
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
                      {user.email.includes('admin@') || user.email.includes('sevans@') || user.email.includes('pedro@') ? (
                        <Badge variant="secondary" className="ml-2">Admin</Badge>
                      ) : null}
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
                      {!(user.email.includes('admin@') || user.email.includes('sevans@') || user.email.includes('pedro@')) && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                          onClick={() => confirmDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              onClick={() => setDialogOpen(false)}
              disabled={deletingUser}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={deletingUser}
            >
              {deletingUser ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersList;
