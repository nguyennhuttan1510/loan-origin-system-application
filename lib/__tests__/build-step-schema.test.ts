import { describe, it, expect } from "vitest"
import { z } from "zod"
import { applyFieldConfig } from "@/lib/build-step-schema"

// ── Minimal schemas per case — isolate each field under test ──────────────────

const positiveAmount = z
  .string()
  .min(1, "bắt buộc")
  .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "phải lớn hơn 0")

const vnPhone = z
  .string()
  .regex(/^(0[3|5|7|8|9])[0-9]{8}$/, "số điện thoại không hợp lệ")

const optionalNonNegative = z
  .string()
  .optional()
  .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0), "không được âm")

const amountSchema = z.object({ amount: positiveAmount })
const phoneSchema = z.object({ phone: vnPhone })
const textSchema = z.object({ text: z.string().min(1, "bắt buộc") })
const optionalTextSchema = z.object({ text: z.string().optional() })
const optionalAmountSchema = z.object({ amount: optionalNonNegative })

// ── "hidden" — bỏ qua toàn bộ validation ──────────────────────────────────────

describe('applyFieldConfig — visibility "hidden"', () => {
  it("chấp nhận chuỗi rỗng cho field bị ẩn", () => {
    const schema = applyFieldConfig(textSchema, { text: "hidden" })
    expect(schema.safeParse({ text: "" }).success).toBe(true)
  })

  it("chấp nhận giá trị âm cho positiveAmount bị ẩn", () => {
    const schema = applyFieldConfig(amountSchema, { amount: "hidden" })
    expect(schema.safeParse({ amount: "-999" }).success).toBe(true)
  })

  it("chấp nhận chuỗi bất kỳ cho phone bị ẩn", () => {
    const schema = applyFieldConfig(phoneSchema, { phone: "hidden" })
    expect(schema.safeParse({ phone: "invalid-phone" }).success).toBe(true)
  })
})

// ── "optional" — bỏ qua khi rỗng, giữ validation khi có giá trị ────────────────

describe('applyFieldConfig — visibility "optional"', () => {
  describe("positiveAmount (z.string().min(1).refine(v > 0))", () => {
    const schema = applyFieldConfig(amountSchema, { amount: "optional" })

    it("chấp nhận chuỗi rỗng (không bắt buộc nữa)", () => {
      expect(schema.safeParse({ amount: "" }).success).toBe(true)
    })

    it("chấp nhận giá trị dương hợp lệ", () => {
      expect(schema.safeParse({ amount: "500000" }).success).toBe(true)
    })

    it("báo lỗi khi nhập số âm (giữ nguyên validation)", () => {
      expect(schema.safeParse({ amount: "-100" }).success).toBe(false)
    })

    it("báo lỗi khi nhập 0 (giữ nguyên validation)", () => {
      expect(schema.safeParse({ amount: "0" }).success).toBe(false)
    })

    it("báo lỗi khi nhập chuỗi không phải số", () => {
      expect(schema.safeParse({ amount: "abc" }).success).toBe(false)
    })
  })

  describe("phone (z.string().regex(...))", () => {
    const schema = applyFieldConfig(phoneSchema, { phone: "optional" })

    it("chấp nhận chuỗi rỗng", () => {
      expect(schema.safeParse({ phone: "" }).success).toBe(true)
    })

    it("chấp nhận số điện thoại hợp lệ", () => {
      expect(schema.safeParse({ phone: "0901234567" }).success).toBe(true)
    })

    it("báo lỗi khi số điện thoại không đúng định dạng", () => {
      expect(schema.safeParse({ phone: "0123456789" }).success).toBe(false)
    })
  })

  describe("z.string().min(1)", () => {
    const schema = applyFieldConfig(textSchema, { text: "optional" })

    it("chấp nhận chuỗi rỗng", () => {
      expect(schema.safeParse({ text: "" }).success).toBe(true)
    })

    it("chấp nhận chuỗi có nội dung", () => {
      expect(schema.safeParse({ text: "bất kỳ" }).success).toBe(true)
    })
  })
})

// ── "required" — enforce non-empty cho optional schema, giữ nguyên required schema ──

