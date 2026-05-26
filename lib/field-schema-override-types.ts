import type { VisibleWhenNode } from "@/lib/field-schema/types"

export interface FieldSchemaOverride {
  label?: string
  placeholder?: string
  /**
   * undefined = no override (use static default)
   * null      = explicitly removed (field always visible)
   * node      = override condition applied
   */
  visibleWhen?: VisibleWhenNode | null
}

export interface FieldSchemaOverrideMap {
  version: 1
  updatedAt: string | null
  overrides: Record<string, FieldSchemaOverride>
}

export const EMPTY_OVERRIDE_MAP: FieldSchemaOverrideMap = {
  version: 1,
  updatedAt: null,
  overrides: {},
}
