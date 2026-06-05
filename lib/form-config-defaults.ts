import {FieldConfigMap, FormChannel, FormConfig, WizardStepConfig} from "@/lib/form-config-types"

const S = (id: number, enabled: boolean, fields: FieldConfigMap): WizardStepConfig => ({
  id, enabled, fields,
  title: STEP_META[id].title,
  description: STEP_META[id].description,
})

const STEP_META: Record<number, { title: string; description: string }> = {
  1: { title: "Thông tin cá nhân",                description: "Thông tin định danh của người vay vốn." },
  2: { title: "Thu nhập & Tài chính",              description: "Thông tin nghề nghiệp, thu nhập và tài sản của người vay." },
  3: { title: "Người đồng trả nợ & Tham chiếu",   description: "Thông tin người đồng trả nợ (nếu có) và người tham chiếu." },
  4: { title: "Địa chỉ",                           description: "Địa chỉ thường trú và địa chỉ cư trú hiện tại của người vay." },
  5: { title: "Thông tin khoản vay",               description: "Thông tin khoản vay đề nghị, kế hoạch trả nợ và tài sản bảo đảm." },
  6: { title: "Xem lại & Nộp đơn",                description: "Xem lại thông tin và nộp đơn." },
}

export const STAFF_FORM_CONFIG: FormConfig = {
  channel: "STAFF",
  steps: [
    S(1, true, {
      firstName: "required", lastName: "required", dateOfBirth: "required",
      gender: "required", nationalId: "required", phone: "required",
      email: "required", maritalStatus: "required", hasRelationship: "required",
      nationalIdIssueDate: "optional", nationalIdIssuePlace: "optional", landlinePhone: "optional", otherField: "required"
    }),
    S(2, true, {
      employmentStatus: "required", employerName: "required", jobTitle: "required", employerAddress: "required",
      employerPhone: "required", yearsEmployed: "required", monthlyIncome: "optional", businessIncome: "required",
      rentalIncome: "optional", additionalIncome: "required", incomeSource: "required", livingExpenses: "required",
      installmentExpenses: "optional", realEstateAssets: "optional", movableAssets: "optional", depositAssets: "optional",
    }),
    S(3, true, {}),
    S(4, true, {}),
    S(5, true, {}),
    S(6, true, {}),
  ],
  features: { requiresOtp: false, requiresEkyc: false, saveAndResume: false },
  submitEndpoint: "/loan-application/create",
}

export const CLIENT_FORM_CONFIG: FormConfig = {
  channel: "CLIENT",
  steps: [
    S(1, true, {
      firstName: "required", lastName: "required", dateOfBirth: "required",
      gender: "required", nationalId: "required", phone: "required",
      email: "required", maritalStatus: "required",
      hasRelationship: "hidden",
      nationalIdIssueDate: "optional", nationalIdIssuePlace: "optional", landlinePhone: "optional",
    }),
    S(2, true, {}),
    S(3, true, {}),
    S(4, true, {}),
    S(5, true, {}),
    S(6, true, {}),
  ],
  features: { requiresOtp: true, requiresEkyc: false, saveAndResume: true },
  submitEndpoint: "/loan-application/create",
}

export const POS_FORM_CONFIG: FormConfig = {
  channel: "POS",
  steps: [
    S(1, true, {
      firstName: "required", lastName: "required", dateOfBirth: "required",
      nationalId: "required", phone: "required",
      gender: "optional", email: "optional", maritalStatus: "optional",
      hasRelationship: "hidden", nationalIdIssueDate: "hidden",
      nationalIdIssuePlace: "hidden", landlinePhone: "hidden",
    }),
    S(2, false, {}),
    S(3, false, {}),
    S(4, false, {}),
    S(5, true, {
      loanType: "required", loanAmount: "required", loanTerm: "required",
      loanMethod: "optional", loanPurpose: "optional",
      repaymentSource: "hidden", principalRepaymentPeriod: "hidden",
      interestRepaymentPeriod: "hidden", principalRepaymentMethod: "hidden",
      repaymentMethod: "hidden", repaymentAccountNumber: "hidden",
      collateralType: "hidden", collateralValue: "hidden",
      collateralAddress: "hidden", collateralOwnerType: "hidden",
      insurancePackage: "hidden", insurancePaymentMethod: "hidden",
    }),
    S(6, true, {}),
  ],
  features: { requiresOtp: true, requiresEkyc: false, saveAndResume: false },
  submitEndpoint: "/loan-application/pos/create",
}

export function getDefaultConfig(channel: FormChannel): FormConfig {
  switch (channel) {
    case "CLIENT": return CLIENT_FORM_CONFIG
    case "POS": return POS_FORM_CONFIG
    default: return STAFF_FORM_CONFIG
  }
}
