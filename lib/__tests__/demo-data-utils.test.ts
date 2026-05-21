import { describe, it, expect } from "vitest"
import { fillDemoData } from "@/lib/demo-data-utils"
import type { LoanApplicationSeed } from "@/lib/apis/seeder-types"

const baseSeed: LoanApplicationSeed = {
  applicationNumber: "APP-2024-000001",
  borrowerName: "Nguyen Van An",
  age: 32,
  gender: "MALE",
  maritalStatus: "MARRIED",
  loanProductCode: "PL-001",
  requestedAmount: 200_000_000,
  requestedTenureMonths: 24,
  purpose: "Tiêu dùng cá nhân",
  channel: "CUSTOMER_SELF",
  employmentType: "FULL_TIME",
  employerName: "Viettel Group",
  industry: "IT",
  jobTitle: "Senior Software Engineer",
  employmentDurationMonths: 36,
  monthlyIncome: 30_000_000,
  otherIncome: 0,
  totalMonthlyIncome: 30_000_000,
  monthlyDebtPayments: 9_000_000,
  dtiRatio: 30,
  cicScore: 750,
  creditHistoryYears: 7,
  closedLoansCount: 3,
  activeLoansCount: 1,
  latePaymentCount: 0,
  maxDaysLate: 0,
  hasDefaultHistory: false,
  onTimePaymentPercentage: 100,
  totalCreditLimit: 200_000_000,
  totalDebtOutstanding: 60_000_000,
  creditUtilizationRatio: 30,
  inquiriesLast6Months: 1,
  hasCollateral: false,
  estimatedCollateralValue: 0,
  hasGuarantor: false,
  numberOfGuarantors: 0,
  autoScoreTotal: 850,
  autoScoreGrade: "A",
  riskScoreTotal: 18,
  riskRating: "VERY_LOW",
  status: "APPROVED",
  underwritingDecision: "APPROVED",
  decisionReason: "Auto approved",
  submittedAt: "2024-03-01T08:30:00",
}

describe("fillDemoData", () => {
  describe("customerInfo", () => {
    it("tách borrowerName thành firstName và lastName", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerInfo.firstName).toBe("Nguyen Van")
      expect(result.customerInfo.lastName).toBe("An")
    })

    it("xử lý tên chỉ có 1 từ: firstName rỗng, lastName là toàn bộ tên", () => {
      const result = fillDemoData({ ...baseSeed, borrowerName: "Madonna" })
      expect(result.customerInfo.firstName).toBe("")
      expect(result.customerInfo.lastName).toBe("Madonna")
    })

    it("map gender", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerInfo.gender).toBe("MALE")
    })

    it("map maritalStatus", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerInfo.maritalStatus).toBe("MARRIED")
    })
  })

  describe("customerIncome", () => {
    it("map employmentType → employmentStatus", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.employmentStatus).toBe("FULL_TIME")
    })

    it("map employerName", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.employerName).toBe("Viettel Group")
    })

    it("map jobTitle", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.jobTitle).toBe("Senior Software Engineer")
    })

    it("chuyển employmentDurationMonths sang yearsEmployed (1 chữ số thập phân)", () => {
      const result = fillDemoData(baseSeed) // 36 months
      expect(result.customerIncome.yearsEmployed).toBe("3.0")
    })

    it("chuyển employmentDurationMonths = 0 sang '0.0'", () => {
      const result = fillDemoData({ ...baseSeed, employmentDurationMonths: 0 })
      expect(result.customerIncome.yearsEmployed).toBe("0.0")
    })

    it("map monthlyIncome thành string", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.monthlyIncome).toBe("30000000")
    })

    it("map otherIncome → additionalIncome thành string", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.additionalIncome).toBe("0")
    })

    it("map monthlyDebtPayments → installmentExpenses thành string", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerIncome.installmentExpenses).toBe("9000000")
    })
  })

  describe("loanInfo", () => {
    it("map requestedAmount → loanAmount thành string", () => {
      const result = fillDemoData(baseSeed)
      expect(result.loanInfo.loanAmount).toBe("200000000")
    })

    it("map requestedTenureMonths → loanTerm thành string", () => {
      const result = fillDemoData(baseSeed)
      expect(result.loanInfo.loanTerm).toBe("24")
    })

    it("map purpose → loanPurpose", () => {
      const result = fillDemoData(baseSeed)
      expect(result.loanInfo.loanPurpose).toBe("Tiêu dùng cá nhân")
    })

    it("map loanProductCode → loanType", () => {
      const result = fillDemoData(baseSeed)
      expect(result.loanInfo.loanType).toBe("PL-001")
    })
  })

  describe("untouched steps", () => {
    it("customerRelationship giữ nguyên rỗng", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerRelationship.referenceName1).toBe("")
    })

    it("customerLocation giữ nguyên rỗng", () => {
      const result = fillDemoData(baseSeed)
      expect(result.customerLocation.permanentAddress).toBe("")
    })
  })
})
