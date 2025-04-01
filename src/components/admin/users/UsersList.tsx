
import React from 'react';
import { AdminUserData } from '@/services/adminService';
import { useUsersList } from '@/hooks/admin/useUsersList';
import UsersTable from './UsersTable';
import DeleteUserDialog from './DeleteUserDialog';
import { LoadingState, EmptyState } from './LoadingAndEmptyStates';

interface UsersListProps {
  users: AdminUserData[];
  isLoading: boolean;
  onDeleteUser: (userId: string) => Promise<void>;
}

const UsersList: React.FC<UsersListProps> = ({ users, isLoading, onDeleteUser }) => {
  const {
    userStats,
    loadUserStats,
    dialogOpen,
    setDialogOpen,
    userToDelete,
    deletingUser,
    handleDeleteUser,
    confirmDeleteUser
  } = useUsersList(onDeleteUser);

  // Handle loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle empty state
  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div onMouseEnter={() => users.forEach(user => loadUserStats(user.id))}>
        <UsersTable 
          users={users}
          userStats={userStats}
          onDeleteUser={confirmDeleteUser}
        />
      </div>

      <DeleteUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userToDelete={userToDelete}
        isDeleting={deletingUser}
        onDelete={handleDeleteUser}
      />
    </>
  );
};

export default UsersList;
