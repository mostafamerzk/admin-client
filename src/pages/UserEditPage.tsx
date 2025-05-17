/**
 * User Edit Page
 *
 * This page allows editing of user details.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card.tsx';
import EntityForm from '../components/common/EntityForm.tsx';
import PageHeader from '../components/layout/PageHeader.tsx';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { User } from '../features/users/types/index.ts';
import { ROUTES } from '../constants/routes.ts';
import useNotification from '../hooks/useNotification.ts';

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockUsers: User[] = [
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
        ];

        const foundUser = mockUsers.find(u => u.id === id);
        if (foundUser) {
          setUser(foundUser);
        } else {
          showNotification({
            type: 'error',
            title: 'Error',
            message: 'User not found'
          });
          navigate(ROUTES.USERS);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch user details'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate, showNotification]);

  const handleSubmit = async (userData: User) => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user state
      setUser(userData);
      
      showNotification({
        type: 'success',
        title: 'Success',
        message: 'User updated successfully'
      });
      
      // Navigate back to users page
      navigate(ROUTES.USERS);
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.USERS);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        description={`Edit details for ${user?.name || 'user'}`}
        actions={
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Back to Users
          </button>
        }
      />

      <Card>
        <EntityForm
          entity={user}
          entityType="user"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </Card>
    </div>
  );
};

export default UserEditPage;
