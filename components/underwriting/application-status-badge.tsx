'use client';

import { Badge } from '@/components/ui/badge';
import { ApplicationStatus, RiskRating, UnderwritingDecision } from '@/lib/apis/underwriting-types';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  DRAFT:                { label: 'Draft',               variant: 'outline' },
  SUBMITTED:            { label: 'Submitted',           variant: 'secondary' },
  UNDER_REVIEW:         { label: 'Under Review',        variant: 'default' },
  PENDING_DOCUMENTS:    { label: 'Pending Documents',   variant: 'secondary' },
  DOCUMENTS_RECEIVED:   { label: 'Docs Received',       variant: 'secondary' },
  RISK_ASSESSMENT:      { label: 'Risk Assessment',     variant: 'default' },
  CREDIT_CHECK:         { label: 'Credit Check',        variant: 'default' },
  APPROVED:             { label: 'Approved',            variant: 'default' },
  CONDITIONALLY_APPROVED: { label: 'Cond. Approved',   variant: 'default' },
  REJECTED:             { label: 'Rejected',            variant: 'destructive' },
  WITHDRAWN:            { label: 'Withdrawn',           variant: 'outline' },
  EXPIRED:              { label: 'Expired',             variant: 'outline' },
  CONVERTED_TO_LOAN:    { label: 'Converted to Loan',  variant: 'default' },
  ON_HOLD:              { label: 'On Hold',             variant: 'secondary' },
  CANCELLED:            { label: 'Cancelled',           variant: 'destructive' },
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  DRAFT:                  'bg-gray-100 text-gray-700',
  SUBMITTED:              'bg-blue-100 text-blue-700',
  UNDER_REVIEW:           'bg-yellow-100 text-yellow-700',
  PENDING_DOCUMENTS:      'bg-orange-100 text-orange-700',
  DOCUMENTS_RECEIVED:     'bg-teal-100 text-teal-700',
  RISK_ASSESSMENT:        'bg-purple-100 text-purple-700',
  CREDIT_CHECK:           'bg-indigo-100 text-indigo-700',
  APPROVED:               'bg-green-100 text-green-700',
  CONDITIONALLY_APPROVED: 'bg-lime-100 text-lime-700',
  REJECTED:               'bg-red-100 text-red-700',
  WITHDRAWN:              'bg-gray-100 text-gray-500',
  EXPIRED:                'bg-gray-100 text-gray-500',
  CONVERTED_TO_LOAN:      'bg-emerald-100 text-emerald-700',
  ON_HOLD:                'bg-amber-100 text-amber-700',
  CANCELLED:              'bg-red-100 text-red-600',
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'outline' as const };
  const colorClass = STATUS_COLORS[status] ?? '';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className ?? ''}`}
    >
      {config.label}
    </span>
  );
}

const RISK_COLORS: Record<RiskRating, string> = {
  VERY_LOW: 'bg-green-100 text-green-700',
  LOW:      'bg-teal-100 text-teal-700',
  MEDIUM:   'bg-yellow-100 text-yellow-700',
  HIGH:     'bg-orange-100 text-orange-700',
  VERY_HIGH:'bg-red-100 text-red-700',
};

interface RiskRatingBadgeProps {
  rating: RiskRating | null;
  className?: string;
}

export function RiskRatingBadge({ rating, className }: RiskRatingBadgeProps) {
  if (!rating) return <span className="text-muted-foreground text-xs">—</span>;
  const colorClass = RISK_COLORS[rating] ?? 'bg-gray-100 text-gray-700';
  const label = rating.replace('_', ' ');
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className ?? ''}`}>
      {label}
    </span>
  );
}

const DECISION_COLORS: Record<UnderwritingDecision, string> = {
  PENDING:       'bg-gray-100 text-gray-700',
  APPROVED:      'bg-green-100 text-green-700',
  MANUAL_REVIEW: 'bg-orange-100 text-orange-700',
  REJECTED:      'bg-red-100 text-red-700',
};

interface UnderwritingDecisionBadgeProps {
  decision: UnderwritingDecision | null;
  className?: string;
}

export function UnderwritingDecisionBadge({ decision, className }: UnderwritingDecisionBadgeProps) {
  if (!decision) return <span className="text-muted-foreground text-xs">—</span>;
  const colorClass = DECISION_COLORS[decision] ?? 'bg-gray-100 text-gray-700';
  const label = decision === 'MANUAL_REVIEW' ? 'Manual Review' : decision.charAt(0) + decision.slice(1).toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className ?? ''}`}>
      {label}
    </span>
  );
}

// Re-export Badge for convenience
export { Badge };
