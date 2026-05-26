import { vi, describe, it, expect, beforeEach } from "vitest"
import type { RegisterStaffRequest } from "@/lib/apis/authentication-types"

vi.mock("@/lib/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import http from "@/lib/http"
import Staff from "@/lib/apis/staff"

const mockStaff = {
  id: 1,
  fullName: "Nguyễn Văn A",
  phone: "0901234567",
  username: "nguyenvana",
  national: "VN",
  nationalId: "123456789",
  active: true,
  departments: ["IT"],
  roles: [{ id: "1", name: "STAFF" }],
}

const mockPayload: RegisterStaffRequest = {
  customerName: "Nguyễn Văn A",
  phoneNumber: "0901234567",
  national: "VN",
  nationalId: "123456789",
  type: "STAFF",
  roles: ["STAFF"],
}

describe("Staff API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getStaffs", () => {
    it("gọi đúng endpoint GET /user/staffs", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [mockStaff] })
      await Staff.getStaffs()
      expect(http.get).toHaveBeenCalledWith("/user/staffs")
    })

    it("gọi đúng 1 lần", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] })
      await Staff.getStaffs()
      expect(http.get).toHaveBeenCalledTimes(1)
    })
  })

  describe("getStaff", () => {
    it("gọi đúng endpoint GET /user/staff/{id}", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: mockStaff })
      await Staff.getStaff(42)
      expect(http.get).toHaveBeenCalledWith("/user/staff/42")
    })

    it("dùng đúng id được truyền vào", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: mockStaff })
      await Staff.getStaff(99)
      expect(http.get).toHaveBeenCalledWith("/user/staff/99")
    })
  })

  describe("updateStaff", () => {
    it("gọi đúng endpoint PATCH /user/staff/{id}", async () => {
      vi.mocked(http.patch).mockResolvedValue({ data: mockStaff })
      await Staff.updateStaff(1, mockPayload)
      expect(http.patch).toHaveBeenCalledWith("/user/staff/1", mockPayload)
    })

    it("truyền đúng payload vào request body", async () => {
      vi.mocked(http.patch).mockResolvedValue({ data: mockStaff })
      const customPayload = { ...mockPayload, customerName: "Trần Thị B" }
      await Staff.updateStaff(5, customPayload)
      expect(http.patch).toHaveBeenCalledWith("/user/staff/5", customPayload)
    })
  })

  describe("deleteStaff", () => {
    it("gọi đúng endpoint DELETE /user/staff/{id}", async () => {
      vi.mocked(http.delete).mockResolvedValue({ data: mockStaff })
      await Staff.deleteStaff(3)
      expect(http.delete).toHaveBeenCalledWith("/user/staff/3")
    })

    it("dùng đúng id được truyền vào", async () => {
      vi.mocked(http.delete).mockResolvedValue({ data: mockStaff })
      await Staff.deleteStaff(7)
      expect(http.delete).toHaveBeenCalledWith("/user/staff/7")
    })
  })
})
