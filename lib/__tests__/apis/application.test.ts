import { vi, describe, it, expect, beforeEach } from "vitest"
import type { ApplicationRequest, UpdateApplicationRequest } from "@/lib/apis/application-types"

vi.mock("@/lib/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import http from "@/lib/http"
import Application from "@/lib/apis/application"

const mockPayload: ApplicationRequest = {
  productId: 1,
  requestAmount: "500000000",
  requestedTenureMonths: 60,
  purpose: "Mua xe Toyota Camry",
  hasCollateral: true,
  hasGuarantor: false,
  dateOfBirth: "1990-01-15",
  user: {
    username: "nguyenvana",
    customerName: "Nguyễn Văn A",
    phoneNumber: "0901234567",
    national: "VN",
    nationalId: "123456789",
    dateOfBirth: "1990-01-15",
    type: "CLIENT",
  },
}

describe("Application API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createApplication", () => {
    it("gọi đúng endpoint POST /loan-application/create", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: { id: "app-001" } })
      await Application.createApplication(mockPayload)
      expect(http.post).toHaveBeenCalledWith("/loan-application/create", mockPayload)
    })

    it("truyền đúng toàn bộ payload vào request body", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: {} })
      await Application.createApplication(mockPayload)
      const [, body] = vi.mocked(http.post).mock.calls[0]
      expect(body).toEqual(mockPayload)
    })

    it("gọi đúng 1 lần khi submit", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: {} })
      await Application.createApplication(mockPayload)
      expect(http.post).toHaveBeenCalledTimes(1)
    })

    it("không gọi GET hay PATCH hay DELETE", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: {} })
      await Application.createApplication(mockPayload)
      expect(http.get).not.toHaveBeenCalled()
      expect(http.patch).not.toHaveBeenCalled()
      expect(http.delete).not.toHaveBeenCalled()
    })
  })

  describe("getApplicationDetail", () => {
    it("gọi đúng endpoint GET /loan-application/:id/underwriting-detail", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: { data: {} } })
      await Application.getApplicationDetail(42)
      expect(http.get).toHaveBeenCalledWith(
        "/loan-application/42/underwriting-detail"
      )
    })
  })

  describe("updateApplication", () => {
    it("gọi đúng endpoint POST /loan-application/:id/update", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: {} })
      const payload: UpdateApplicationRequest = {
        loanInfo: {
          requestedAmount: 100000000,
          requestedTenureMonths: 24,
          requestedRepaymentFrequency: "MONTHLY",
          purpose: "Mua nhà tại Hà Nội, đây là mục đích vay chi tiết",
          purposeDetails:
            "Mua căn hộ chung cư tại quận Cầu Giấy, diện tích 70m2, giá 2.5 tỷ VND",
        },
      }
      await Application.updateApplication(42, payload)
      expect(http.post).toHaveBeenCalledWith(
        "/loan-application/42/update",
        payload
      )
    })

    it("truyền đúng payload với nhiều sections", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: {} })
      const payload: UpdateApplicationRequest = {
        loanInfo: {
          requestedAmount: 500000000,
          requestedTenureMonths: 60,
          requestedRepaymentFrequency: "MONTHLY",
          purpose: "Mua xe ô tô Toyota Camry năm 2024",
          purposeDetails:
            "Mua xe Toyota Camry 2024 biển số Hà Nội, giá xe 1.2 tỷ VND đã bao gồm thuế",
        },
        financeInfo: {
          monthlyIncome: 50000000,
          hasCollateral: false,
        },
      }
      await Application.updateApplication(99, payload)
      const [url, body] = vi.mocked(http.post).mock.calls[0]
      expect(url).toBe("/loan-application/99/update")
      expect(body).toEqual(payload)
    })
  })
})
