"use client"

import { useEffect, useMemo, useRef } from "react"
import { DynamicField } from "@/components/loan-form/dynamic-field"
import { evaluate } from "@/lib/field-schema/evaluator"
import type { FieldSchema } from "@/lib/field-schema/types"
import { useFormConfig } from "@/lib/form-config-context"

interface DynamicFormStepProps {
  stepId: number
  title: string
  description: string
  fields: FieldSchema[]
  data: Record<string, string>
  onChange: (partial: Record<string, string>) => void
  errors: Record<string, string>
}

export function DynamicFormStep({
  stepId,
  title,
  description,
  fields,
  data,
  onChange,
  errors,
}: DynamicFormStepProps) {
  const { getFieldVisibility, applyOverrides } = useFormConfig()

  // Keep a stable ref to onChange so the reset effect doesn't re-run on every render
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Merge admin overrides (label, placeholder, visibleWhen) into static field schemas
  const mergedFields = useMemo(() => applyOverrides(stepId, fields), [applyOverrides, stepId, fields])

  // Which regular fields are currently visible, and which separators have visible fields after them
  const { visibleSet, visibleSeparators } = useMemo(() => {
    const visible = new Set<string>()
    for (const field of mergedFields) {
      if (field.type === "separator") continue
      if (getFieldVisibility(stepId, field.name) === "hidden") continue
      if (field.visibleWhen && !evaluate(field.visibleWhen, data)) continue
      visible.add(field.name)
    }

    // Forward pass: mark a separator as visible only if at least one field after it is visible
    const separators = new Set<string>()
    let lastSep: string | null = null
    for (const field of mergedFields) {
      if (field.type === "separator") {
        lastSep = field.name
      } else if (lastSep && visible.has(field.name)) {
        separators.add(lastSep)
        lastSep = null
      }
    }

    return { visibleSet: visible, visibleSeparators: separators }
  }, [mergedFields, data, stepId, getFieldVisibility])

  // Reset hidden field values to "" so orphaned data doesn't pass to the next step
  useEffect(() => {
    const resets: Record<string, string> = {}
    for (const field of mergedFields) {
      if (field.type === "separator") continue
      if (!visibleSet.has(field.name) && (data[field.name] ?? "") !== "") {
        resets[field.name] = ""
      }
    }
    if (Object.keys(resets).length > 0) onChangeRef.current(resets)
  }, [mergedFields, data, visibleSet])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mergedFields.map((field, idx) => {
          if (field.type === "separator") {
            if (!visibleSeparators.has(field.name)) return null
            return (
              <div
                key={field.name}
                className={`col-span-full ${idx > 0 ? "pt-4 border-t border-border" : ""}`}
              >
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  {field.label}
                </h3>
              </div>
            )
          }

          if (!visibleSet.has(field.name)) return null

          return (
            <div key={field.name} className={field.colSpan === 2 ? "md:col-span-2" : undefined}>
              <DynamicField
                field={field}
                value={data[field.name] ?? ""}
                onChange={(val) => onChange({ [field.name]: val })}
                error={errors[field.name]}
                channelVisibility={getFieldVisibility(stepId, field.name)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
