import { describe, it, expect } from "vitest"
import { z } from "zod"
import {
  customerInfoSchema,
  customerIncomeSchema,
  customerRelationshipSchema,
  customerLocationSchema,
  loanInfoSchema,
} from "@/lib/loan-form-types"

// --- Helpers ---

function errors<I, O>(result: z.SafeParseReturnType<I, O>): Record<string, string[] | undefined> {
  if (result.success) return {}
  return result.error.flatten().fieldErrors as Record<string, string[] | undefined>
}

function formErrors<I, O>(result: z.SafeParseReturnType<I, O>): string[] {
  if (result.success) return []
  return result.error.flatten().formErrors
}

// --- Base valid fixtures (chỉ chứa required fields) ---

const validCustomerInfo = {
  firstName: "Nguyễn",
  lastName: "Văn An",
  dateOfBirth: "1990-06-15",
  gender: "male",
  nationalId: "123456789",
  email: "an@example.com",
  phone: "0901234567",
  maritalStatus: "single",
  bidvRelationship: "new",
}

const validCustomerIncome = {
  employmentStatus: "employed",
  employerName: "Công ty TNHH ABC",
  jobTitle: "Kỹ sư phần mềm",
  yearsEmployed: "3",
  monthlyIncome: "15000000",
  livingExpenses: "8000000",
}

const validCustomerRelationship = {
  referenceName1: "Trần Thị B",
  referencePhone1: "0912345678",
  referenceRelation1: "friend",
  existingCustomer: "no",
}

const validCustomerLocation = {
  permanentAddress: "12 Lê Lợi, Quận 1, TP.HCM",
  addressLine1: "34 Nguyễn Huệ, Quận 1",
  city: "Quận 1",
  state: "TP. Hồ Chí Minh",
  postalCode: "700000",
  country: "vn",
  residenceType: "rented",
  yearsAtAddress: "2",
}

const validLoanInfo = {
  loanType: "auto",
  loanMethod: "installment",
  loanAmount: "500000000",
  loanTerm: "60",
  loanPurpose: "Mua xe Toyota Camry",
  repaymentSource: "Lương tháng từ công ty ABC",
  principalRepaymentPeriod: "monthly",
  interestRepaymentPeriod: "monthly",
  principalRepaymentMethod: "equal",
  repaymentMethod: "transfer",
}

// ============================================================
// Step 1: Thông tin cá nhân
// ============================================================

describe("customerInfoSchema", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    expect(customerInfoSchema.safeParse(validCustomerInfo).success).toBe(true)
  })

  // dateOfBirth
  describe("dateOfBirth", () => {
    it("báo lỗi khi để trống", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, dateOfBirth: "" })
      expect(errors(result).dateOfBirth).toBeTruthy()
    })

    it("báo lỗi khi ngày sinh là tương lai", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, dateOfBirth: "2099-01-01" })
      expect(errors(result).dateOfBirth).toContain("Ngày sinh không được là ngày tương lai")
    })

    it("báo lỗi khi chưa đủ 18 tuổi", () => {
      const under18 = new Date()
      under18.setFullYear(under18.getFullYear() - 17)
      const result = customerInfoSchema.safeParse({
        ...validCustomerInfo,
        dateOfBirth: under18.toISOString().split("T")[0],
      })
      expect(errors(result).dateOfBirth).toContain("Người vay phải đủ 18 tuổi")
    })

    it("chấp nhận ngày sinh đúng 18 tuổi hôm nay", () => {
      const exactly18 = new Date()
      exactly18.setFullYear(exactly18.getFullYear() - 18)
      const result = customerInfoSchema.safeParse({
        ...validCustomerInfo,
        dateOfBirth: exactly18.toISOString().split("T")[0],
      })
      expect(result.success).toBe(true)
    })
  })

  // nationalId
  describe("nationalId", () => {
    it("chấp nhận CMND 9 chữ số", () => {
      expect(customerInfoSchema.safeParse({ ...validCustomerInfo, nationalId: "123456789" }).success).toBe(true)
    })

    it("chấp nhận CCCD 12 chữ số", () => {
      expect(customerInfoSchema.safeParse({ ...validCustomerInfo, nationalId: "123456789012" }).success).toBe(true)
    })

    it("báo lỗi khi có 10 chữ số (không hợp lệ)", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, nationalId: "1234567890" })
      expect(errors(result).nationalId).toContain("CMND/CCCD phải là 9 hoặc 12 chữ số")
    })

    it("báo lỗi khi chứa chữ cái", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, nationalId: "12345678A" })
      expect(errors(result).nationalId).toBeTruthy()
    })
  })

  // phone
  describe("phone", () => {
    it("chấp nhận số di động Viettel 032xxxxxxx", () => {
      expect(customerInfoSchema.safeParse({ ...validCustomerInfo, phone: "0321234567" }).success).toBe(true)
    })

    it("chấp nhận số di động Vinaphone 089xxxxxxx", () => {
      expect(customerInfoSchema.safeParse({ ...validCustomerInfo, phone: "0891234567" }).success).toBe(true)
    })

    it("báo lỗi khi bắt đầu bằng 01 (đầu số cũ)", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, phone: "0123456789" })
      expect(errors(result).phone).toBeTruthy()
    })

    it("báo lỗi khi chỉ có 9 chữ số", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, phone: "090123456" })
      expect(errors(result).phone).toBeTruthy()
    })

    it("báo lỗi khi có dấu cách", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, phone: "0901 234 567" })
      expect(errors(result).phone).toBeTruthy()
    })
  })

  // nationalIdIssueDate (optional)
  describe("nationalIdIssueDate", () => {
    it("chấp nhận khi để trống", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, nationalIdIssueDate: undefined })
      expect(result.success).toBe(true)
    })

    it("báo lỗi khi ngày cấp là tương lai", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, nationalIdIssueDate: "2099-12-31" })
      expect(errors(result).nationalIdIssueDate).toContain("Ngày cấp CMND không được là ngày tương lai")
    })

    it("chấp nhận ngày cấp hợp lệ trong quá khứ", () => {
      const result = customerInfoSchema.safeParse({ ...validCustomerInfo, nationalIdIssueDate: "2015-03-10" })
      expect(result.success).toBe(true)
    })
  })
})

