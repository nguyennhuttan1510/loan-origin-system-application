export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PENDING_DOCUMENTS'
  | 'DOCUMENTS_RECEIVED'
  | 'RISK_ASSESSMENT'
  | 'CREDIT_CHECK'
  | 'APPROVED'
  | 'CONDITIONALLY_APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EXPIRED'
  | 'CONVERTED_TO_LOAN'
  | 'ON_HOLD'
  | 'CANCELLED';

export type ApplicationChannel = 'CUSTOMER_SELF' | 'STAFF' | 'POS';
export type RiskRating = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
export type UnderwritingDecision = 'PENDING' | 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED';

export interface UnderwritingListItem {
  id: number;
  applicationNumber: string;
  borrowerId: string;
  requestedAmount: number;
  requestedTenureMonths: number;
  status: ApplicationStatus;
  autoScoreTotal: number | null;
  autoScoreGrade: string | null;
  riskScoreTotal: number | null;
  riskRating: RiskRating | null;
  underwritingDecision: UnderwritingDecision | null;
  createdAt: string;
  submittedAt: string | null;
  assignedTo: string | null;
}

export interface UnderwritingDetailResponse {
  id: number;
  applicationNumber: string;
  status: ApplicationStatus;
  channel: ApplicationChannel;
  submittedAt: string | null;
  createdAt: string;
  borrowerId: string;
  assignedTo: string | null;
  requestedAmount: number;
  requestedTenureMonths: number;
  purpose: string;
  purposeDetails: string | null;
  employmentType: string | null;
  employerName: string | null;
  industry: string | null;
  jobTitle: string | null;
  employmentDurationMonths: number | null;
  contractType: string | null;
  monthlyIncome: number | null;
  otherIncome: number | null;
  totalMonthlyIncome: number | null;
  monthlyExpenses: number | null;
  existingDebts: number | null;
  monthlyDebtPayments: number | null;
  dtiRatio: number | null;
  totalAssets: number | null;
  hasCollateral: boolean;
  collateralDescription: string | null;
  estimatedCollateralValue: number | null;
  cicScore: number | null;
  creditHistoryYears: number | null;
  totalLoansCount: number;
  activeLoansCount: number;
  latePaymentCount: number;
  maxDaysLate: number;
  hasDefaultHistory: boolean;
  onTimePaymentPercentage: number;
  creditUtilizationRatio: number | null;
  inquiriesLast6Months: number;
  autoScoreTotal: number | null;
  autoScoreGrade: string | null;
  autoScoreCredit: number | null;
  autoScoreIncome: number | null;
  autoScoreEmployment: number | null;
  autoScoreCreditHistory: number | null;
  autoScoreCollateral: number | null;
  riskScoreTotal: number | null;
  riskRating: RiskRating | null;
  riskScorePd: number | null;
  riskScoreLgd: number | null;
  riskScoreEad: number | null;
  probabilityOfDefaultPct: number | null;
  expectedCreditLoss: number | null;
  recommendedAmount: number | null;
  recommendedInterestRate: number | null;
  recommendedTenureMonths: number | null;
  recommendedEmi: number | null;
  totalInterest: number | null;
  totalRepaymentAmount: number | null;
  underwritingDecision: UnderwritingDecision | null;
  decisionReason: string | null;
  conditionsRequired: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewerNotes: string | null;
  rejectionReason: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode: string | null;
  data: T;
}

export interface ApproveRequest {
  reviewerNotes: string;
}

export interface RejectRequest {
  rejectionReason: string;
  reviewerNotes?: string;
}

export interface UnderwritingQueueParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: ApplicationStatus;
}

export interface ApproveResponse {
  id: number;
  status: ApplicationStatus;
  reviewedBy: string;
  reviewedAt: string;
  reviewerNotes: string;
}

export interface RejectResponse {
  id: number;
  status: ApplicationStatus;
  reviewedBy: string;
  reviewedAt: string;
  rejectionReason: string;
  reviewerNotes: string | null;
}
