/**
 * Users Page
 *
 * This page displays and manages users in the system.
 */

import React, { useState, useMemo, useCallback } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { UserPlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import {
  AddUserForm,
  UserDetailsModal,
  UserList,
  useUsers,
  type User,
  type UserFormData
} from '../features/users/index';
import useErrorHandler from '../hooks/useErrorHandler';
import { safeAsyncOperation } from '../utils/errorHandling';
import withErrorBoundary from '../components/common/withErrorBoundary';

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'banned'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use users feature hook
  const {
    users,
    isLoading: usersLoading,
    createEntity: createUser,
    deleteEntity: deleteUser,
    toggleUserStatus
  } = useUsers();

  // Error handling
  const {
    handleGeneralError,
    withErrorHandling,
    withFormErrorHandling,
    clearError
  } = useErrorHandler({
    enableNotifications: true,
    enableReporting: true
  });

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    if (activeTab === 'all') return users;
    return users.filter(user => user.status === activeTab);
  }, [users, activeTab]);

  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  }, []);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleUserClick = useCallback((user: User) => {
    handleViewUser(user);
  }, [handleViewUser]);

  // Note: Edit functionality is now handled directly in the UserList component
  // This is kept for backward compatibility
  const handleEditUser = (user: User) => {
    console.log('Edit user (deprecated):', user);
  };

  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    const result = await withErrorHandling(async () => {
      await deleteUser(userToDelete.id);
      return true;
    }, `Delete user ${userToDelete.name}`);

    setIsDeleting(false);
    if (result) {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } else {
      console.error('Failed to delete user');
    }
  }, [userToDelete, withErrorHandling, deleteUser]);

  const handleExportUsers = useCallback(async () => {
    setIsLoading(true);

    const result = await safeAsyncOperation(
      async () => {
        // Simulate export process with potential failure
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.1) {
              reject(new Error('Export failed'));
            } else {
              resolve(true);
            }
          }, 1500);
        });

        console.log('Exporting users...');
        return true;
      },
      {
        timeout: 5000,
        retries: 2,
        operationName: 'Export Users'
      }
    );

    if (!result.success) {
      handleGeneralError(result.error, 'Export Users');
    }

    setIsLoading(false);
  }, [handleGeneralError]);

  const handleAddUser = useCallback(async (userData: UserFormData) => {
    setIsLoading(true);
    clearError();

    const result = await withFormErrorHandling(async () => {
      const newUser = await createUser(userData);
      setIsAddUserModalOpen(false);
      return newUser;
    }, undefined, 'Add User');

    setIsLoading(false);

    if (result) {
      console.log('User added successfully:', result);
    }
  }, [withFormErrorHandling, createUser, clearError]);

  const handleToggleUserStatus = useCallback(async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'banned' : 'active';

    const result = await withErrorHandling(async () => {
      const updatedUser = await toggleUserStatus(userId, newStatus);

      // Update the selectedUser state if it's the same user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }

      setIsUserDetailsModalOpen(false);
      return true;
    }, `Toggle status for user ${user.name}`);

    if (!result) {
      console.error('Failed to toggle user status');
    }
  }, [users, withErrorHandling, toggleUserStatus, selectedUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your users and their permissions</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
            onClick={handleExportUsers}
            loading={isLoading || usersLoading}
          >
            Export Users
          </Button>
          <Button
            icon={<UserPlusIcon className="h-5 w-5" />}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            All Users
          </Button>
          <Button
            variant={activeTab === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('active')}
          >
            Active Users
          </Button>
          <Button
            variant={activeTab === 'banned' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('banned')}
          >
            Banned Users
          </Button>
        </div>

        <UserList
          users={filteredUsers}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onUserClick={handleUserClick}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (${filteredUsers.length})`}
          loading={usersLoading}
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
        size="lg"
      >
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setIsAddUserModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={isUserDetailsModalOpen}
          onClose={() => setIsUserDetailsModalOpen(false)}
          title="User Details"
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsUserDetailsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant={selectedUser.status === 'active' ? 'danger' : 'success'}
                onClick={() => handleToggleUserStatus(selectedUser.id)}
              >
                {selectedUser.status === 'active' ? 'Ban User' : 'Activate User'}
              </Button>
            </>
          }
        >
          <UserDetailsModal user={selectedUser} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User"
          size="sm"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteUser}
                loading={isDeleting}
              >
                Delete User
              </Button>
            </>
          }
        >
          <div className="text-sm text-gray-500">
            Are you sure you want to delete "{userToDelete.name}"? This action cannot be undone.
          </div>
        </Modal>
      )}
    </div>
  );
};

// Wrap with error boundary
export default withErrorBoundary(UsersPage, {
  fallback: ({ error, resetError }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Users Page Error</h2>
      <p className="text-gray-600 mb-4 text-center max-w-md">
        {error.message || 'An error occurred while loading the users page'}
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Reload Page
      </button>
    </div>
  ),
  context: 'UsersPage'
});