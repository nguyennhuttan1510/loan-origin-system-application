import type { FieldSchema } from "@/lib/field-schema/types"

export const step2Fields: FieldSchema[] = [
  // ── Thông tin nghề nghiệp ──────────────────────────────────────────────────
  { name: "__sep_employment", type: "separator", label: "Thông tin nghề nghiệp", colSpan: 2 },
  {
    name: "employmentStatus", type: "select", label: "Tình trạng việc làm",
    options: [
      { value: "employed",       label: "Làm công ăn lương" },
      { value: "self-employed",  label: "Tự kinh doanh" },
      { value: "business-owner", label: "Chủ doanh nghiệp" },
      { value: "retired",        label: "Về hưu" },
      { value: "unemployed",     label: "Không có việc làm" },
    ],
  },
  { name: "yearsEmployed",   type: "number", label: "Số năm làm việc",             placeholder: "VD: 5" },
  { name: "employerName",    type: "text",   label: "Tên cơ quan / Nơi công tác", placeholder: "Công ty TNHH ABC" },
  { name: "jobTitle",        type: "text",   label: "Vị trí công tác",            placeholder: "VD: Kỹ sư phần mềm" },
  { name: "employerAddress", type: "text",   label: "Địa chỉ cơ quan",            placeholder: "Số nhà, đường, quận/huyện", colSpan: 2 },
  { name: "employerPhone",   type: "tel",    label: "Điện thoại cơ quan",         placeholder: "024 1234 5678" },

  // ── Thu nhập hàng tháng ────────────────────────────────────────────────────
  { name: "__sep_income", type: "separator", label: "Thu nhập hàng tháng (VNĐ)", colSpan: 2 },
  { name: "monthlyIncome",    type: "number", label: "Lương",                        placeholder: "VD: 15000000" },
  { name: "businessIncome",   type: "number", label: "Thu nhập kinh doanh",          placeholder: "VD: 5000000" },
  { name: "rentalIncome",     type: "number", label: "Thu nhập cho thuê tài sản",   placeholder: "VD: 3000000" },
  { name: "additionalIncome", type: "number", label: "Thu nhập khác",               placeholder: "VD: 2000000" },
  {
    name: "incomeSource", type: "select", label: "Nguồn thu nhập khác", colSpan: 2,
    options: [
      { value: "rental",     label: "Cho thuê tài sản" },
      { value: "investment", label: "Đầu tư tài chính" },
      { value: "freelance",  label: "Làm thêm" },
      { value: "pension",    label: "Lương hưu" },
      { value: "other",      label: "Khác" },
    ],
  },

  // ── Chi phí hàng tháng ────────────────────────────────────────────────────
  { name: "__sep_expenses", type: "separator", label: "Chi phí hàng tháng (VNĐ)", colSpan: 2 },
  { name: "livingExpenses",     type: "number", label: "Chi phí sinh hoạt",             placeholder: "VD: 8000000" },
  { name: "installmentExpenses",type: "number", label: "Các khoản trả góp hiện tại",   placeholder: "VD: 3000000" },

  // ── Tài sản đang sở hữu ───────────────────────────────────────────────────
  { name: "__sep_assets", type: "separator", label: "Tài sản đang sở hữu (VNĐ)", colSpan: 2 },
  { name: "realEstateAssets", type: "number", label: "Bất động sản",               placeholder: "Giá trị ước tính" },
  { name: "movableAssets",    type: "number", label: "Động sản (xe, thiết bị...)", placeholder: "Giá trị ước tính" },
  { name: "depositAssets",    type: "number", label: "Tiền gửi ngân hàng",        placeholder: "Số dư" },
]
