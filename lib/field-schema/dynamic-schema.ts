import { z } from "zod"
import { applyFieldConfig } from "@/lib/build-step-schema"
import { evaluate } from "@/lib/field-schema/evaluator"
import type { FieldSchema } from "@/lib/field-schema/types"
import type { FieldConfigMap } from "@/lib/form-config-types"

/**
 * Builds a Zod validation schema for a single step that reflects the
 * currently visible fields.
 *
 * Fields hidden by channel config or by a visibleWhen condition that is not
 * met are treated as "hidden" in the override map, making them accept any
 * value so they never block submission.
 *
 * Reuses applyFieldConfig() from lib/build-step-schema.ts.
 */
export function buildDynamicSchema(
  baseSchema: z.ZodTypeAny,
  fields: FieldSchema[],
  data: Record<string, unknown>,
  channelConfig: FieldConfigMap,
): z.ZodObject<z.ZodRawShape> {
  const overrides: FieldConfigMap = {}

  for (const field of fields) {
    if (field.type === "separator") continue

    // Channel-level override wins first
    if (channelConfig[field.name] === "hidden") {
      overrides[field.name] = "hidden"
      continue
    }

    // Field-level conditional: if visibleWhen doesn't pass → treat as hidden
    if (field.visibleWhen && !evaluate(field.visibleWhen, data)) {
      overrides[field.name] = "hidden"
      continue
    }

    if (channelConfig[field.name] === "optional") {
      overrides[field.name] = "optional"
    } else if (channelConfig[field.name] === "required") {
      overrides[field.name] = "required"
    }
  }

  console.log("overrides", overrides)

  return applyFieldConfig(baseSchema, overrides)
}
