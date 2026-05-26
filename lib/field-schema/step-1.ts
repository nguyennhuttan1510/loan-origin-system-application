import type { FieldSchema } from "@/lib/field-schema/types"

export const step1Fields: FieldSchema[] = [
  { name: "firstName",            type: "text",   label: "Họ",                         placeholder: "Nguyễn" },
  { name: "lastName",             type: "text",   label: "Tên",                        placeholder: "Văn An" },
  { name: "dateOfBirth",          type: "date",   label: "Ngày sinh" },
  {
    name: "gender", type: "select", label: "Giới tính",
    options: [
      { value: "male",   label: "Nam" },
      { value: "female", label: "Nữ" },
    ],
  },
  {
    name: "maritalStatus", type: "select", label: "Tình trạng hôn nhân",
    options: [
      { value: "single",   label: "Độc thân" },
      { value: "married",  label: "Đã kết hôn" },
      { value: "divorced", label: "Ly hôn" },
      { value: "widowed",  label: "Góa" },
    ],
  },
  { name: "nationalId",           type: "text",  label: "Số CMND / Hộ chiếu",        placeholder: "Số CMND hoặc Hộ chiếu" },
  { name: "nationalIdIssueDate",  type: "date",  label: "Ngày cấp CMND" },
  { name: "nationalIdIssuePlace", type: "text",  label: "Nơi cấp CMND",              placeholder: "Công an TP. Hà Nội" },
  { name: "phone",                type: "tel",   label: "Điện thoại di động",         placeholder: "0901 234 567" },
  { name: "landlinePhone",        type: "tel",   label: "Điện thoại cố định",        placeholder: "024 1234 5678" },
  { name: "email",                type: "email", label: "Email",                      placeholder: "email@example.com", colSpan: 2 },
  {
    name: "bidvRelationship", type: "select", label: "Quan hệ tín dụng với BIDV", colSpan: 2,
    options: [
      { value: "existing", label: "Đã vay vốn tại BIDV" },
      { value: "new",      label: "Chưa vay vốn tại BIDV" },
    ],
  },
]
