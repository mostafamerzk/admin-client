/**
 * SettingsPage Component
 * 
 * The settings page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader.tsx';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import useNotification from '../hooks/useNotification.ts';

const SettingsPage: React.FC = () => {
  const { showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('general');
  
  const handleSave = () => {
    showSuccess('Settings saved successfully');
  };
  
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your application settings"
        breadcrumbs={[{ label: 'Settings' }]}
      />
      
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card noPadding>
            <ul className="divide-y divide-gray-100">
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${
                    activeTab === 'general' ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  General Settings
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${
                    activeTab === 'security' ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${
                    activeTab === 'notifications' ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${
                    activeTab === 'api' ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('api')}
                >
                  API Keys
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-3 ${
                    activeTab === 'billing' ? 'bg-primary bg-opacity-5 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('billing')}
                >
                  Billing
                </button>
              </li>
            </ul>
          </Card>
        </div>
        
        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          {activeTab === 'general' && (
            <Card title="General Settings">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue="ConnectChain"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue="support@connectchain.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Default Language
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue="UTC"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card title="Security Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">Protect your account with two-factor authentication</p>
                        <p className="text-xs text-gray-500 mt-1">Currently disabled</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card title="Notification Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Email Notifications</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-users"
                          name="new-users"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-users" className="font-medium text-gray-700">New user registrations</label>
                        <p className="text-gray-500">Get notified when a new user registers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-orders"
                          name="new-orders"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-orders" className="font-medium text-gray-700">New orders</label>
                        <p className="text-gray-500">Get notified when a new order is placed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="supplier-verifications"
                          name="supplier-verifications"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="supplier-verifications" className="font-medium text-gray-700">Supplier verification requests</label>
                        <p className="text-gray-500">Get notified when a supplier requests verification</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'api' && (
            <Card title="API Keys">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Your API Keys</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Use these keys to authenticate API requests from your applications
                  </p>
                  
                  <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Production API Key</h4>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="password"
                          readOnly
                          value="sk_prod_2023_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="block w-full bg-gray-50 border-0 focus:ring-0 text-sm text-gray-500"
                        />
                        <Button variant="text" size="sm">Show</Button>
                        <Button variant="text" size="sm">Copy</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Test API Key</h4>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center">
                        <input
                          type="password"
                          readOnly
                          value="sk_test_2023_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="block w-full bg-gray-50 border-0 focus:ring-0 text-sm text-gray-500"
                        />
                        <Button variant="text" size="sm">Show</Button>
                        <Button variant="text" size="sm">Copy</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">API Usage</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor your API usage and limits
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Requests this month</span>
                      <span className="text-sm text-gray-500">12,345 / 50,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'billing' && (
            <Card title="Billing Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Current Plan</h3>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-base font-medium text-gray-800">Enterprise Plan</h4>
                        <p className="text-sm text-gray-500 mt-1">$499/month</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700">Plan Features</h5>
                      <ul className="mt-2 space-y-1 text-sm text-gray-500">
                        <li>Unlimited users</li>
                        <li>Advanced analytics</li>
                        <li>Priority support</li>
                        <li>Custom integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                        VISA
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-700">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/2025</p>
                    </div>
                    <div className="ml-auto">
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800">Billing History</h3>
                  <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Jan 1, 2023</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$499.00</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Paid</span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Button variant="text" size="xs">Download</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">Dec 1, 2022</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$499.00</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Paid</span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Button variant="text" size="xs">Download</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
