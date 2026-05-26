import { vi, describe, it, expect, beforeEach } from "vitest"
import type { ApplicationRequest } from "@/lib/apis/application-types"

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
})
