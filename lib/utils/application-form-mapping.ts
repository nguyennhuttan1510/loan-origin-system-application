import type { LoanFormData } from '@/lib/loan-form-types';
import type { UnderwritingDetailResponse } from '@/lib/apis/underwriting-types';
import type { LoanApplication, UpdateApplicationRequest } from '@/lib/apis/application-types';

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

// ── Pre-fill: LoanApplication (real API) → LoanFormData ───────────────────────

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return { firstName: '', lastName: parts[0] };
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
}

export function loanApplicationToFormData(app: LoanApplication): LoanFormData {
  const displayName = app.borrower?.fullName ?? app.borrowerName ?? '';
  const { firstName, lastName } = splitFullName(displayName);
  const s = (v: string | number | null | undefined): string =>
    v != null ? String(v) : '';

  return {
    customerInfo: {
      firstName,
      lastName,
      dateOfBirth: '',
      gender: s(app.gender),
      nationalId: app.borrower?.nationalId ?? '',
      nationalIdIssueDate: '',
      nationalIdIssuePlace: '',
      email: app.borrower?.email ?? '',
      phone: app.borrower?.phoneNumber ?? '',
      landlinePhone: '',
      maritalStatus: s(app.maritalStatus),
      bidvRelationship: '',
    },
    customerIncome: {
      employmentStatus: s(app.employmentType),
      employerName: s(app.employerName),
      employerAddress: s(app.employerAddress),
      employerPhone: '',
      jobTitle: s(app.jobTitle),
      yearsEmployed: app.employmentDurationMonths != null
        ? (app.employmentDurationMonths / 12).toFixed(1)
        : '',
      monthlyIncome: s(app.monthlyIncome),
      businessIncome: '',
      rentalIncome: '',
      additionalIncome: app.otherIncome > 0 ? s(app.otherIncome) : '',
      incomeSource: s(app.incomeSource),
      livingExpenses: app.monthlyExpenses != null ? s(app.monthlyExpenses) : '',
      installmentExpenses: s(app.monthlyDebtPayments),
      realEstateAssets: app.totalAssets != null ? s(app.totalAssets) : '',
      movableAssets: '',
      depositAssets: '',
    },
    customerRelationship: {
      coborrowerName: '',
      coborrowerDateOfBirth: '',
      coborrowerGender: '',
      coborrowerIdNumber: '',
      coborrowerIdIssueDate: '',
      coborrowerIdIssuePlace: '',
      coborrowerCurrentAddress: '',
      coborrowerMobilePhone: '',
      coborrowerMonthlyIncome: '',
      referenceName1: '',
      referencePhone1: '',
      referenceRelation1: '',
      referenceAddress1: '',
      referenceName2: '',
      referencePhone2: '',
      referenceRelation2: '',
      existingCustomer: '',
      accountNumber: '',
    },
    customerLocation: {
      permanentAddress: s(app.permanentAddress),
      addressLine1: s(app.addressLine1),
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'vn',
      residenceType: s(app.residenceType),
      yearsAtAddress: s(app.yearsAtAddress),
    },
    loanInfo: {
      loanType: '',
      loanMethod: '',
      loanAmount: s(app.requestedAmount),
      loanTerm: s(app.requestedTenureMonths),
      loanPurpose: s(app.purpose),
      repaymentSource: '',
      principalRepaymentPeriod: '',
      interestRepaymentPeriod: '',
      principalRepaymentMethod: '',
      repaymentMethod: s(app.repaymentMethod),
      repaymentAccountNumber: '',
      collateralType: app.hasCollateral ? 'REAL_ESTATE' : '',
      collateralValue: app.estimatedCollateralValue > 0 ? s(app.estimatedCollateralValue) : '',
      collateralAddress: s(app.collateralDescription),
      collateralOwnerType: '',
      insurancePackage: '',
      insurancePaymentMethod: '',
    },
  };
}
