import { step1Fields } from "@/lib/field-schema/step-1"
import { step2Fields } from "@/lib/field-schema/step-2"
import { step3Fields } from "@/lib/field-schema/step-3"
import { step4Fields } from "@/lib/field-schema/step-4"
import { step5Fields } from "@/lib/field-schema/step-5"
import type { FieldSchema } from "@/lib/field-schema/types"

export type { FieldSchema }
export { evaluate } from "@/lib/field-schema/evaluator"
export { buildDynamicSchema } from "@/lib/field-schema/dynamic-schema"

export const STEP_FIELD_SCHEMAS: Record<number, FieldSchema[]> = {
  1: step1Fields,
  2: step2Fields,
  3: step3Fields,
  4: step4Fields,
  5: step5Fields,
}
