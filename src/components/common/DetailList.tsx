import React from 'react';
import type { ReactNode } from 'react';

interface DetailListProps {
  children: ReactNode;
  className?: string;
}

const DetailList: React.FC<DetailListProps> = ({
  children,
  className = ''
}) => {
  return (
    <dl className={`sm:divide-y sm:divide-gray-200 ${className}`}>
      {children}
    </dl>
  );
};

export default DetailList;