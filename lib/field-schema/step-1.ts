import type { FieldSchema } from "@/lib/field-schema/types"

export const step1Fields: FieldSchema[] = [
  { name: "firstName",            type: "text",   label: "Họ",                         placeholder: "Nguyễn" },
  { name: "lastName",             type: "text",   label: "Tên",                        placeholder: "Văn An" },
  { name: "dateOfBirth",          type: "date",   label: "Ngày sinh" },
  { name: "gender",               type: "select", label: "Giới tính",                  categoryId: "gender" },
  { name: "maritalStatus",        type: "select", label: "Tình trạng hôn nhân",        categoryId: "marital_status" },
  { name: "nationalId",           type: "text",   label: "Số CMND / Hộ chiếu",        placeholder: "Số CMND hoặc Hộ chiếu" },
  { name: "nationalIdIssueDate",  type: "date",   label: "Ngày cấp CMND" },
  { name: "nationalIdIssuePlace", type: "text",   label: "Nơi cấp CMND",              placeholder: "Công an TP. Hà Nội" },
  { name: "phone",                type: "tel",    label: "Điện thoại di động",         placeholder: "0901 234 567" },
  { name: "landlinePhone",        type: "tel",    label: "Điện thoại cố định",        placeholder: "024 1234 5678" },
  { name: "email",                type: "email",  label: "Email",                      placeholder: "email@example.com", colSpan: 2 },
  { name: "bidvRelationship",     type: "select", label: "Quan hệ tín dụng với BIDV", categoryId: "bidv_relationship", colSpan: 2 },
]
