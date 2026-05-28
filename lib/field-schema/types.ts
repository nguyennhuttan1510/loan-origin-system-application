// ─── Condition tree ───────────────────────────────────────────────────────────

export type ConditionOp = "eq" | "neq" | "in" | "nin" | "filled" | "empty"

export interface ConditionLeaf {
  field: string
  op: ConditionOp
  value?: string | string[]
}

export interface ConditionAnd {
  and: VisibleWhenNode[]
}

export interface ConditionOr {
  or: VisibleWhenNode[]
}

export type VisibleWhenNode = ConditionLeaf | ConditionAnd | ConditionOr

// ─── Field schema ─────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "date"
  | "number"
  | "tel"
  | "email"
  | "select"
  | "textarea"
  | "separator"

export interface SelectOption {
  value: string
  label: string
}

export interface FieldSchema {
  /** Key in form data object. Separator items use "__sep_<key>". */
  name: string
  type: FieldType
  label?: string
  placeholder?: string
  /** Only for type="select" */
  options?: SelectOption[]
  /** Category ID to fetch options from API (replaces hardcoded `options`) */
  categoryId?: string
  /** Grid column span in the 2-col grid. Separators default to 2. */
  colSpan?: 1 | 2
  /** Recursive AND/OR condition tree. Field hidden when condition is false. */
  visibleWhen?: VisibleWhenNode
}
