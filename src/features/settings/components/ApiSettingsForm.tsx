/**
 * API Settings Form Component
 * 
 * This component displays and allows management of API keys and usage.
 */

import React, { useState } from 'react';
import { ApiSettings } from '../types/index';
import Button from '../../../components/common/Button';

interface ApiSettingsFormProps {
  settings: ApiSettings;
  onRegenerateKey: (keyType: 'production' | 'test') => void;
}

const ApiSettingsForm: React.FC<ApiSettingsFormProps> = ({
  settings,
  onRegenerateKey
}) => {
  const [showProductionKey, setShowProductionKey] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Your API Keys</h3>
        <p className="text-sm text-gray-500 mt-1">
          Use these keys to authenticate API requests from your applications
        </p>
        
        {settings.keys.map((apiKey) => (
          <div key={apiKey.type} className="mt-4 border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">{apiKey.name}</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRegenerateKey(apiKey.type)}
                >
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center">
                <input
                  type={apiKey.type === 'production' ? (showProductionKey ? 'text' : 'password') : (showTestKey ? 'text' : 'password')}
                  readOnly
                  value={apiKey.key}
                  className="block w-full bg-gray-50 border-0 focus:ring-0 text-sm text-gray-500"
                />
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => apiKey.type === 'production' 
                    ? setShowProductionKey(!showProductionKey) 
                    : setShowTestKey(!showTestKey)
                  }
                >
                  {apiKey.type === 'production' 
                    ? (showProductionKey ? 'Hide' : 'Show') 
                    : (showTestKey ? 'Hide' : 'Show')
                  }
                </Button>
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => handleCopyKey(apiKey.key)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">API Usage</h3>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your API usage and limits
        </p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Requests this month</span>
            <span className="text-sm text-gray-500">{settings.usage.current.toLocaleString()} / {settings.usage.limit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${settings.usage.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettingsForm;
