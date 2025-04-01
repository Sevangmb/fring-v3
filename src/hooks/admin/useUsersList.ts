
import { useState } from 'react';
import { AdminUserData, getUserStats } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

export function useUsersList(onDeleteUser: (userId: string) => Promise<void>) {
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

  const confirmDeleteUser = (user: AdminUserData) => {
    setUserToDelete(user);
    setDialogOpen(true);
  };

  return {
    userStats,
    loadUserStats,
    dialogOpen,
    setDialogOpen,
    userToDelete,
    deletingUser,
    handleDeleteUser,
    confirmDeleteUser
  };
}
