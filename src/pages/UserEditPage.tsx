import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Tabs from '../components/common/Tabs';
import { UserDetails, EditUserForm, UserAnalytics, useUsers } from '../features/users/index';
import { useOrders } from '../features/orders/index';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { User, UserFormData } from '../features/users/types';

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id || ''; // Default to empty string if undefined
  const { getUserById, updateUser } = useUsers({ initialFetch: false });
  const { getOrdersByCustomer } = useOrders();

  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [error, setError] = useState<string | null>(null);



  // Move the data fetching directly into useEffect to avoid dependency issues
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setError('No user ID provided');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = await getUserById(userId);
        setUser(userData);

        const orders = await getOrdersByCustomer(userId);
        setUserOrders(orders);
      } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
        setError(errorMessage);
        // Error notifications are handled by the hooks (useUsers, useOrders)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Only userId as dependency - functions are called directly
  
  const handleUpdateUser = useCallback(async (userData: UserFormData) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      const updatedUser = await updateUser(user.id, userData);
      setUser(updatedUser);

      // Success notification is handled by the useUsers hook
      // Switch back to details tab after successful update
      setActiveTab('details');
    } catch (error) {
      console.error('Error updating user:', error);
      // Error notification is also handled by the useUsers hook
      throw error; // Re-throw to let the form handle it
    } finally {
      setIsSubmitting(false);
    }
  }, [user, updateUser]); // Keep essential dependencies only

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <LoadingSpinner size="lg" className="mb-2" />
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              Loading User Details
            </h3>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Please wait while we fetch the user information and order history...
            </p>
          </div>
          {/* Optional: Add a subtle progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-1 max-w-xs mx-auto">
            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-600 text-lg font-medium">Error Loading User</div>
        <div className="text-gray-600">{error}</div>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-600 text-lg font-medium">User not found</div>
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Users
        </button>
      </div>
    );
  }
  
  // Calculate analytics data
  const userAnalyticsData = {
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: userOrders.length > 0 
      ? userOrders.reduce((sum, order) => sum + order.totalAmount, 0) / userOrders.length 
      : 0,
    orderFrequency: 0, // Would calculate based on date ranges in a real app
    orderHistory: userOrders.map(order => ({
      date: order.orderDate,
      amount: order.totalAmount
    }))
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={`User: ${user.name}`}
        description="View and edit user details"
        breadcrumbs={[
          { label: 'Users', path: '/users' },
          { label: user.name }
        ]}
      />
      
      <Tabs
        tabs={[
          { id: 'details', label: 'Details' },
          { id: 'edit', label: 'Edit' },
          { id: 'analytics', label: 'Analytics' }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'details' && (
        <UserDetails user={user} userOrders={userOrders} />
      )}
      
      {activeTab === 'edit' && (
        <EditUserForm
          user={user}
          onSubmit={handleUpdateUser}
          isLoading={isSubmitting}
        />
      )}
      
      {activeTab === 'analytics' && (
        <UserAnalytics
          userId={userId}
          userData={userAnalyticsData}
        />
      )}
    </div>
  );
};

export default UserEditPage;