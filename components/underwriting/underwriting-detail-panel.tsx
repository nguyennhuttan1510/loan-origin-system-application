'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ApplicationStatusBadge,
  RiskRatingBadge,
  UnderwritingDecisionBadge,
} from '@/components/underwriting/application-status-badge';
import { UnderwritingDetailResponse } from '@/lib/apis/underwriting-types';

const formatVND = (amount: number | null) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatPct = (value: number | null) => {
  if (value == null) return '—';
  return `${value.toFixed(2)}%`;
};

const formatNum = (value: number | null | undefined) => {
  if (value == null) return '—';
  return value.toLocaleString('vi-VN');
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
};

interface FieldRowProps {
  label: string;
  value: React.ReactNode;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right font-medium">{value ?? '—'}</span>
    </div>
  );
}

interface UnderwritingDetailPanelProps {
  detail: UnderwritingDetailResponse;
}

export function UnderwritingDetailPanel({ detail }: UnderwritingDetailPanelProps) {
  return (
    <div className="space-y-6">
      {/* Section 1: Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="Application #" value={<span className="font-mono text-xs">{detail.applicationNumber}</span>} />
          <FieldRow label="Status" value={<ApplicationStatusBadge status={detail.status} />} />
          <FieldRow label="Channel" value={detail.channel} />
          <FieldRow label="Borrower ID" value={<span className="font-mono text-xs">{detail.borrowerId}</span>} />
          <FieldRow label="Submitted At" value={formatDate(detail.submittedAt)} />
          <FieldRow label="Created At" value={formatDate(detail.createdAt)} />
          {detail.assignedTo && (
            <FieldRow label="Assigned To" value={<span className="font-mono text-xs">{detail.assignedTo}</span>} />
          )}
        </CardContent>
      </Card>

      {/* Section 2: Loan Request */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Loan Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="Requested Amount" value={formatVND(detail.requestedAmount)} />
          <FieldRow label="Tenure" value={`${detail.requestedTenureMonths} months`} />
          <FieldRow label="Purpose" value={detail.purpose} />
          {detail.purposeDetails && <FieldRow label="Purpose Details" value={detail.purposeDetails} />}
        </CardContent>
      </Card>

      {/* Section 3: Employment & Financial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Employment & Financial Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="Employment Type" value={detail.employmentType} />
          <FieldRow label="Employer" value={detail.employerName} />
          <FieldRow label="Job Title" value={detail.jobTitle} />
          <FieldRow label="Industry" value={detail.industry} />
          <FieldRow label="Contract Type" value={detail.contractType} />
          <FieldRow label="Employment Duration" value={detail.employmentDurationMonths != null ? `${detail.employmentDurationMonths} months` : null} />
          <Separator className="my-2" />
          <FieldRow label="Monthly Income" value={formatVND(detail.monthlyIncome)} />
          <FieldRow label="Other Income" value={formatVND(detail.otherIncome)} />
          <FieldRow label="Total Monthly Income" value={formatVND(detail.totalMonthlyIncome)} />
          <FieldRow label="Monthly Expenses" value={formatVND(detail.monthlyExpenses)} />
          <FieldRow label="Existing Debts" value={formatVND(detail.existingDebts)} />
          <FieldRow label="Monthly Debt Payments" value={formatVND(detail.monthlyDebtPayments)} />
          <FieldRow label="DTI Ratio" value={formatPct(detail.dtiRatio)} />
          <FieldRow label="Total Assets" value={formatVND(detail.totalAssets)} />
          <Separator className="my-2" />
          <FieldRow label="Has Collateral" value={detail.hasCollateral ? 'Yes' : 'No'} />
          {detail.hasCollateral && (
            <>
              <FieldRow label="Collateral Description" value={detail.collateralDescription} />
              <FieldRow label="Estimated Collateral Value" value={formatVND(detail.estimatedCollateralValue)} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 4: CIC / Credit History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CIC & Credit History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="CIC Score" value={detail.cicScore} />
          <FieldRow label="Credit History (years)" value={detail.creditHistoryYears} />
          <FieldRow label="Total Loans" value={detail.totalLoansCount} />
          <FieldRow label="Active Loans" value={detail.activeLoansCount} />
          <FieldRow label="Late Payments" value={detail.latePaymentCount} />
          <FieldRow label="Max Days Late" value={detail.maxDaysLate} />
          <FieldRow label="Has Default History" value={detail.hasDefaultHistory ? 'Yes' : 'No'} />
          <FieldRow label="On-Time Payment %" value={formatPct(detail.onTimePaymentPercentage)} />
          <FieldRow label="Credit Utilization" value={formatPct(detail.creditUtilizationRatio)} />
          <FieldRow label="Inquiries (last 6 mo)" value={detail.inquiriesLast6Months} />
        </CardContent>
      </Card>

      {/* Section 5: Scoring (2-column grid) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Auto Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Auto Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold">{detail.autoScoreTotal ?? '—'}</span>
              {detail.autoScoreGrade && (
                <span className="text-xl font-semibold text-muted-foreground">
                  Grade: {detail.autoScoreGrade}
                </span>
              )}
            </div>
            <FieldRow label="Credit Score" value={detail.autoScoreCredit} />
            <FieldRow label="Income Score" value={detail.autoScoreIncome} />
            <FieldRow label="Employment Score" value={detail.autoScoreEmployment} />
            <FieldRow label="Credit History Score" value={detail.autoScoreCreditHistory} />
            <FieldRow label="Collateral Score" value={detail.autoScoreCollateral} />
          </CardContent>
        </Card>

        {/* Risk Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold">{detail.riskScoreTotal ?? '—'}</span>
              {detail.riskRating && (
                <RiskRatingBadge rating={detail.riskRating} />
              )}
            </div>
            <FieldRow label="PD Score" value={formatNum(detail.riskScorePd)} />
            <FieldRow label="LGD Score" value={formatNum(detail.riskScoreLgd)} />
            <FieldRow label="EAD Score" value={formatNum(detail.riskScoreEad)} />
            <FieldRow label="Probability of Default" value={formatPct(detail.probabilityOfDefaultPct)} />
            <FieldRow label="Expected Credit Loss" value={formatVND(detail.expectedCreditLoss)} />
          </CardContent>
        </Card>
      </div>

      {/* Section 6: Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="Recommended Amount" value={formatVND(detail.recommendedAmount)} />
          <FieldRow label="Interest Rate" value={detail.recommendedInterestRate != null ? `${detail.recommendedInterestRate}% / year` : null} />
          <FieldRow label="Tenure" value={detail.recommendedTenureMonths != null ? `${detail.recommendedTenureMonths} months` : null} />
          <FieldRow label="Monthly EMI" value={formatVND(detail.recommendedEmi)} />
          <FieldRow label="Total Interest" value={formatVND(detail.totalInterest)} />
          <FieldRow label="Total Repayment" value={formatVND(detail.totalRepaymentAmount)} />
        </CardContent>
      </Card>

      {/* Section 7: Current Decision */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FieldRow label="Underwriting Decision" value={<UnderwritingDecisionBadge decision={detail.underwritingDecision} />} />
          {detail.decisionReason && <FieldRow label="Decision Reason" value={detail.decisionReason} />}
          {detail.conditionsRequired && <FieldRow label="Conditions Required" value={detail.conditionsRequired} />}
          {detail.reviewedBy && <FieldRow label="Reviewed By" value={<span className="font-mono text-xs">{detail.reviewedBy}</span>} />}
          {detail.reviewedAt && <FieldRow label="Reviewed At" value={formatDate(detail.reviewedAt)} />}
          {detail.reviewerNotes && <FieldRow label="Reviewer Notes" value={detail.reviewerNotes} />}
          {detail.rejectionReason && <FieldRow label="Rejection Reason" value={<span className="text-destructive">{detail.rejectionReason}</span>} />}
        </CardContent>
      </Card>
    </div>
  );
}
