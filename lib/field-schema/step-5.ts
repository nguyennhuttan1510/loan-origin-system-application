import type { FieldSchema } from "@/lib/field-schema/types"

export const step5Fields: FieldSchema[] = [
  // ── Khoản vay đề nghị ────────────────────────────────────────────────────
  { name: "__sep_loan", type: "separator", label: "Khoản vay đề nghị", colSpan: 2 },
  {
    name: "loanType", type: "select", label: "Sản phẩm vay",
    options: [
      { value: "auto",         label: "Vay mua ô tô" },
      { value: "home",         label: "Vay mua nhà/đất" },
      { value: "study-abroad", label: "Vay du học" },
      { value: "consumer",     label: "Tiêu dùng khác" },
    ],
  },
  {
    name: "loanMethod", type: "select", label: "Phương thức vay",
    options: [
      { value: "installment",  label: "Theo món" },
      { value: "credit-line",  label: "Theo hạn mức" },
      { value: "overdraft",    label: "Thấu chi" },
    ],
  },
  { name: "loanAmount",  type: "number", label: "Số tiền vay / Hạn mức (VNĐ)", placeholder: "VD: 500000000" },
  {
    name: "loanTerm", type: "select", label: "Thời hạn vay (tháng)",
    options: [
      { value: "12",  label: "12 tháng" },
      { value: "24",  label: "24 tháng" },
      { value: "36",  label: "36 tháng" },
      { value: "48",  label: "48 tháng" },
      { value: "60",  label: "60 tháng" },
      { value: "84",  label: "84 tháng" },
      { value: "120", label: "120 tháng" },
    ],
  },
  { name: "loanPurpose",     type: "textarea", label: "Mục đích vay",  placeholder: "Mô tả mục đích sử dụng vốn vay...", colSpan: 2 },
  { name: "repaymentSource", type: "text",     label: "Nguồn trả nợ", placeholder: "VD: Lương tháng từ công ty ABC",    colSpan: 2 },

  // ── Kế hoạch trả nợ ───────────────────────────────────────────────────────
  { name: "__sep_repayment", type: "separator", label: "Kế hoạch trả nợ", colSpan: 2 },
  {
    name: "principalRepaymentPeriod", type: "select", label: "Kỳ trả nợ gốc",
    options: [
      { value: "monthly",     label: "Hàng tháng" },
      { value: "quarterly",   label: "Hàng quý" },
      { value: "semi-annual", label: "Bán niên" },
      { value: "annual",      label: "Hàng năm" },
    ],
  },
  {
    name: "interestRepaymentPeriod", type: "select", label: "Kỳ trả nợ lãi",
    options: [
      { value: "monthly",   label: "Hàng tháng" },
      { value: "quarterly", label: "Hàng quý" },
    ],
  },
  {
    name: "principalRepaymentMethod", type: "select", label: "Hình thức trả nợ gốc",
    options: [
      { value: "equal",       label: "Trả đều" },
      { value: "installment", label: "Trả góp" },
      { value: "flexible",    label: "Trả linh hoạt" },
    ],
  },
  {
    name: "repaymentMethod", type: "select", label: "Phương thức trả nợ",
    options: [
      { value: "cash",       label: "Nộp tiền mặt" },
      { value: "transfer",   label: "Chuyển khoản" },
      { value: "auto-debit", label: "Tự động trừ tài khoản" },
    ],
  },
  {
    name: "repaymentAccountNumber", type: "text", label: "Số tài khoản tự động trừ",
    placeholder: "Số tài khoản", colSpan: 2,
    visibleWhen: { field: "repaymentMethod", op: "eq", value: "auto-debit" },
  },

  // ── Tài sản bảo đảm ──────────────────────────────────────────────────────
  { name: "__sep_collateral", type: "separator", label: "Tài sản bảo đảm (Tuỳ chọn)", colSpan: 2 },
  {
    name: "collateralType", type: "select", label: "Loại tài sản bảo đảm",
    options: [
      { value: "real-estate", label: "Bất động sản" },
      { value: "vehicle",     label: "Phương tiện vận tải" },
      { value: "deposit",     label: "Tiền gửi" },
      { value: "securities",  label: "Chứng khoán" },
      { value: "none",        label: "Không có" },
    ],
  },
  { name: "collateralValue",   type: "number", label: "Giá trị ước tính (VNĐ)",         placeholder: "VD: 800000000" },
  { name: "collateralAddress", type: "text",   label: "Địa chỉ / Mô tả tài sản bảo đảm", placeholder: "VD: Xe Toyota Camry 2022, BKS 30A-12345", colSpan: 2 },
  {
    name: "collateralOwnerType", type: "select", label: "Chủ sở hữu tài sản bảo đảm",
    options: [
      { value: "borrower",    label: "Bên vay" },
      { value: "spouse",      label: "Vợ/Chồng bên vay" },
      { value: "co-owner",    label: "Bên vay và đồng chủ sở hữu" },
      { value: "third-party", label: "Bên thứ ba" },
    ],
  },

  // ── Bảo hiểm người vay ───────────────────────────────────────────────────
  { name: "__sep_insurance", type: "separator", label: "Bảo hiểm người vay (Tuỳ chọn)", colSpan: 2 },
  {
    name: "insurancePackage", type: "select", label: "Gói bảo hiểm BIC Bình An",
    options: [
      { value: "A",    label: "Gói A (Tai nạn tối đa 1 tỷ, ốm đau 50%)" },
      { value: "B",    label: "Gói B (Tai nạn tối đa 1 tỷ, ốm đau 100%)" },
      { value: "none", label: "Không tham gia" },
    ],
  },
  {
    name: "insurancePaymentMethod", type: "select", label: "Hình thức thanh toán phí bảo hiểm",
    options: [
      { value: "lump-sum", label: "Trả 1 lần toàn bộ phí (giảm 10%)" },
      { value: "annual",   label: "Trả từng năm" },
    ],
    visibleWhen: {
      and: [
        { field: "insurancePackage", op: "filled" },
        { field: "insurancePackage", op: "neq", value: "none" },
      ],
    },
  },
]
