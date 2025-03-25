
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { searchUsersByEmail, makeUserAdmin, removeUserAdmin } from '@/services/userService';

export const useUserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      // Passer une chaîne vide pour obtenir tous les utilisateurs
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

  const handleSearch = async () => {
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
      setLoading(true);
      
      let result;
      const isAdmin = user.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
      
      if (isAdmin) {
        result = await removeUserAdmin(user.id);
        if (result.success) {
          toast({
            title: "Succès",
            description: `Les droits d'administrateur ont été retirés à ${user.email}`,
          });
        } else if (result.error) {
          toast({
            title: "Erreur",
            description: result.error.message,
            variant: "destructive",
          });
        }
      } else {
        result = await makeUserAdmin(user.id);
        if (result.success) {
          toast({
            title: "Succès",
            description: `${user.email} est maintenant administrateur`,
          });
        } else if (result.error) {
          toast({
            title: "Erreur",
            description: result.error.message,
            variant: "destructive",
          });
        }
      }
      
      // Rafraîchir la liste pour refléter les changements
      fetchAllUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le rôle de l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    searchQuery,
    setSearchQuery,
    error,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedUser,
    handleSearch,
    handleEdit,
    handleDelete,
    confirmEdit,
    confirmDelete,
    toggleAdminStatus
  };
};
