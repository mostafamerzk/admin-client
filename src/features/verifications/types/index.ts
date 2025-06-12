/**
 * Verification Types
 *
 * This file defines the TypeScript interfaces for the verifications feature.
 */

export interface Verification {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedDate: string;
  documents: VerificationDocument[];
  notes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VerificationDocument {
  name: string;
  type: string;
  url: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
}

export interface VerificationRequest {
  verificationId: string;
  reason?: string;
}

export interface VerificationFilters {
  status?: 'pending' | 'verified' | 'rejected';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface VerificationUpdateData {
  status?: 'pending' | 'verified' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}
