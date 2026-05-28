import type { FieldSchema } from "@/lib/field-schema/types"

export const step3Fields: FieldSchema[] = [
  { name: "__sep_coborrower",           type: "separator", label: "Người đồng trả nợ (ngoài vợ/chồng — nếu có)", colSpan: 2 },
  { name: "coborrowerName",             type: "text",      label: "Họ và tên",               placeholder: "Tên đầy đủ" },
  { name: "coborrowerDateOfBirth",      type: "date",      label: "Ngày sinh" },
  { name: "coborrowerGender",           type: "select",    label: "Giới tính",               categoryId: "gender" },
  { name: "coborrowerIdNumber",         type: "text",      label: "Số CMND / Hộ chiếu",     placeholder: "Số CMND hoặc Hộ chiếu" },
  { name: "coborrowerIdIssueDate",      type: "date",      label: "Ngày cấp" },
  { name: "coborrowerIdIssuePlace",     type: "text",      label: "Nơi cấp",                placeholder: "Công an TP. Hà Nội" },
  { name: "coborrowerCurrentAddress",   type: "text",      label: "Địa chỉ cư trú hiện tại", placeholder: "Số nhà, đường, quận/huyện", colSpan: 2 },
  { name: "coborrowerMobilePhone",      type: "tel",       label: "Điện thoại di động",      placeholder: "0901 234 567" },
  { name: "coborrowerMonthlyIncome",    type: "number",    label: "Thu nhập hàng tháng (VNĐ)", placeholder: "VD: 10000000" },

  { name: "__sep_ref1",                 type: "separator", label: "Người tham chiếu chính", colSpan: 2 },
  { name: "referenceName1",             type: "text",      label: "Họ và tên",              placeholder: "Tên đầy đủ" },
  { name: "referenceRelation1",         type: "select",    label: "Quan hệ với Bên vay",    categoryId: "relation" },
  { name: "referencePhone1",            type: "tel",       label: "Điện thoại liên hệ",     placeholder: "0901 234 567" },
  { name: "referenceAddress1",          type: "text",      label: "Địa chỉ liên lạc",       placeholder: "Địa chỉ liên lạc" },

  { name: "__sep_ref2",                 type: "separator", label: "Người tham chiếu phụ (Tuỳ chọn)", colSpan: 2 },
  { name: "referenceName2",             type: "text",      label: "Họ và tên",              placeholder: "Tên đầy đủ" },
  {
    name: "referencePhone2",            type: "tel",       label: "Điện thoại",
    placeholder: "0901 234 567",
    visibleWhen: { field: "referenceName2", op: "filled" },
  },
  {
    name: "referenceRelation2",         type: "select",    label: "Quan hệ",
    categoryId: "relation",
    visibleWhen: { field: "referenceName2", op: "filled" },
  },

  { name: "__sep_bank",                 type: "separator", label: "Quan hệ ngân hàng", colSpan: 2 },
  { name: "existingCustomer",           type: "select",    label: "Khách hàng hiện hữu?", categoryId: "yes_no" },
  {
    name: "accountNumber",              type: "text",      label: "Số tài khoản hiện có",
    placeholder: "Số tài khoản",
    visibleWhen: { field: "existingCustomer", op: "eq", value: "yes" },
  },
]