describe('applyFieldConfig — visibility "required"', () => {
  describe("base schema là optional (z.string().optional()) — phải enforce required", () => {
    const schema = applyFieldConfig(optionalTextSchema, { text: "required" })

    it("báo lỗi khi để rỗng", () => {
      expect(schema.safeParse({ text: "" }).success).toBe(false)
    })

    it("báo lỗi khi undefined", () => {
      expect(schema.safeParse({ text: undefined }).success).toBe(false)
    })

    it("chấp nhận khi có giá trị", () => {
      expect(schema.safeParse({ text: "nội dung" }).success).toBe(true)
    })
  })

  describe("base schema là optionalNonNegative — phải enforce required + giữ validation", () => {
    const schema = applyFieldConfig(optionalAmountSchema, { amount: "required" })

    it("báo lỗi khi để rỗng", () => {
      expect(schema.safeParse({ amount: "" }).success).toBe(false)
    })

    it("báo lỗi khi nhập số âm (giữ validation gốc)", () => {
      expect(schema.safeParse({ amount: "-1" }).success).toBe(false)
    })

    it("chấp nhận giá trị 0", () => {
      expect(schema.safeParse({ amount: "0" }).success).toBe(true)
    })

    it("chấp nhận giá trị dương", () => {
      expect(schema.safeParse({ amount: "500000" }).success).toBe(true)
    })
  })

  describe("base schema đã required (z.string().min(1)) — không thay đổi behavior", () => {
    const schema = applyFieldConfig(textSchema, { text: "required" })

    it("vẫn báo lỗi khi rỗng với error message gốc", () => {
      const result = schema.safeParse({ text: "" })
      expect(result.success).toBe(false)
      // Đảm bảo error message gốc được bảo toàn (không bị override bởi generic message)
      if (!result.success) {
        const msg = result.error.issues[0]?.message
        expect(msg).toBe("bắt buộc")
      }
    })

    it("chấp nhận giá trị hợp lệ", () => {
      expect(schema.safeParse({ text: "ok" }).success).toBe(true)
    })
  })

  describe("base schema đã required với positiveAmount — không thay đổi behavior", () => {
    const schema = applyFieldConfig(amountSchema, { amount: "required" })

    it("vẫn báo lỗi khi rỗng", () => {
      expect(schema.safeParse({ amount: "" }).success).toBe(false)
    })

    it("vẫn báo lỗi khi âm", () => {
      expect(schema.safeParse({ amount: "-1" }).success).toBe(false)
    })

    it("chấp nhận giá trị dương", () => {
      expect(schema.safeParse({ amount: "100" }).success).toBe(true)
    })
  })

  it("field không có trong fieldConfig — không bị ảnh hưởng", () => {
    const schema = applyFieldConfig(optionalTextSchema, {})
    expect(schema.safeParse({ text: "" }).success).toBe(true)
  })
})

// ── Kết hợp nhiều visibility trong cùng schema ────────────────────────────────

describe("applyFieldConfig — mixed visibility", () => {
  const mixedSchema = z.object({
    name: z.string().min(1, "bắt buộc"),
    amount: positiveAmount,
    phone: vnPhone,
  })

  const schema = applyFieldConfig(mixedSchema, {
    amount: "optional",
    phone: "hidden",
  })

  it("name vẫn required", () => {
    expect(schema.safeParse({ name: "", amount: "100", phone: "" }).success).toBe(false)
  })

  it("amount optional: rỗng OK", () => {
    expect(schema.safeParse({ name: "test", amount: "", phone: "" }).success).toBe(true)
  })

  it("amount optional: âm fail", () => {
    expect(schema.safeParse({ name: "test", amount: "-1", phone: "" }).success).toBe(false)
  })

  it("phone hidden: bất kỳ giá trị đều pass", () => {
    expect(schema.safeParse({ name: "test", amount: "100", phone: "invalid" }).success).toBe(true)
  })
})

// ── ZodEffects (schema có .refine() ở outer level) ────────────────────────────

describe("applyFieldConfig — ZodEffects outer schema", () => {
  const schemaWithRefine = z
    .object({
      name: z.string().min(1, "bắt buộc"),
      amount: positiveAmount,
    })
    .refine((d) => d.name !== d.amount, { message: "cross-field refine", path: ["name"] })

  it("không throw khi xử lý ZodEffects", () => {
    expect(() => applyFieldConfig(schemaWithRefine, { amount: "optional" })).not.toThrow()
  })

  it("optional field trong ZodEffects: rỗng OK", () => {
    const schema = applyFieldConfig(schemaWithRefine, { amount: "optional" })
    expect(schema.safeParse({ name: "test", amount: "" }).success).toBe(true)
  })

  it("optional field trong ZodEffects: âm fail", () => {
    const schema = applyFieldConfig(schemaWithRefine, { amount: "optional" })
    expect(schema.safeParse({ name: "test", amount: "-5" }).success).toBe(false)
  })
})
