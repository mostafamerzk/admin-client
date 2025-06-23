/**
 * User Details Component
 *
 * This component displays detailed information about a user.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import DetailSection from '../../../components/common/DetailSection';
import DetailList from '../../../components/common/DetailList';
import DetailItem from '../../../components/common/DetailItem';
import OrdersSection from '../../../components/common/OrdersSection';
import StatusBadge from '../../../components/common/StatusBadge';
import type{ User } from '../types';
import type { Order } from '../../orders/types';
import { ROUTES } from '../../../constants/routes';

interface UserDetailsProps {
  user: User;
  userOrders: Order[];
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, userOrders = [] }) => {
  const navigate = useNavigate();

  const handleViewOrder = (order: Order) => {
    navigate(ROUTES.getOrderDetailsRoute(order.id.toString()));
  };

  return (
    <div className="space-y-6">
      <DetailSection
        title="User Information"
        description="Personal details and application"
      >
        <DetailList>
          <DetailItem label="Full name" value={user.name} />
          <DetailItem label="Email address" value={user.email} />
          <DetailItem label="User type" value={user.type} />
          <DetailItem label="Status" value={<StatusBadge status={user.status} type="user" />} />
          <DetailItem label="Last login" value={user.lastLogin} />
        </DetailList>
      </DetailSection>

      <OrdersSection
        orders={userOrders}
        title="User Orders"
        description="Orders placed by this user"
        onViewOrder={handleViewOrder}
        emptyMessage="This user has not placed any orders yet"
      />
    </div>
  );
};

export default UserDetails;