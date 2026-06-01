import {RegisterClientRequest} from "@/lib/auth-types";

export interface ApplicationRequest {
  productId: number,
  requestAmount: string,
  requestedTenureMonths: number,
  purpose: string,
  hasCollateral: boolean,
  hasGuarantor: boolean,
  dateOfBirth: string
  user: Omit<RegisterClientRequest, "password">
}

// ── Update Application sub-types ──────────────────────────────────────────────

export interface UpdateApplicationCustomerInfo {
  age: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus: string;
  numberOfDependents?: number;
  educationLevel: string;
  residenceType: string;
  residenceDurationMonths?: number;
  permanentAddress: string;
  currentAddress: string;
  emergencyContactPhone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
}

export interface UpdateApplicationJobInfo {
  employmentType: string;
  employerName: string;
  employerAddress?: string;
  industry?: string;
  jobTitle?: string;
  employmentDurationMonths?: number;
  employmentStartDate?: string;
  contractType?: string;
}

export interface UpdateApplicationFinanceInfo {
  monthlyIncome: number;
  otherIncome?: number;
  otherIncomeSource?: string;
  monthlyExpenses?: number;
  expensesBreakdown?: string;
  existingDebts?: number;
  debtsDetails?: string;
  monthlyDebtPayments?: number;
  hasCollateral: boolean;
  collateralDescription?: string;
  estimatedCollateralValue?: number;
}

export interface UpdateApplicationAssetsInfo {
  totalAssets?: number;
  assetsDetails?: string;
  hasCollateral: boolean;
  collateralDescription?: string;
  estimatedCollateralValue?: number;
}

export interface UpdateApplicationCICInfo {
  cicScore?: number;
  creditHistoryYears?: number;
  totalLoansCount?: number;
  closedLoansCount?: number;
  activeLoansCount?: number;
  latePaymentCount?: number;
  maxDaysLate?: number;
  hasDefaultHistory: boolean;
  onTimePaymentPercentage?: number;
  totalCreditLimit?: number;
  totalDebtOutstanding?: number;
  creditUtilizationRatio?: number;
  inquiriesLast6Months?: number;
}

export interface UpdateApplicationLoanInfo {
  requestedAmount: number;
  requestedTenureMonths: number;
  requestedRepaymentFrequency: string;
  purpose: string;
  purposeDetails: string;
}

export interface UpdateApplicationRequest {
  customerInfo?: UpdateApplicationCustomerInfo;
  jobInfo?: UpdateApplicationJobInfo;
  financeInfo?: UpdateApplicationFinanceInfo;
  assetsInfo?: UpdateApplicationAssetsInfo;
  cicInfo?: UpdateApplicationCICInfo;
  loanInfo?: UpdateApplicationLoanInfo;
}

export interface ApplicationUpdateResponse {
  applicationNumber: string;
  applicationId: number;
  channel: string;
}

export interface BeFieldError {
  field: string;
  message: string;
}

export interface BeValidationErrorResponse {
  success: boolean;
  message: string;
  errorCode: string | null;
  errors?: BeFieldError[];
}