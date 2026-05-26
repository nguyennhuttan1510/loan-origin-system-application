import type { VisibleWhenNode } from "@/lib/field-schema/types"

/**
 * Recursively evaluates a visibleWhen condition tree against the current
 * form step data. Returns true when the field should be visible.
 */
export function evaluate(
  node: VisibleWhenNode,
  data: Record<string, unknown>,
): boolean {
  if ("and" in node) return node.and.every((n) => evaluate(n, data))
  if ("or" in node) return node.or.some((n) => evaluate(n, data))

  const v = (data[node.field] ?? "") as string

  switch (node.op) {
    case "eq":     return v === node.value
    case "neq":    return v !== node.value
    case "in":     return Array.isArray(node.value) && node.value.includes(v)
    case "nin":    return Array.isArray(node.value) && !node.value.includes(v)
    case "filled": return Boolean(v)
    case "empty":  return !v
  }
}
