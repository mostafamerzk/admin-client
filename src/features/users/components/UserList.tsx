/**
 * User List Component
 *
 * This component displays a list of users in a data table.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseEntityList from '../../../components/common/EntityList/BaseEntityList';
import type { Column } from '../../../components/common/DataTable';
import type { User } from '../types';
import {
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../../../constants/routes';

interface UserListProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onUserClick: (user: User) => void;
  title?: string;
  loading?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onViewUser,
  onEditUser: _onEditUser,
  onDeleteUser,
  onUserClick: _onUserClick, // Keep for interface compatibility but use navigation instead
  title = 'Users',
  loading = false
}) => {
  const navigate = useNavigate();

  // Handle row click to navigate to user edit page (which serves as details page)
  const handleRowClick = (user: User) => {
    navigate(ROUTES.getUserEditRoute(user.id));
  };
  
  // Define user-specific columns
  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_value, user) => (
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
      render: (value) => (
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
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onViewUser(user);
            }}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.getUserEditRoute(user.id));
            }}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUser(user);
            }}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <BaseEntityList<User>
      data={users}
      columns={columns}
      onRowClick={handleRowClick}
      title={title}
      pagination={true}
      loading={loading}
      emptyMessage="No users found"
    />
  );
};

export default UserList;



