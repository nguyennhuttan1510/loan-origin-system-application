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
  dateOfBirth: string;
  nationalId?: string;
  phoneNumber?: string;
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
  // Step 1 new
  nationalIdIssueDate?: string        // yyyy-MM-dd
  nationalIdIssuePlace?: string
  landlinePhone?: string
  hasRelationship?: 'EXISTING' | 'NEW'
  // Step 4 new
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
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
  employerPhone?: string;
}

export interface UpdateApplicationFinanceInfo {
  monthlyIncome: number;
  otherIncome?: number;
  otherIncomeSource?: string;
  businessIncome?: number;
  rentalIncome?: number;
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
  loanMethod?: 'INSTALLMENT' | 'CREDIT_LINE' | 'OVERDRAFT'
  repaymentSource?: string
  principalRepaymentPeriod?: string
  interestRepaymentPeriod?: string
  principalRepaymentMethod?: 'EQUAL' | 'INSTALLMENT_METHOD' | 'FLEXIBLE'
  repaymentAccountNumber?: string
  collateralType?: 'REAL_ESTATE' | 'VEHICLE' | 'DEPOSIT' | 'SECURITIES' | 'NONE'
  collateralOwnerType?: 'BORROWER' | 'SPOUSE' | 'CO_OWNER' | 'THIRD_PARTY'
  insurancePackage?: 'A' | 'B' | 'NONE'
  insurancePaymentMethod?: 'LUMP_SUM' | 'ANNUAL'
}

export interface UpdateApplicationRelationshipInfo {
  emergencyContactAddress?: string
  referenceName2?: string
  referencePhone2?: string
  referenceRelation2?: string
  existingCustomer?: string
  accountNumber?: string
  coborrowerName?: string
  coborrowerDateOfBirth?: string      // yyyy-MM-dd
  coborrowerGender?: string
  coborrowerIdNumber?: string
  coborrowerIdIssueDate?: string      // yyyy-MM-dd
  coborrowerIdIssuePlace?: string
  coborrowerCurrentAddress?: string
  coborrowerMobilePhone?: string
  coborrowerMonthlyIncome?: number
}

export interface UpdateApplicationRequest {
  customerInfo?: UpdateApplicationCustomerInfo;
  jobInfo?: UpdateApplicationJobInfo;
  financeInfo?: UpdateApplicationFinanceInfo;
  assetsInfo?: UpdateApplicationAssetsInfo;
  cicInfo?: UpdateApplicationCICInfo;
  loanInfo?: UpdateApplicationLoanInfo;
  relationshipInfo?: UpdateApplicationRelationshipInfo;
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

// ── GET /loan-application/{id} response ───────────────────────────────────────

export interface BorrowerInfo {
  userCode: string
  username: string
  email: string
  fullName: string
  phoneNumber: string
  nationalId: string
  national: string
  userType: string
  active: boolean
}

export interface LoanApplication {
  // identity
  id: number
  applicationNumber: string
  borrowerId: string | null
  borrower: BorrowerInfo | null

  // personal
  /** @deprecated always empty string from entity — use borrower.fullName */
  borrowerName: string
  dateOfBirth: string | null
  nationalId: string | null
  phoneNumber: string | null
  gender: string
  maritalStatus: string | null
  numberOfDependents: number | null
  educationLevel: string | null

  // loan request
  loanProductId: number | null
  loanProductCode: string | null
  loanProductName: string | null
  requestedAmount: number
  requestedTenureMonths: number
  purpose: string
  purposeDetails: string | null
  channel: string | null

  // Step 1 new
  nationalIdIssueDate: string | null
  nationalIdIssuePlace: string | null
  landlinePhone: string | null
  hasRelationship: string | null

  // employment
  employmentType: string | null
  employerName: string | null
  industry: string | null
  jobTitle: string | null
  employmentDurationMonths: number | null
  employmentStartDate: string | null   // yyyy-MM-dd
  contractType: string | null
  employerAddress: string | null

  // Step 2 new
  employerPhone: string | null
  businessIncome: number | null
  rentalIncome: number | null

