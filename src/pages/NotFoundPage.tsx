/**
 * NotFoundPage Component
 * 
 * The 404 page for the ConnectChain admin panel.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button.tsx';
import { ROUTES } from '../constants/routes.ts';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
          <p className="mt-2 text-lg text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <Button
            variant="primary"
            size="lg"
            icon={<HomeIcon className="h-5 w-5" />}
            iconPosition="left"
            href={ROUTES.DASHBOARD}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
