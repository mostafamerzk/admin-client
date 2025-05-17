/**
 * Users Page
 *
 * This page displays and manages users in the system.
 */

import React, { useState } from 'react';
import Button from '../components/common/Button.tsx';
import Card from '../components/common/Card.tsx';
import Modal from '../components/common/Modal.tsx';
import { UserPlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import {
  AddUserForm,
  UserDetails,
  UserList,
  User,
  UserFormData,
  getMockUsers
} from '../features/users/index.ts';

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'banned'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  // Use mock data from the centralized mock data file
  const [users, setUsers] = useState<User[]>(getMockUsers());

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

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleExportUsers = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Exporting users...');
    }, 1500);
  };

  const handleAddUser = (userData: UserFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create new user with form data
      const newUser: User = {
        id: (users.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        type: userData.type,
        status: 'active',
        lastLogin: '-',
        avatar: ''
      };

      // Add to users array
      setUsers([...users, newUser]);

      // Reset state
      setIsLoading(false);
      setIsAddUserModalOpen(false);
    }, 1500);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'banned' : 'active'
        };
      }
      return user;
    }));
    setIsUserDetailsModalOpen(false);
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
          size="md"
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
          <UserDetails user={selectedUser} />
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;