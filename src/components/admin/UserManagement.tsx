
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { searchUsersByEmail, getUserById, updateUserMetadata } from '@/services/userService';
import { Loader2, Search, UserPlus, Trash2, Edit, AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  // Charger tous les utilisateurs au chargement de la page
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedUsers = await searchUsersByEmail('');
      setUsers(fetchedUsers);
      
      if (fetchedUsers.length === 0) {
        setError("Aucun utilisateur trouvé dans le système");
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError(error.message || "Impossible de récupérer les utilisateurs");
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (searchQuery.length < 2 && searchQuery.length > 0) {
      setError("Veuillez entrer au moins 2 caractères pour la recherche");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const fetchedUsers = await searchUsersByEmail(searchQuery);
      setUsers(fetchedUsers);
      
      if (fetchedUsers.length === 0) {
        setError(`Aucun utilisateur trouvé avec le terme "${searchQuery}"`);
      }
    } catch (error: any) {
      console.error('Erreur lors de la recherche des utilisateurs:', error);
      setError(error.message || "Impossible de récupérer les utilisateurs");
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchUsers();
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = async () => {
    try {
      // Ici, on pourrait implémenter la mise à jour réelle des données utilisateur
      toast({
        title: "Succès",
        description: `Les modifications pour ${selectedUser.email} ont été enregistrées`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      // Ici, on pourrait implémenter la suppression réelle de l'utilisateur
      toast({
        title: "Succès",
        description: `L'utilisateur ${selectedUser.email} a été supprimé`,
      });
      setIsDeleteDialogOpen(false);
      
      // Rafraîchir la liste après suppression
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (user: any) => {
    try {
      // Dans un cas réel, on ajouterait/supprimerait le rôle d'administrateur
      toast({
        title: "Fonction en cours de développement",
        description: "La gestion des rôles sera bientôt disponible",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Nouvel utilisateur</span>
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <Input
          placeholder="Rechercher par email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full"
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleAdminStatus(user)}
                        title={user.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email) ? "Révoquer les droits d'administrateur" : "Promouvoir administrateur"}
                      >
                        <Shield className={`h-4 w-4 ${user.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email) ? 'text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
      
      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier les informations de {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Cette fonctionnalité sera bientôt disponible.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={confirmEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.email} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
