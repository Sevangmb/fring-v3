
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
import { searchUsersByEmail } from '@/services/userService';
import { Loader2, Search, UserPlus, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (searchQuery.length < 2) {
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

  const handleEdit = (userId: string) => {
    toast({
      title: "Fonction en cours de développement",
      description: `La modification de l'utilisateur ${userId} sera bientôt disponible`,
    });
  };

  const handleDelete = (userId: string) => {
    toast({
      title: "Fonction en cours de développement",
      description: `La suppression de l'utilisateur ${userId} sera bientôt disponible`,
      variant: "destructive",
    });
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
          disabled={loading || searchQuery.length < 2}
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {loading ? (
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    error ? null : "Recherchez des utilisateurs par email"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
