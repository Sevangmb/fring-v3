
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';
import AdminUserSearch from '@/components/molecules/AdminUserSearch';
import AdminUsersTable from '@/components/organisms/AdminUsersTable';
import EditUserDialog from '@/components/molecules/EditUserDialog';
import DeleteUserDialog from '@/components/molecules/DeleteUserDialog';
import { useUserManagement } from '@/hooks/useUserManagement';

const UserManagement = () => {
  const {
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
  } = useUserManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
        <Button size="sm" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Nouvel utilisateur</span>
        </Button>
      </div>

      <AdminUserSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AdminUsersTable
        users={users}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAdmin={toggleAdminStatus}
      />
      
      <EditUserDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedUser={selectedUser}
        onConfirm={confirmEdit}
      />
      
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserManagement;
