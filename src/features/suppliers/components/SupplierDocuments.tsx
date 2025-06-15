/**
 * Supplier Documents Component
 *
 * This component displays verification documents submitted by the supplier
 * with document preview/download functionality.
 */

import React, { useState } from 'react';
import DetailSection from '../../../components/common/DetailSection';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import useNotification from '../../../hooks/useNotification';
import type { SupplierDocument } from '../types';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { formatDate, formatFileSize } from '../../../utils/formatters';

interface SupplierDocumentsProps {
  documents: SupplierDocument[];
  supplierId?: string;
}

const SupplierDocuments: React.FC<SupplierDocumentsProps> = ({
  documents,
  supplierId: _supplierId
}) => {
  const { showInfo } = useNotification();
  const [selectedDocument, setSelectedDocument] = useState<SupplierDocument | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const getDocumentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      business_license: 'Business License',
      tax_certificate: 'Tax Certificate',
      insurance: 'Insurance Policy',
      certification: 'Certification',
      other: 'Other Document'
    };
    return typeLabels[type] || 'Unknown Document';
  };

  const handleViewDocument = (document: SupplierDocument) => {
    setSelectedDocument(document);
    setIsPreviewModalOpen(true);
  };

  const handleDownloadDocument = (document: SupplierDocument) => {
    // In a real implementation, this would trigger a download
    showInfo(`Downloading ${document.name}...`);
    console.log('Download document:', document);
  };

  if (documents.length === 0) {
    return (
      <DetailSection
        title="Verification Documents"
        description="Documents submitted for supplier verification"
      >
        <div className="px-6 py-8 text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents uploaded</h3>
          <p className="mt-1 text-sm text-gray-500">
            This supplier has not uploaded any verification documents yet.
          </p>
        </div>
      </DetailSection>
    );
  }

  return (
    <div className="space-y-6">
      <DetailSection
        title="Verification Documents"
        description="Documents submitted for supplier verification and compliance"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {document.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.fileName} • {formatFileSize(document.fileSize)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getDocumentTypeLabel(document.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(document.uploadDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleViewDocument(document)}
                        icon={<EyeIcon className="w-4 h-4" />}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDownloadDocument(document)}
                        icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                      >
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailSection>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={`Document Preview: ${selectedDocument.name}`}
          size="lg"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDownloadDocument(selectedDocument)}
                icon={<ArrowDownTrayIcon className="w-4 h-4" />}
              >
                Download
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">File Name:</span>
                  <div className="text-gray-900">{selectedDocument.fileName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-500">File Size:</span>
                  <div className="text-gray-900">{formatFileSize(selectedDocument.fileSize)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Upload Date:</span>
                  <div className="text-gray-900">{formatDate(selectedDocument.uploadDate)}</div>
                </div>
              </div>
              {selectedDocument.notes && (
                <div className="mt-4">
                  <span className="font-medium text-gray-500">Notes:</span>
                  <div className="text-gray-900 mt-1">{selectedDocument.notes}</div>
                </div>
              )}
            </div>
            
            {/* Document preview placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Document preview not available. Click download to view the file.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierDocuments;
