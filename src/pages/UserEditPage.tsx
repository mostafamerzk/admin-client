import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.tsx';
import Tabs from '../components/common/Tabs.tsx';
import { UserDetails, EditUserForm, UserAnalytics, useUsers } from '../features/users/index.ts';
import { useOrders } from '../features/orders/index.ts';
import LoadingSpinner from '../components/common/LoadingSpinner.tsx';
import type { User } from '../features/users/types';

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id || ''; // Default to empty string if undefined
  const { getUserById, updateUser } = useUsers({ initialFetch: false });
  const { getOrdersByCustomer } = useOrders();
  
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
        
        const orders = await getOrdersByCustomer(userId);
        setUserOrders(orders);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId, getUserById, getOrdersByCustomer]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <div>User not found</div>;
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
          onSubmit={async (userData) => {
            // Implementation
          }}
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