import { z } from "zod"

export const initialApplication = z.object({
  productId: z.string().min(1, "ProductId is required"),
  requestAmount: z.string().min(1, "Request amount is required"),
  requestedTenureMonths: z.string().min(1, "Tenure months is required"),
  purpose: z.string().min(1, "Purpose is required"),
  customerName: z.string().min(1, "Fullname is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  national: z.string().min(1, "National is required"),
  nationalId: z.string().min(1, "NationalId is required"),
  dateOfBirth: z.string().min(1, "DateOfBirth is required"),
})

export type InitialApplicationType = z.infer<typeof initialApplication>

// --- Helpers ---
const VN_PHONE_RE = /^(0[3|5|7|8|9])[0-9]{8}$/
const CMND_RE = /^\d{9}$|^\d{12}$/
const POSTAL_CODE_RE = /^\d{5,6}$/

const vnPhone = (label: string) =>
  z.string().regex(VN_PHONE_RE, `${label} không hợp lệ (10 số, bắt đầu 03/05/07/08/09)`)

const positiveAmount = (label: string) =>
  z.string().min(1, `${label} là bắt buộc`).refine(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
    `${label} phải lớn hơn 0`
  )

const nonNegativeAmount = (label: string) =>
  z.string().min(1, `${label} là bắt buộc`).refine(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0,
    `${label} không được âm`
  )

const optionalNonNegative = (label: string) =>
  z.string().optional().refine(
    (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0),
    `${label} không được âm`
  )

const isAdult = (dateStr: string) => {
  const dob = new Date(dateStr)
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 18)
  return dob <= cutoff
}

const isPastOrToday = (dateStr: string) => new Date(dateStr) <= new Date()

// --- Step 1: Thông tin cá nhân ---
export const customerInfoSchema = z.object({
  firstName: z.string().min(1, "Họ là bắt buộc"),
  lastName: z.string().min(1, "Tên là bắt buộc"),
  dateOfBirth: z
    .string()
    .min(1, "Ngày sinh là bắt buộc")
    .refine(isPastOrToday, "Ngày sinh không được là ngày tương lai")
    .refine(isAdult, "Người vay phải đủ 18 tuổi"),
  gender: z.string().min(1, "Giới tính là bắt buộc"),
  nationalId: z
    .string()
    .min(1, "Số CMND/Hộ chiếu là bắt buộc")
    .refine((v) => CMND_RE.test(v), "CMND/CCCD phải là 9 hoặc 12 chữ số"),
  nationalIdIssueDate: z
    .string()
    .optional()
    .refine(
      (v) => !v || isPastOrToday(v),
      "Ngày cấp CMND không được là ngày tương lai"
    ),
  nationalIdIssuePlace: z.string().optional(),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  phone: vnPhone("Điện thoại di động"),
  landlinePhone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d{10,11}$/.test(v.replace(/[\s\-]/g, "")),
      "Điện thoại cố định không hợp lệ"
    ),
  maritalStatus: z.string().min(1, "Tình trạng hôn nhân là bắt buộc"),
  hasRelationship: z.string().min(1, "Quan hệ tín dụng với BIDV là bắt buộc"),
})

// --- Step 2: Thu nhập & Tài chính ---
export const customerIncomeSchema = z.object({
  employmentStatus: z.string().min(1, "Tình trạng việc làm là bắt buộc"),
  employerName: z.string().min(1, "Tên cơ quan là bắt buộc"),
  employerAddress: z.string().optional(),
  employerPhone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d{9,11}$/.test(v.replace(/[\s\-]/g, "")),
      "Điện thoại cơ quan không hợp lệ"
    ),
  jobTitle: z.string().min(1, "Vị trí công tác là bắt buộc"),
  yearsEmployed: z
    .string()
    .min(1, "Số năm làm việc là bắt buộc")
    .refine(
      (v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0,
      "Số năm làm việc phải lớn hơn hoặc bằng 0"
    ),
  monthlyIncome: positiveAmount("Lương hàng tháng"),
  businessIncome: optionalNonNegative("Thu nhập kinh doanh"),
  rentalIncome: optionalNonNegative("Thu nhập cho thuê"),
  additionalIncome: optionalNonNegative("Thu nhập khác"),
  incomeSource: z.string().optional(),
  livingExpenses: nonNegativeAmount("Chi phí sinh hoạt"),
  installmentExpenses: optionalNonNegative("Các khoản trả góp"),
  realEstateAssets: optionalNonNegative("Bất động sản"),
  movableAssets: optionalNonNegative("Động sản"),
  depositAssets: optionalNonNegative("Tiền gửi"),
})

