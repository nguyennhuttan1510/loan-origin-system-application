import type { LoanFormData } from '@/lib/loan-form-types';
import type { UnderwritingDetailResponse } from '@/lib/apis/underwriting-types';
import type { UpdateApplicationRequest } from '@/lib/apis/application-types';

// ── Pre-fill: UnderwritingDetailResponse → LoanFormData ───────────────────────
// Best-effort: các field không có dữ liệu tương ứng giữ nguyên initialData (empty string).

export function mapDetailToFormData(detail: UnderwritingDetailResponse): Partial<LoanFormData> {
  const safeStr = (v: string | number | null | undefined): string =>
    v != null ? String(v) : '';

  return {
    customerIncome: {
      employmentStatus: safeStr(detail.employmentType),
      employerName: safeStr(detail.employerName),
      employerAddress: '',
      employerPhone: '',
      jobTitle: safeStr(detail.jobTitle),
      yearsEmployed: detail.employmentDurationMonths != null
        ? String(Math.round(detail.employmentDurationMonths / 12))
        : '',
      monthlyIncome: safeStr(detail.monthlyIncome),
      businessIncome: '',
      rentalIncome: '',
      additionalIncome: safeStr(detail.otherIncome),
      incomeSource: '',
      livingExpenses: safeStr(detail.monthlyExpenses),
      installmentExpenses: safeStr(detail.monthlyDebtPayments),
      realEstateAssets: safeStr(detail.totalAssets),
      movableAssets: '',
      depositAssets: '',
    },
    customerLocation: {
      permanentAddress: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'VN',
      residenceType: '',
      yearsAtAddress: '',
    },
    loanInfo: {
      loanType: '',
      loanMethod: '',
      loanAmount: safeStr(detail.requestedAmount),
      loanTerm: safeStr(detail.requestedTenureMonths),
      loanPurpose: safeStr(detail.purpose),
      repaymentSource: safeStr(detail.purposeDetails),
      principalRepaymentPeriod: '',
      interestRepaymentPeriod: '',
      principalRepaymentMethod: '',
      repaymentMethod: '',
      repaymentAccountNumber: '',
      collateralType: detail.hasCollateral ? 'REAL_ESTATE' : '',
      collateralValue: safeStr(detail.estimatedCollateralValue),
      collateralAddress: safeStr(detail.collateralDescription),
      collateralOwnerType: '',
      insurancePackage: '',
      insurancePaymentMethod: '',
    },
  };
}

// ── Submit: LoanFormData → UpdateApplicationRequest ───────────────────────────
// Chỉ include section nếu có ít nhất 1 field có giá trị (tránh gửi object rỗng).

const safeNum = (v: string | undefined): number | undefined => {
  if (!v || v.trim() === '') return undefined;
  const n = parseFloat(v);
  return isNaN(n) ? undefined : n;
};

const safeInt = (v: string | undefined): number | undefined => {
  if (!v || v.trim() === '') return undefined;
  const n = parseInt(v, 10);
  return isNaN(n) ? undefined : n;
};

export function mapFormDataToUpdateRequest(data: LoanFormData): UpdateApplicationRequest {
  const { customerIncome, customerLocation, loanInfo } = data;

  const hasCollateral = loanInfo.collateralType !== '' && loanInfo.collateralType != null;

  // jobInfo
  const jobInfo: UpdateApplicationRequest['jobInfo'] =
    customerIncome.employmentStatus
      ? {
          employmentType: customerIncome.employmentStatus,
          employerName: customerIncome.employerName || '',
          employerAddress: customerIncome.employerAddress || undefined,
          jobTitle: customerIncome.jobTitle || undefined,
          employmentDurationMonths: customerIncome.yearsEmployed
            ? Math.round(parseFloat(customerIncome.yearsEmployed) * 12)
            : undefined,
        }
      : undefined;

  // financeInfo
  const monthlyIncome = safeNum(customerIncome.monthlyIncome);
  const financeInfo: UpdateApplicationRequest['financeInfo'] =
    monthlyIncome != null
      ? {
          monthlyIncome,
          otherIncome: safeNum(customerIncome.additionalIncome),
          otherIncomeSource: customerIncome.incomeSource || undefined,
          monthlyExpenses: safeNum(customerIncome.livingExpenses),
          monthlyDebtPayments: safeNum(customerIncome.installmentExpenses),
          hasCollateral,
          collateralDescription: loanInfo.collateralAddress || undefined,
          estimatedCollateralValue: safeNum(loanInfo.collateralValue),
        }
      : undefined;

  // assetsInfo
  const re = safeNum(customerIncome.realEstateAssets) ?? 0;
  const mv = safeNum(customerIncome.movableAssets) ?? 0;
  const dp = safeNum(customerIncome.depositAssets) ?? 0;
  const totalAssets = re + mv + dp > 0 ? re + mv + dp : undefined;
  const assetsInfo: UpdateApplicationRequest['assetsInfo'] =
    totalAssets != null || hasCollateral
      ? {
          totalAssets,
          hasCollateral,
          collateralDescription: loanInfo.collateralAddress || undefined,
          estimatedCollateralValue: safeNum(loanInfo.collateralValue),
        }
      : undefined;

  // loanInfo
  const requestedAmount = safeNum(loanInfo.loanAmount);
  const requestedTenureMonths = safeInt(loanInfo.loanTerm);
  const loanInfoPayload: UpdateApplicationRequest['loanInfo'] =
    requestedAmount != null && requestedTenureMonths != null
      ? {
          requestedAmount,
          requestedTenureMonths,
          requestedRepaymentFrequency: loanInfo.repaymentMethod || 'MONTHLY',
          purpose: loanInfo.loanPurpose,
          purposeDetails: loanInfo.repaymentSource || loanInfo.loanPurpose,
        }
      : undefined;

  return {
    ...(jobInfo && { jobInfo }),
    ...(financeInfo && { financeInfo }),
    ...(assetsInfo && { assetsInfo }),
    ...(loanInfoPayload && { loanInfo: loanInfoPayload }),
  };
}
