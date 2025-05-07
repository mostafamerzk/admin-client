import React, { useState } from 'react';
import DataTable from '../components/DataTable.tsx';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import AddUserForm, { UserFormData } from '../components/AddUserForm.tsx';
import {
  UserPlusIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'supplier';
  status: 'active' | 'banned';
  lastLogin: string;
  avatar?: string;
}

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'customers' | 'suppliers'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      type: 'customer',
      status: 'active',
      lastLogin: '2024-01-15',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      type: 'supplier',
      status: 'active',
      lastLogin: '2024-01-14',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      type: 'customer',
      status: 'banned',
      lastLogin: '2024-01-10',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      type: 'supplier',
      status: 'active',
      lastLogin: '2024-01-12',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: '5',
      name: 'Michael Wilson',
      email: 'michael@example.com',
      type: 'customer',
      status: 'active',
      lastLogin: '2024-01-11',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ]);

  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    return user.type === activeTab.slice(0, -1); // Remove 's' from 'customers' or 'suppliers'
  });

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, user: User) => (
        <div className="flex items-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">ID: {user.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastLogin', label: 'Last Login', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleViewUser(user);
            }}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit user:', user);
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const handleUserClick = (user: User) => {
    handleViewUser(user);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
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
    setIsAddingUser(true);

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
      setIsAddingUser(false);
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
            variant={activeTab === 'customers' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </Button>
          <Button
            variant={activeTab === 'suppliers' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('suppliers')}
          >
            Suppliers
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredUsers}
          onRowClick={handleUserClick}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} (${filteredUsers.length})`}
          pagination={true}
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
          isLoading={isAddingUser}
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
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {selectedUser.avatar ? (
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.type.charAt(0).toUpperCase() + selectedUser.type.slice(1)}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.lastLogin}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.type.charAt(0).toUpperCase() + selectedUser.type.slice(1)}</dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500">Recent Activity</h4>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-gray-600">Logged in on {selectedUser.lastLogin}</li>
                <li className="text-sm text-gray-600">Updated profile information on 2024-01-05</li>
                <li className="text-sm text-gray-600">Changed password on 2023-12-20</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;