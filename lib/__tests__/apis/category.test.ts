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
import Category from "@/lib/apis/category"

describe("Category API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getProducts", () => {
    it("gọi đúng endpoint GET /categories/products", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] })
      await Category.getProducts()
      expect(http.get).toHaveBeenCalledWith("/categories/products")
    })
  })

  describe("getProductById", () => {
    it("gọi đúng endpoint GET /categories/product/{id}", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: {} })
      await Category.getProductById("prod-123")
      expect(http.get).toHaveBeenCalledWith("/categories/product/prod-123")
    })

    it("dùng đúng id được truyền vào", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: {} })
      await Category.getProductById("auto-loan")
      expect(http.get).toHaveBeenCalledWith("/categories/product/auto-loan")
    })
  })

  describe("getProductPropertiesById", () => {
    it("gọi đúng endpoint với query params amount và tenure", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] })
      await Category.getProductPropertiesById("prod-456")
      expect(http.get).toHaveBeenCalledWith(
        "/categories/product/prod-456/properties?type=amount&type=tenure"
      )
    })

    it("query string không được thiếu type params", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] })
      await Category.getProductPropertiesById("prod-456")
      const [url] = vi.mocked(http.get).mock.calls[0]
      expect(url).toContain("type=amount")
      expect(url).toContain("type=tenure")
    })
  })

  describe("getRolesByAuth", () => {
    it("gọi đúng endpoint GET /categories/roles", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [] })
      await Category.getRolesByAuth()
      expect(http.get).toHaveBeenCalledWith("/categories/roles")
    })
  })
})
