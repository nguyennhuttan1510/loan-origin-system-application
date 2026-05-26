import type { FieldSchema } from "@/lib/field-schema/types"

export const step4Fields: FieldSchema[] = [
  // ── Địa chỉ thường trú ───────────────────────────────────────────────────
  { name: "__sep_permanent", type: "separator", label: "Địa chỉ thường trú (theo Hộ khẩu / KT3)", colSpan: 2 },
  {
    name: "permanentAddress", type: "text", label: "Địa chỉ thường trú", colSpan: 2,
    placeholder: "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố",
  },

  // ── Địa chỉ cư trú hiện tại ──────────────────────────────────────────────
  { name: "__sep_current", type: "separator", label: "Địa chỉ cư trú hiện tại", colSpan: 2 },
  {
    name: "addressLine1", type: "text", label: "Địa chỉ", colSpan: 2,
    placeholder: "Số nhà, tên đường, phường/xã",
  },
  {
    name: "addressLine2", type: "text", label: "Địa chỉ bổ sung", colSpan: 2,
    placeholder: "Căn hộ, tầng, toà nhà...",
  },
  { name: "city",       type: "text",   label: "Quận / Huyện / Thành phố", placeholder: "VD: Quận Cầu Giấy" },
  { name: "state",      type: "text",   label: "Tỉnh / Thành phố",         placeholder: "VD: Hà Nội" },
  { name: "postalCode", type: "text",   label: "Mã bưu chính",             placeholder: "VD: 100000" },
  {
    name: "country", type: "select", label: "Quốc gia",
    options: [
      { value: "vn",    label: "Việt Nam" },
      { value: "other", label: "Khác" },
    ],
  },
  {
    name: "residenceType", type: "select", label: "Loại hình cư trú",
    options: [
      { value: "owned",  label: "Nhà riêng" },
      { value: "rented", label: "Nhà thuê" },
      { value: "family", label: "Ở cùng gia đình" },
      { value: "other",  label: "Khác" },
    ],
  },
  { name: "yearsAtAddress", type: "number", label: "Số năm cư trú tại địa chỉ này", placeholder: "VD: 3" },
]