  // income
  incomeSource: string | null          // otherIncomeSource
  monthlyExpenses: number | null       // raw Long
  livingExpenses: string | null        // monthlyExpenses as String (legacy)
  expensesBreakdown: string | null
  existingDebts: number | null
  debtsDetails: string | null

  // location
  permanentAddress: string | null
  addressLine1: string | null          // currentAddress
  residenceType: string | null
  residenceDurationMonths: number | null
  yearsAtAddress: string | null        // residenceDurationMonths / 12

  // Step 4 new
  addressLine2: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null

  // emergency contact
  emergencyContactPhone: string | null
  emergencyContactName: string | null
  emergencyContactRelationship: string | null

  // Step 3 new
  emergencyContactAddress: string | null
  referenceName2: string | null
  referencePhone2: string | null
  referenceRelation2: string | null
  existingCustomer: string | null
  accountNumber: string | null
  coborrowerName: string | null
  coborrowerDateOfBirth: string | null
  coborrowerGender: string | null
  coborrowerIdNumber: string | null
  coborrowerIdIssueDate: string | null
  coborrowerIdIssuePlace: string | null
  coborrowerCurrentAddress: string | null
  coborrowerMobilePhone: string | null
  coborrowerMonthlyIncome: number | null

  // assets
  totalAssets: number | null
  assetsDetails: string | null
  hasCollateral: boolean
  collateralDescription: string | null
  estimatedCollateralValue: number
  hasGuarantor: boolean
  numberOfGuarantors: number

  // financials
  monthlyIncome: number
  otherIncome: number
  totalMonthlyIncome: number
  monthlyDebtPayments: number
  dtiRatio: number

  // CIC
  cicScore: number
  creditHistoryYears: number
  totalLoansCount: number | null
  closedLoansCount: number
  activeLoansCount: number
  latePaymentCount: number
  maxDaysLate: number
  hasDefaultHistory: boolean
  onTimePaymentPercentage: number | null
  totalCreditLimit: number
  totalDebtOutstanding: number
  creditUtilizationRatio: number
  inquiriesLast6Months: number

  // Step 5 new
  loanMethod: string | null
  repaymentSource: string | null
  principalRepaymentPeriod: string | null
  interestRepaymentPeriod: string | null
  principalRepaymentMethod: string | null
  repaymentAccountNumber: string | null
  collateralType: string | null
  collateralOwnerType: string | null
  insurancePackage: string | null
  insurancePaymentMethod: string | null

  // repayment
  repaymentMethod: string | null       // requestedRepaymentFrequency

  // auto score
  autoScoreCredit: number | null
  autoScoreIncome: number | null
  autoScoreEmployment: number | null
  autoScoreCreditHistory: number | null
  autoScoreCollateral: number | null
  autoScoreTotal: number
  autoScoreGrade: string | null

  // risk score
  riskScorePd: number | null
  riskScoreLgd: number | null
  riskScoreEad: number | null
  riskScoreTotal: number
  riskRating: string | null
  expectedCreditLoss: number | null
  probabilityOfDefaultPct: number | null

  // recommendations
  recommendedAmount: number | null
  recommendedInterestRate: number | null
  recommendedTenureMonths: number | null
  recommendedEmi: number | null
  totalInterest: number | null
  totalRepaymentAmount: number | null
  projectedDtiRatio: number | null

  // decision
  status: string
  underwritingDecision: string | null
  decisionReason: string | null
  conditionsRequired: string | null
  rejectionReason: string | null

  // review
  assignedTo: string | null
  assignedAt: string | null
  reviewedBy: string | null
  reviewerNotes: string | null
  internalNotes: string | null

  // tracking
  createdBy: string | null
  applicationSource: string | null
  referralCode: string | null

  // timestamps (ISO-8601)
  submittedAt: string | null
  reviewedAt: string | null
  expiresAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface BeValidationErrorResponse {
  success: boolean;
  message: string;
  errorCode: string | null;
  errors?: BeFieldError[];
}