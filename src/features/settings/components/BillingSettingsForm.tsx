/**
 * Billing Settings Form Component
 * 
 * This component displays and allows management of billing settings.
 */

import React from 'react';
import { BillingSettings } from '../types/index.ts';
import Button from '../../../components/common/Button.tsx';

interface BillingSettingsFormProps {
  settings: BillingSettings;
  onChangePlan: () => void;
  onUpdatePaymentMethod: () => void;
  onDownloadInvoice: (invoiceId: string) => void;
}

const BillingSettingsForm: React.FC<BillingSettingsFormProps> = ({
  settings,
  onChangePlan,
  onUpdatePaymentMethod,
  onDownloadInvoice
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800">Current Plan</h3>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium text-gray-800">{settings.plan.name}</h4>
              <p className="text-sm text-gray-500 mt-1">${settings.plan.price}/month</p>
            </div>
            <Button variant="outline" onClick={onChangePlan}>Change Plan</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-700">Plan Features</h5>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              {settings.plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Payment Method</h3>
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              {settings.paymentMethod.type}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-700">{settings.paymentMethod.type} ending in {settings.paymentMethod.last4}</p>
            <p className="text-xs text-gray-500">Expires {settings.paymentMethod.expiryMonth}/{settings.paymentMethod.expiryYear}</p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={onUpdatePaymentMethod}>Update</Button>
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
              {settings.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{invoice.date}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${invoice.amount.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : invoice.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Button 
                      variant="text" 
                      size="xs"
                      onClick={() => onDownloadInvoice(invoice.id)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingSettingsForm;
