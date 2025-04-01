import React, { useEffect, useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { isAdmin } from '@/utils/adminUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UsersSearch from '@/components/admin/users/UsersSearch';
import UsersList from '@/components/admin/users/UsersList';
import { getAllUsers, searchUsersByEmail, AdminUserData, deleteUser } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Vérification des autorisations administratives
  const isAuthorized = isAdmin(user);
  
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('tous');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getAllUsers();
        console.log("Utilisateurs récupérés:", usersData);
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

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      const success = await deleteUser(userId);
      if (success) {
        // Filtrer l'utilisateur supprimé de la liste locale
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } else {
        throw new Error("Échec de la suppression");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Filtrer les utilisateurs en fonction de l'onglet actif
  const filteredUsers = users.filter(user => {
    const isAdminUser = user.email.includes('admin@') || 
                        user.email.includes('sevans@') || 
                        user.email.includes('pedro@');
    
    if (activeTab === 'admins') return isAdminUser;
    if (activeTab === 'utilisateurs') return !isAdminUser;
    return true; // Pour l'onglet 'tous'
  });

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
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="tous">Tous les utilisateurs</TabsTrigger>
              <TabsTrigger value="admins">Administrateurs</TabsTrigger>
              <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
            </TabsList>
          </div>
          
          <UsersSearch 
            onSearch={handleSearch} 
            isSearching={isSearching} 
          />
          
          <TabsContent value="tous" className="mt-0">
            <UsersList 
              users={filteredUsers} 
              isLoading={isLoading} 
              onDeleteUser={handleDeleteUser} 
            />
          </TabsContent>
          
          <TabsContent value="admins" className="mt-0">
            <UsersList 
              users={filteredUsers} 
              isLoading={isLoading} 
              onDeleteUser={handleDeleteUser} 
            />
          </TabsContent>
          
          <TabsContent value="utilisateurs" className="mt-0">
            <UsersList 
              users={filteredUsers} 
              isLoading={isLoading} 
              onDeleteUser={handleDeleteUser} 
            />
          </TabsContent>
        </Tabs>
      </Card>
    </AdminModuleTemplate>
  );
};

export default AdminUsersPage;
