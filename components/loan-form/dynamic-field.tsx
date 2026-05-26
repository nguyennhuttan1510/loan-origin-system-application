"use client"

import { TextField } from "@/components/loan-form/fields/text-field"
import { SelectField } from "@/components/loan-form/fields/select-field"
import { TextareaField } from "@/components/loan-form/fields/textarea-field"
import type { FieldSchema } from "@/lib/field-schema/types"
import type { FieldVisibility } from "@/lib/form-config-types"

interface DynamicFieldProps {
  field: FieldSchema
  value: string
  onChange: (value: string) => void
  error?: string
  channelVisibility?: FieldVisibility
}

function buildLabel(field: FieldSchema, channelVisibility?: FieldVisibility) {
  if (channelVisibility !== "optional") return field.label
  return (
    <>
      {field.label}{" "}
      <span className="text-muted-foreground font-normal">(Tuỳ chọn)</span>
    </>
  )
}

export function DynamicField({ field, value, onChange, error, channelVisibility }: DynamicFieldProps) {
  const label = buildLabel(field, channelVisibility)

  if (field.type === "select") {
    return (
      <SelectField
        name={field.name}
        label={label}
        options={field.options ?? []}
        placeholder={field.placeholder ?? `Chọn ${field.label?.toLowerCase()}`}
        value={value}
        onChange={onChange}
        error={error}
      />
    )
  }

  if (field.type === "textarea") {
    return (
      <TextareaField
        name={field.name}
        label={label}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        error={error}
      />
    )
  }

  return (
    <TextField
      name={field.name}
      label={label}
      type={field.type as "text" | "number" | "tel" | "email" | "date"}
      placeholder={field.placeholder}
      value={value}
      onChange={onChange}
      error={error}
    />
  )
}
