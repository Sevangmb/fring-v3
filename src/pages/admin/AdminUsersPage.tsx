
import React, { useEffect, useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { isAdmin } from '@/utils/adminUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UsersSearch from '@/components/admin/users/UsersSearch';
import UsersList from '@/components/admin/users/UsersList';
import { getAllUsers, searchUsersByEmail, AdminUserData } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Vérification des autorisations administratives
  const isAuthorized = isAdmin(user);
  
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, toast]);

  const handleSearch = async (searchTerm: string) => {
    try {
      setIsSearching(true);
      // Si le terme de recherche est vide, récupérer tous les utilisateurs
      if (!searchTerm.trim()) {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } else {
        const results = await searchUsersByEmail(searchTerm);
        setUsers(results);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Gestion des utilisateurs" 
      description="Gérez les comptes utilisateurs, les rôles et les permissions."
    >
      <div className="space-y-6">
        <UsersSearch onSearch={handleSearch} isSearching={isSearching} />
        <UsersList users={users} isLoading={isLoading} />
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminUsersPage;
