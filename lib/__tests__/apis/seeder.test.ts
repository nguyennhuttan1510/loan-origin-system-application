import { vi, describe, it, expect, beforeEach } from "vitest"

vi.mock("@/lib/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import http from "@/lib/http"
import SeederApi from "@/lib/apis/seeder"

describe("SeederApi", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getAll", () => {
    it("gọi đúng endpoint GET /seeder/application", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: { data: [] } })
      await SeederApi.getAll()
      expect(http.get).toHaveBeenCalledWith("/seeder/application")
    })

    it("gọi đúng 1 lần", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: { data: [] } })
      await SeederApi.getAll()
      expect(http.get).toHaveBeenCalledTimes(1)
    })

    it("không gọi POST hay PATCH hay DELETE", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: { data: [] } })
      await SeederApi.getAll()
      expect(http.post).not.toHaveBeenCalled()
      expect(http.patch).not.toHaveBeenCalled()
      expect(http.delete).not.toHaveBeenCalled()
    })
  })
})
