import { z } from "zod"
import { FieldConfigMap } from "@/lib/form-config-types"

/**
 * Transforms a step's Zod schema so that:
 *   "hidden"   → z.any().optional()  (skip all validation — field is not shown)
 *   "optional" → allow empty string/undefined, but run the original validation
 *                rules when a non-empty value is provided
 *
 * Handles both ZodObject and ZodEffects (.refine() wrappers) — refinements on
 * the outer ZodEffects are dropped when the schema is restructured, which is
 * acceptable because the refinements reference fields that are typically hidden
 * in the same config that triggers this transformation.
 */
export function applyFieldConfig(
  schema: z.ZodTypeAny,
  fieldConfig: FieldConfigMap,
): z.ZodObject<z.ZodRawShape> {
  const base =
    schema instanceof z.ZodEffects
      ? (schema._def.schema as z.ZodObject<z.ZodRawShape>)
      : (schema as z.ZodObject<z.ZodRawShape>)

  const shape: z.ZodRawShape = { ...base.shape }

  for (const [field, visibility] of Object.entries(fieldConfig)) {
    if (!(field in shape)) continue

    if (visibility === "hidden") {
      shape[field] = z.any().optional()
    } else if (visibility === "optional") {
      const fieldSchema = shape[field]
      // Allow empty/undefined to pass; run original schema validation for any
      // non-empty value so format rules (positive number, phone regex, etc.)
      // still apply when the user does provide a value.
      shape[field] = z.any().superRefine((v, ctx) => {
        if (v === "" || v === undefined || v === null) return
        const result = fieldSchema.safeParse(v)
        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue)
          }
        }
      })
    } else if (visibility === "required") {
      const fieldSchema = shape[field]
      // Only wrap if the original schema already accepts empty string — i.e. it
      // was defined as optional in the base Zod schema but the channel config
      // promotes it to required at runtime.  Fields that already reject "" keep
      // their original schema (and their original error messages) untouched.
      const alreadyRejectsEmpty = !fieldSchema.safeParse("").success
      if (!alreadyRejectsEmpty) {
        shape[field] = z.any().superRefine((v, ctx) => {
          if (v === "" || v === undefined || v === null) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Trường này là bắt buộc" })
            return
          }
          const result = fieldSchema.safeParse(v)
          if (!result.success) {
            for (const issue of result.error.issues) {
              ctx.addIssue(issue)
            }
          }
        })
      }
    }
  }

  return z.object(shape)
}
