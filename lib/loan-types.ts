import {RegisterClientRequest, User} from "@/lib/auth-types";

export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
export type LoanType = 'personal' | 'home' | 'auto' | 'business' | 'education';

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  loanType: LoanType;
  amount: number;
  status: LoanStatus;
  createdDate: Date;
  approvalDate?: Date;
}

export const LOAN_TYPES: Record<LoanType, string> = {
  personal: 'Personal Loan',
  home: 'Home Loan',
  auto: 'Auto Loan',
  business: 'Business Loan',
  education: 'Education Loan',
};

export const LOAN_STATUS_COLORS: Record<LoanStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-800',
  approved: 'bg-blue-50 text-blue-800',
  rejected: 'bg-red-50 text-red-800',
  active: 'bg-green-50 text-green-800',
  completed: 'bg-gray-50 text-gray-800',
};