// ============================================================
// Step 2: Thu nhập & Tài chính
// ============================================================

describe("customerIncomeSchema", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    expect(customerIncomeSchema.safeParse(validCustomerIncome).success).toBe(true)
  })

  describe("yearsEmployed", () => {
    it("chấp nhận 0 năm (mới đi làm)", () => {
      expect(customerIncomeSchema.safeParse({ ...validCustomerIncome, yearsEmployed: "0" }).success).toBe(true)
    })

    it("báo lỗi khi là số âm", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, yearsEmployed: "-1" })
      expect(errors(result).yearsEmployed).toContain("Số năm làm việc phải lớn hơn hoặc bằng 0")
    })
  })

  describe("monthlyIncome", () => {
    it("báo lỗi khi bằng 0", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, monthlyIncome: "0" })
      expect(errors(result).monthlyIncome).toContain("Lương hàng tháng phải lớn hơn 0")
    })

    it("báo lỗi khi âm", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, monthlyIncome: "-500000" })
      expect(errors(result).monthlyIncome).toContain("Lương hàng tháng phải lớn hơn 0")
    })

    it("chấp nhận thu nhập dương", () => {
      expect(customerIncomeSchema.safeParse({ ...validCustomerIncome, monthlyIncome: "1" }).success).toBe(true)
    })
  })

  describe("livingExpenses", () => {
    it("chấp nhận 0 (không có chi phí)", () => {
      expect(customerIncomeSchema.safeParse({ ...validCustomerIncome, livingExpenses: "0" }).success).toBe(true)
    })

    it("báo lỗi khi âm", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, livingExpenses: "-100000" })
      expect(errors(result).livingExpenses).toContain("Chi phí sinh hoạt không được âm")
    })
  })

  describe("optional income/asset fields", () => {
    it("báo lỗi khi businessIncome âm", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, businessIncome: "-1" })
      expect(errors(result).businessIncome).toContain("Thu nhập kinh doanh không được âm")
    })

    it("chấp nhận businessIncome = 0", () => {
      expect(customerIncomeSchema.safeParse({ ...validCustomerIncome, businessIncome: "0" }).success).toBe(true)
    })

    it("báo lỗi khi realEstateAssets âm", () => {
      const result = customerIncomeSchema.safeParse({ ...validCustomerIncome, realEstateAssets: "-1000000" })
      expect(errors(result).realEstateAssets).toBeTruthy()
    })
  })
})

// ============================================================
// Step 3: Người đồng trả nợ & Tham chiếu
// ============================================================

describe("customerRelationshipSchema", () => {
  it("chấp nhận dữ liệu hợp lệ không có người đồng trả nợ", () => {
    expect(customerRelationshipSchema.safeParse(validCustomerRelationship).success).toBe(true)
  })

  describe("referencePhone1", () => {
    it("báo lỗi khi số điện thoại không hợp lệ", () => {
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        referencePhone1: "0123456789",
      })
      expect(errors(result).referencePhone1).toBeTruthy()
    })
  })

  describe("coborrowerDateOfBirth", () => {
    it("báo lỗi khi ngày sinh tương lai", () => {
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        coborrowerDateOfBirth: "2090-01-01",
      })
      expect(errors(result).coborrowerDateOfBirth).toContain(
        "Ngày sinh người đồng trả nợ không được là ngày tương lai"
      )
    })

    it("báo lỗi khi người đồng trả nợ chưa đủ 18 tuổi", () => {
      const under18 = new Date()
      under18.setFullYear(under18.getFullYear() - 10)
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        coborrowerDateOfBirth: under18.toISOString().split("T")[0],
      })
      expect(errors(result).coborrowerDateOfBirth).toContain("Người đồng trả nợ phải đủ 18 tuổi")
    })
  })

  describe("coborrowerIdNumber", () => {
    it("báo lỗi khi CMND không đúng định dạng", () => {
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        coborrowerIdNumber: "12345",
      })
      expect(errors(result).coborrowerIdNumber).toContain("CMND/CCCD người đồng trả nợ phải là 9 hoặc 12 chữ số")
    })
  })

  describe("cross-field: coborrowerName yêu cầu CMND", () => {
    it("báo lỗi khi nhập tên nhưng không nhập CMND", () => {
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        coborrowerName: "Lê Thị C",
        coborrowerIdNumber: undefined,
      })
      expect(result.success).toBe(false)
      expect(errors(result as Parameters<typeof errors>[0]).coborrowerIdNumber).toContain(
        "Vui lòng nhập CMND người đồng trả nợ"
      )
    })

    it("chấp nhận khi có cả tên và CMND", () => {
      const result = customerRelationshipSchema.safeParse({
        ...validCustomerRelationship,
        coborrowerName: "Lê Thị C",
        coborrowerIdNumber: "123456789",
      })
      expect(result.success).toBe(true)
    })

    it("chấp nhận khi không có cả tên lẫn CMND (không điền section này)", () => {
      expect(customerRelationshipSchema.safeParse(validCustomerRelationship).success).toBe(true)
    })
  })
})

