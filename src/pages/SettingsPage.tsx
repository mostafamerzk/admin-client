/**
 * SettingsPage Component
 *
 * The settings page for the ConnectChain admin panel.
 */

import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import MigrationNotice from '../components/common/MigrationNotice';
import useNotification from '../hooks/useNotification';
import { ROUTES } from '../constants/routes';
import {
  SettingsSidebar,
  GeneralSettingsForm,
  SecuritySettingsForm,
  ApiSettingsForm,
  BillingSettingsForm,

  SettingsTab,
  GeneralSettings,
  SecuritySettings,
  ApiSettings,
  BillingSettings,

} from '../features/settings/index';

const SettingsPage: React.FC = () => {
  // In a real implementation, we would use the useSettings hook
  // const { settings, isLoading, updateGeneralSettings, updateSecuritySettings, updateNotificationSettings, regenerateApiKey, updatePaymentMethod } = useSettings();

  const { showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Mock data for settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    platformName: 'ConnectChain',
    contactEmail: 'support@connectchain.com',
    defaultLanguage: 'en',
    timezone: 'UTC'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  const [apiSettings, _setApiSettings] = useState<ApiSettings>({
    keys: [
      {
        name: 'Production API Key',
        key: 'sk_prod_2023_xxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'production'
      },
      {
        name: 'Test API Key',
        key: 'sk_test_2023_xxxxxxxxxxxxxxxxxxxxxxxxxxx',
        type: 'test'
      }
    ],
    usage: {
      current: 12345,
      limit: 50000,
      percentage: 25
    }
  });

  const [billingSettings, _setBillingSettings] = useState<BillingSettings>({
    plan: {
      name: 'Enterprise Plan',
      price: 499,
      features: [
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ]
    },
    paymentMethod: {
      type: 'VISA',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025
    },
    invoices: [
      {
        id: 'inv_2023_01',
        date: 'Jan 1, 2023',
        amount: 499,
        status: 'paid',
        downloadUrl: '#'
      },
      {
        id: 'inv_2022_12',
        date: 'Dec 1, 2022',
        amount: 499,
        status: 'paid',
        downloadUrl: '#'
      }
    ]
  });

  const handleSave = () => {
    showSuccess('Settings saved successfully');
  };

  const handleGeneralSettingsChange = (field: keyof GeneralSettings, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleTwoFactor = () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };



  const handleRegenerateApiKey = (keyType: 'production' | 'test') => {
    // In a real app, this would call an API to regenerate the key
    console.log(`Regenerating ${keyType} API key`);
  };

  const handleChangePlan = () => {
    // In a real app, this would navigate to a plan selection page
    console.log('Changing plan');
  };

  const handleUpdatePaymentMethod = () => {
    // In a real app, this would open a payment method form
    console.log('Updating payment method');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // In a real app, this would download the invoice
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <SecuritySettingsForm
            settings={securitySettings}
            onSave={handleSave}
            onToggleTwoFactor={handleToggleTwoFactor}
            onPasswordChange={handlePasswordChange}
          />
        );

      case 'api':
        return (
          <ApiSettingsForm
            settings={apiSettings}
            onRegenerateKey={handleRegenerateApiKey}
          />
        );
      case 'billing':
        return (
          <BillingSettingsForm
            settings={billingSettings}
            onChangePlan={handleChangePlan}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
            onDownloadInvoice={handleDownloadInvoice}
          />
        );
      default:
        return (
          <GeneralSettingsForm
            settings={generalSettings}
            onSave={handleSave}
            onChange={handleGeneralSettingsChange}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* Migration Notice */}
      <MigrationNotice
        title="Notification Settings Moved"
        message="Notification preferences have been moved to your Profile page for better organization. You can now manage both personal and admin notifications in one place."
        actionText="Go to Profile → Notifications"
        actionLink={ROUTES.PROFILE}
        type="info"
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