// --- Step 3: Người đồng trả nợ & Người tham chiếu ---
export const customerRelationshipSchema = z
  .object({
    coborrowerName: z.string().optional(),
    coborrowerDateOfBirth: z
      .string()
      .optional()
      .refine(
        (v) => !v || isPastOrToday(v),
        "Ngày sinh người đồng trả nợ không được là ngày tương lai"
      )
      .refine(
        (v) => !v || isAdult(v),
        "Người đồng trả nợ phải đủ 18 tuổi"
      ),
    coborrowerGender: z.string().optional(),
    coborrowerIdNumber: z
      .string()
      .optional()
      .refine(
        (v) => !v || CMND_RE.test(v),
        "CMND/CCCD người đồng trả nợ phải là 9 hoặc 12 chữ số"
      ),
    coborrowerIdIssueDate: z
      .string()
      .optional()
      .refine(
        (v) => !v || isPastOrToday(v),
        "Ngày cấp CMND không được là ngày tương lai"
      ),
    coborrowerIdIssuePlace: z.string().optional(),
    coborrowerCurrentAddress: z.string().optional(),
    coborrowerMobilePhone: z
      .string()
      .optional()
      .refine(
        (v) => !v || VN_PHONE_RE.test(v),
        "Điện thoại người đồng trả nợ không hợp lệ"
      ),
    coborrowerMonthlyIncome: optionalNonNegative("Thu nhập người đồng trả nợ"),
    referenceName1: z.string().min(1, "Họ tên người tham chiếu là bắt buộc"),
    referencePhone1: vnPhone("Điện thoại người tham chiếu"),
    referenceRelation1: z.string().min(1, "Quan hệ với người vay là bắt buộc"),
    referenceAddress1: z.string().optional(),
    referenceName2: z.string().optional(),
    referencePhone2: z
      .string()
      .optional()
      .refine(
        (v) => !v || VN_PHONE_RE.test(v),
        "Điện thoại người tham chiếu phụ không hợp lệ"
      ),
    referenceRelation2: z.string().optional(),
    existingCustomer: z.string().min(1, "Vui lòng chọn"),
    accountNumber: z.string().optional(),
  })
  .refine(
    (d) => {
      // Nếu nhập tên người đồng trả nợ thì bắt buộc phải có CMND
      if (d.coborrowerName && !d.coborrowerIdNumber) return false
      return true
    },
    { message: "Vui lòng nhập CMND người đồng trả nợ", path: ["coborrowerIdNumber"] }
  )

// --- Step 4: Địa chỉ ---
export const customerLocationSchema = z.object({
  permanentAddress: z.string().min(1, "Địa chỉ thường trú là bắt buộc"),
  addressLine1: z.string().min(1, "Địa chỉ cư trú hiện tại là bắt buộc"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Quận/Huyện là bắt buộc"),
  state: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  postalCode: z
    .string()
    .min(1, "Mã bưu chính là bắt buộc")
    .regex(POSTAL_CODE_RE, "Mã bưu chính phải là 5-6 chữ số"),
  country: z.string().min(1, "Quốc gia là bắt buộc"),
  residenceType: z.string().min(1, "Loại hình cư trú là bắt buộc"),
  yearsAtAddress: z
    .string()
    .min(1, "Số năm cư trú là bắt buộc")
    .refine(
      (v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0,
      "Số năm cư trú phải lớn hơn hoặc bằng 0"
    ),
})

// --- Step 5: Thông tin khoản vay ---
export const loanInfoSchema = z.object({
  loanType: z.string().min(1, "Sản phẩm vay là bắt buộc"),
  loanMethod: z.string().min(1, "Phương thức vay là bắt buộc"),
  loanAmount: positiveAmount("Số tiền vay"),
  loanTerm: z.string().min(1, "Thời hạn vay là bắt buộc"),
  loanPurpose: z.string().min(1, "Mục đích vay là bắt buộc"),
  repaymentSource: z.string().min(1, "Nguồn trả nợ là bắt buộc"),
  principalRepaymentPeriod: z.string().min(1, "Kỳ trả nợ gốc là bắt buộc"),
  interestRepaymentPeriod: z.string().min(1, "Kỳ trả nợ lãi là bắt buộc"),
  principalRepaymentMethod: z.string().min(1, "Hình thức trả nợ gốc là bắt buộc"),
  repaymentMethod: z.string().min(1, "Phương thức trả nợ là bắt buộc"),
  repaymentAccountNumber: z.string().optional(),
  collateralType: z.string().optional(),
  collateralValue: optionalNonNegative("Giá trị tài sản bảo đảm"),
  collateralAddress: z.string().optional(),
  collateralOwnerType: z.string().optional(),
  insurancePackage: z.string().optional(),
  insurancePaymentMethod: z.string().optional(),
})

export const loanFormSchema = z.object({
  customerInfo: customerInfoSchema,
  customerIncome: customerIncomeSchema,
  customerRelationship: customerRelationshipSchema,
  customerLocation: customerLocationSchema,
  loanInfo: loanInfoSchema,
})

export type CustomerInfo = z.infer<typeof customerInfoSchema>
export type CustomerIncome = z.infer<typeof customerIncomeSchema>
export type CustomerRelationship = z.infer<typeof customerRelationshipSchema>
export type CustomerLocation = z.infer<typeof customerLocationSchema>
export type LoanInfo = z.infer<typeof loanInfoSchema>
export type LoanFormData = z.infer<typeof loanFormSchema>

export const STEPS = [
  { id: 1, title: "Thông tin cá nhân", description: "Personal details" },
  { id: 2, title: "Thu nhập & Tài chính", description: "Employment & income" },
  { id: 3, title: "Người đồng trả nợ", description: "Co-borrower & references" },
  { id: 4, title: "Địa chỉ", description: "Address information" },
  { id: 5, title: "Thông tin khoản vay", description: "Loan specifications" },
  { id: 6, title: "Xem lại", description: "Confirm & submit" },
] as const
