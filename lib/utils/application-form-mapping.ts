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
  console.log("mapFormDataToUpdateRequest - data", data)
  const { customerIncome, customerLocation, loanInfo } = data;

  const hasCollateral = loanInfo.collateralType !== '' && loanInfo.collateralType != null;

  // jobInfo
  const jobInfo: UpdateApplicationRequest['jobInfo'] =
    customerIncome.employmentStatus
      ? {
          employmentType: customerIncome.employmentStatus,
          employerName: customerIncome.employerName || '',
          employerAddress: customerIncome.employerAddress || undefined,
          employerPhone: customerIncome.employerPhone || undefined,
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
          businessIncome: safeNum(customerIncome.businessIncome),
          rentalIncome: safeNum(customerIncome.rentalIncome),
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
          requestedRepaymentFrequency: loanInfo.principalRepaymentPeriod || 'MONTHLY',
          purpose: loanInfo.loanPurpose,
          purposeDetails: loanInfo.repaymentSource || loanInfo.loanPurpose,
          loanMethod: loanInfo.loanMethod as 'INSTALLMENT' | 'CREDIT_LINE' | 'OVERDRAFT' | undefined || undefined,
          repaymentSource: loanInfo.repaymentSource || undefined,
          principalRepaymentPeriod: loanInfo.principalRepaymentPeriod || undefined,
          interestRepaymentPeriod: loanInfo.interestRepaymentPeriod || undefined,
          principalRepaymentMethod: loanInfo.principalRepaymentMethod as 'EQUAL' | 'INSTALLMENT_METHOD' | 'FLEXIBLE' | undefined || undefined,
          repaymentAccountNumber: loanInfo.repaymentAccountNumber || undefined,
          collateralType: loanInfo.collateralType as 'REAL_ESTATE' | 'VEHICLE' | 'DEPOSIT' | 'SECURITIES' | 'NONE' | undefined || undefined,
          collateralOwnerType: loanInfo.collateralOwnerType as 'BORROWER' | 'SPOUSE' | 'CO_OWNER' | 'THIRD_PARTY' | undefined || undefined,
          insurancePackage: loanInfo.insurancePackage as 'A' | 'B' | 'NONE' | undefined || undefined,
          insurancePaymentMethod: loanInfo.insurancePaymentMethod as 'LUMP_SUM' | 'ANNUAL' | undefined || undefined,
        }
      : undefined;

  // customerInfo
  const { customerInfo: ci, customerRelationship: cr, customerLocation: cl } = data;
  const customerInfoPayload: UpdateApplicationRequest['customerInfo'] =
    ci.maritalStatus
      ? {
          dateOfBirth: ci.dateOfBirth || undefined,
          gender: ci.gender as 'MALE' | 'FEMALE' | 'OTHER' | undefined,
          maritalStatus: ci.maritalStatus,
          numberOfDependents: 0,
          educationLevel: 'OTHER',
          residenceType: cl.residenceType,
          residenceDurationMonths: cl.yearsAtAddress
            ? Math.round(parseFloat(cl.yearsAtAddress) * 12)
            : undefined,
          permanentAddress: cl.permanentAddress,
          currentAddress: cl.addressLine1,
          emergencyContactPhone: cr.referencePhone1 || '',
          emergencyContactName: cr.referenceName1 || '',
          emergencyContactRelationship: cr.referenceRelation1 || '',
          nationalIdIssueDate: ci.nationalIdIssueDate || undefined,
          nationalIdIssuePlace: ci.nationalIdIssuePlace || undefined,
          landlinePhone: ci.landlinePhone || undefined,
          hasRelationship: ci.hasRelationship as 'EXISTING' | 'NEW' | undefined,
          addressLine2: cl.addressLine2 || undefined,
          city: cl.city || undefined,
          state: cl.state || undefined,
          postalCode: cl.postalCode || undefined,
          country: cl.country || undefined,
        }
      : undefined;

  // relationshipInfo
  const relationshipInfo: UpdateApplicationRequest['relationshipInfo'] =
    cr.referenceName1 || cr.coborrowerName || cr.existingCustomer
      ? {
          emergencyContactAddress: cr.referenceAddress1 || undefined,
          referenceName2: cr.referenceName2 || undefined,
          referencePhone2: cr.referencePhone2 || undefined,
          referenceRelation2: cr.referenceRelation2 || undefined,
          existingCustomer: cr.existingCustomer || undefined,
          accountNumber: cr.accountNumber || undefined,
          coborrowerName: cr.coborrowerName || undefined,
          coborrowerDateOfBirth: cr.coborrowerDateOfBirth || undefined,
          coborrowerGender: cr.coborrowerGender || undefined,
          coborrowerIdNumber: cr.coborrowerIdNumber || undefined,
          coborrowerIdIssueDate: cr.coborrowerIdIssueDate || undefined,
          coborrowerIdIssuePlace: cr.coborrowerIdIssuePlace || undefined,
          coborrowerCurrentAddress: cr.coborrowerCurrentAddress || undefined,
          coborrowerMobilePhone: cr.coborrowerMobilePhone || undefined,
          coborrowerMonthlyIncome: safeNum(cr.coborrowerMonthlyIncome),
        }
      : undefined;

  return {
    ...(customerInfoPayload && { customerInfo: customerInfoPayload }),
    ...(jobInfo && { jobInfo }),
    ...(financeInfo && { financeInfo }),
    ...(assetsInfo && { assetsInfo }),
    ...(loanInfoPayload && { loanInfo: loanInfoPayload }),
    ...(relationshipInfo && { relationshipInfo }),
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
      dateOfBirth: s(app.dateOfBirth),
      gender: s(app.gender),
      nationalId: app.borrower?.nationalId ?? '',
      nationalIdIssueDate: s(app.nationalIdIssueDate),
      nationalIdIssuePlace: s(app.nationalIdIssuePlace),
      email: app.borrower?.email ?? '',
      phone: app.borrower?.phoneNumber ?? '',
      landlinePhone: s(app.landlinePhone),
      maritalStatus: s(app.maritalStatus),
      hasRelationship: s(app.hasRelationship),
    },
    customerIncome: {
      employmentStatus: s(app.employmentType),
      employerName: s(app.employerName),
      employerAddress: s(app.employerAddress),
      employerPhone: s(app.employerPhone),
      jobTitle: s(app.jobTitle),
      yearsEmployed: app.employmentDurationMonths != null
        ? (app.employmentDurationMonths / 12).toFixed(1)
        : '',
      monthlyIncome: s(app.monthlyIncome),
      businessIncome: app.businessIncome != null ? s(app.businessIncome) : '',
      rentalIncome: app.rentalIncome != null ? s(app.rentalIncome) : '',
      additionalIncome: app.otherIncome > 0 ? s(app.otherIncome) : '',
      incomeSource: s(app.incomeSource),
      livingExpenses: app.monthlyExpenses != null ? s(app.monthlyExpenses) : '',
      installmentExpenses: s(app.monthlyDebtPayments),
      realEstateAssets: app.totalAssets != null ? s(app.totalAssets) : '',
      movableAssets: '',                          // not support
      depositAssets: '',                          // not support
    },
    customerRelationship: {
      referenceName1: s(app.emergencyContactName),
      referencePhone1: s(app.emergencyContactPhone),
      referenceRelation1: s(app.emergencyContactRelationship),
      referenceAddress1: s(app.emergencyContactAddress),
      referenceName2: s(app.referenceName2),
      referencePhone2: s(app.referencePhone2),
      referenceRelation2: s(app.referenceRelation2),
      existingCustomer: s(app.existingCustomer),
      accountNumber: s(app.accountNumber),
      coborrowerName: s(app.coborrowerName),
      coborrowerDateOfBirth: s(app.coborrowerDateOfBirth),
      coborrowerGender: s(app.coborrowerGender),
      coborrowerIdNumber: s(app.coborrowerIdNumber),
      coborrowerIdIssueDate: s(app.coborrowerIdIssueDate),
      coborrowerIdIssuePlace: s(app.coborrowerIdIssuePlace),
      coborrowerCurrentAddress: s(app.coborrowerCurrentAddress),
      coborrowerMobilePhone: s(app.coborrowerMobilePhone),
      coborrowerMonthlyIncome: app.coborrowerMonthlyIncome != null ? s(app.coborrowerMonthlyIncome) : '',
    },
    customerLocation: {
      permanentAddress: s(app.permanentAddress),
      addressLine1: s(app.addressLine1),
      addressLine2: s(app.addressLine2),
      city: s(app.city),
      state: s(app.state),
      postalCode: s(app.postalCode),
      country: s(app.country) || 'vn',
      residenceType: s(app.residenceType),
      yearsAtAddress: s(app.yearsAtAddress),
    },
    loanInfo: {
      loanType: '',
      loanMethod: s(app.loanMethod),
      loanAmount: s(app.requestedAmount),
      loanTerm: s(app.requestedTenureMonths),
      loanPurpose: s(app.purpose),
      repaymentSource: s(app.repaymentSource),
      principalRepaymentPeriod: s(app.principalRepaymentPeriod),
      interestRepaymentPeriod: s(app.interestRepaymentPeriod),
      principalRepaymentMethod: s(app.principalRepaymentMethod),
      repaymentMethod: s(app.repaymentMethod),
      repaymentAccountNumber: s(app.repaymentAccountNumber),
      collateralType: app.collateralType ?? (app.hasCollateral ? 'REAL_ESTATE' : ''),
      collateralValue: app.estimatedCollateralValue > 0 ? s(app.estimatedCollateralValue) : '',
      collateralAddress: s(app.collateralDescription),
      collateralOwnerType: s(app.collateralOwnerType),
      insurancePackage: s(app.insurancePackage),
      insurancePaymentMethod: s(app.insurancePaymentMethod),
    },
  };
}
