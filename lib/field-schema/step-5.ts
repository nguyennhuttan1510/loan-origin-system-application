import type { FieldSchema } from "@/lib/field-schema/types"

export const step5Fields: FieldSchema[] = [
  { name: "__sep_loan",                   type: "separator", label: "Khoản vay đề nghị", colSpan: 2 },
  { name: "loanType",                     type: "select",    label: "Sản phẩm vay",                    categoryId: "loan_type" },
  { name: "loanMethod",                   type: "select",    label: "Phương thức vay",                 categoryId: "loan_method" },
  { name: "loanAmount",                   type: "number",    label: "Số tiền vay / Hạn mức (VNĐ)",     placeholder: "VD: 500000000" },
  { name: "loanTerm",                     type: "select",    label: "Thời hạn vay (tháng)",            categoryId: "loan_term" },
  { name: "loanPurpose",                  type: "textarea",  label: "Mục đích vay",                    placeholder: "Mô tả mục đích sử dụng vốn vay...", colSpan: 2 },
  { name: "repaymentSource",              type: "text",      label: "Nguồn trả nợ",                    placeholder: "VD: Lương tháng từ công ty ABC", colSpan: 2 },

  { name: "__sep_repayment",              type: "separator", label: "Kế hoạch trả nợ", colSpan: 2 },
  { name: "principalRepaymentPeriod",     type: "select",    label: "Kỳ trả nợ gốc",                  categoryId: "repayment_period" },
  { name: "interestRepaymentPeriod",      type: "select",    label: "Kỳ trả nợ lãi",                  categoryId: "interest_repayment_period" },
  { name: "principalRepaymentMethod",     type: "select",    label: "Hình thức trả nợ gốc",            categoryId: "principal_repayment_method" },
  { name: "repaymentMethod",              type: "select",    label: "Phương thức trả nợ",              categoryId: "repayment_method" },
  {
    name: "repaymentAccountNumber",       type: "text",      label: "Số tài khoản tự động trừ",
    placeholder: "Số tài khoản", colSpan: 2,
    visibleWhen: { field: "repaymentMethod", op: "eq", value: "auto-debit" },
  },

  { name: "__sep_collateral",             type: "separator", label: "Tài sản bảo đảm (Tuỳ chọn)", colSpan: 2 },
  { name: "collateralType",               type: "select",    label: "Loại tài sản bảo đảm",            categoryId: "collateral_type" },
  { name: "collateralValue",              type: "number",    label: "Giá trị ước tính (VNĐ)",           placeholder: "VD: 800000000" },
  { name: "collateralAddress",            type: "text",      label: "Địa chỉ / Mô tả tài sản bảo đảm", placeholder: "VD: Xe Toyota Camry 2022, BKS 30A-12345", colSpan: 2 },
  { name: "collateralOwnerType",          type: "select",    label: "Chủ sở hữu tài sản bảo đảm",      categoryId: "collateral_owner_type" },

  { name: "__sep_insurance",              type: "separator", label: "Bảo hiểm người vay (Tuỳ chọn)", colSpan: 2 },
  { name: "insurancePackage",             type: "select",    label: "Gói bảo hiểm BIC Bình An",         categoryId: "insurance_package" },
  {
    name: "insurancePaymentMethod",       type: "select",    label: "Hình thức thanh toán phí bảo hiểm",
    categoryId: "insurance_payment_method",
    visibleWhen: {
      and: [
        { field: "insurancePackage", op: "filled" },
        { field: "insurancePackage", op: "neq", value: "none" },
      ],
    },
  },
]