// ============================================================
// Step 4: Địa chỉ
// ============================================================

describe("customerLocationSchema", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    expect(customerLocationSchema.safeParse(validCustomerLocation).success).toBe(true)
  })

  describe("postalCode", () => {
    it("chấp nhận mã 6 chữ số", () => {
      expect(customerLocationSchema.safeParse({ ...validCustomerLocation, postalCode: "700000" }).success).toBe(true)
    })

    it("chấp nhận mã 5 chữ số", () => {
      expect(customerLocationSchema.safeParse({ ...validCustomerLocation, postalCode: "10000" }).success).toBe(true)
    })

    it("báo lỗi khi có chữ cái", () => {
      const result = customerLocationSchema.safeParse({ ...validCustomerLocation, postalCode: "70000A" })
      expect(errors(result).postalCode).toContain("Mã bưu chính phải là 5-6 chữ số")
    })

    it("báo lỗi khi ít hơn 5 chữ số", () => {
      const result = customerLocationSchema.safeParse({ ...validCustomerLocation, postalCode: "1234" })
      expect(errors(result).postalCode).toBeTruthy()
    })
  })

  describe("yearsAtAddress", () => {
    it("chấp nhận 0 năm (mới dọn vào)", () => {
      expect(customerLocationSchema.safeParse({ ...validCustomerLocation, yearsAtAddress: "0" }).success).toBe(true)
    })

    it("báo lỗi khi âm", () => {
      const result = customerLocationSchema.safeParse({ ...validCustomerLocation, yearsAtAddress: "-1" })
      expect(errors(result).yearsAtAddress).toContain("Số năm cư trú phải lớn hơn hoặc bằng 0")
    })
  })
})

// ============================================================
// Step 5: Thông tin khoản vay
// ============================================================

describe("loanInfoSchema", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    expect(loanInfoSchema.safeParse(validLoanInfo).success).toBe(true)
  })

  describe("loanAmount", () => {
    it("báo lỗi khi bằng 0", () => {
      const result = loanInfoSchema.safeParse({ ...validLoanInfo, loanAmount: "0" })
      expect(errors(result).loanAmount).toContain("Số tiền vay phải lớn hơn 0")
    })

    it("báo lỗi khi âm", () => {
      const result = loanInfoSchema.safeParse({ ...validLoanInfo, loanAmount: "-100000000" })
      expect(errors(result).loanAmount).toContain("Số tiền vay phải lớn hơn 0")
    })

    it("chấp nhận số tiền dương", () => {
      expect(loanInfoSchema.safeParse({ ...validLoanInfo, loanAmount: "1000000" }).success).toBe(true)
    })
  })

  describe("collateralValue (optional)", () => {
    it("chấp nhận khi để trống", () => {
      expect(loanInfoSchema.safeParse({ ...validLoanInfo, collateralValue: undefined }).success).toBe(true)
    })

    it("chấp nhận giá trị 0", () => {
      expect(loanInfoSchema.safeParse({ ...validLoanInfo, collateralValue: "0" }).success).toBe(true)
    })

    it("báo lỗi khi âm", () => {
      const result = loanInfoSchema.safeParse({ ...validLoanInfo, collateralValue: "-1" })
      expect(errors(result).collateralValue).toContain("Giá trị tài sản bảo đảm không được âm")
    })
  })

  describe("required fields", () => {
    const requiredFields: (keyof typeof validLoanInfo)[] = [
      "loanType",
      "loanMethod",
      "loanAmount",
      "loanTerm",
      "loanPurpose",
      "repaymentSource",
      "principalRepaymentPeriod",
      "interestRepaymentPeriod",
      "principalRepaymentMethod",
      "repaymentMethod",
    ]

    for (const field of requiredFields) {
      it(`báo lỗi khi thiếu ${field}`, () => {
        const data = { ...validLoanInfo, [field]: "" }
        const result = loanInfoSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    }
  })
})
