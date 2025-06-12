/**
 * Users Page
 *
 * This page displays and manages users in the system.
 */

import React, { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { UserPlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import {
  AddUserForm,
  UserDetailsModal,
  UserList,
  type User,
  type UserFormData,
  getMockUsers
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

  // Use mock data from the centralized mock data file
  const [users, setUsers] = useState<User[]>(getMockUsers());

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

  // Filter users based on status (all, active, banned)
  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    return user.status === activeTab;
  });

  const handleUserClick = (user: User) => {
    handleViewUser(user);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  // Note: Edit functionality is now handled directly in the UserList component
  // This is kept for backward compatibility
  const handleEditUser = (user: User) => {
    console.log('Edit user (deprecated):', user);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      const result = await withErrorHandling(async () => {
        // Simulate API call with potential failure
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate random failure for demonstration
            if (Math.random() < 0.1) {
              reject(new Error('Failed to delete user'));
            } else {
              resolve(true);
            }
          }, 500);
        });

        setUsers(users.filter(u => u.id !== user.id));
        return true;
      }, `Delete user ${user.name}`);

      if (!result) {
        console.error('Failed to delete user');
      }
    }
  };

  const handleExportUsers = async () => {
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
  };

  const handleAddUser = async (userData: UserFormData) => {
    setIsLoading(true);
    clearError();

    const result = await withFormErrorHandling(async () => {
      // Simulate API call with validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate validation error
          if (users.some(u => u.email === userData.email)) {
            reject({
              response: {
                data: {
                  errors: {
                    email: ['Email already exists']
                  }
                }
              }
            });
          } else if (Math.random() < 0.1) {
            reject(new Error('Failed to create user'));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      // Create new user with form data
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        type: userData.type,
        status: 'active',
        lastLogin: '-',
        avatar: userData.image && userData.image instanceof File ? URL.createObjectURL(userData.image) : '',
        address: userData.address || '',
        businessType: userData.businessType || '',
        phone: userData.phone || ''
      };

      // Add to users array
      setUsers([...users, newUser]);
      setIsAddUserModalOpen(false);
      return newUser;
    }, undefined, 'Add User');

    setIsLoading(false);

    if (result) {
      console.log('User added successfully:', result);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const result = await withErrorHandling(async () => {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Failed to update user status'));
          } else {
            resolve(true);
          }
        }, 500);
      });

      setUsers(users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: u.status === 'active' ? 'banned' : 'active'
          };
        }
        return u;
      }));

      setIsUserDetailsModalOpen(false);
      return true;
    }, `Toggle status for user ${user.name}`);

    if (!result) {
      console.error('Failed to toggle user status');
    }
  };

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
            loading={isLoading}
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
                onClick={() => toggleUserStatus(selectedUser.id)}
              >
                {selectedUser.status === 'active' ? 'Ban User' : 'Activate User'}
              </Button>
            </>
          }
        >
          <UserDetailsModal user={selectedUser} />
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