"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ReactNode } from "react"

interface TextareaFieldProps {
  name: string
  label: ReactNode
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function TextareaField({ name, label, placeholder, value, onChange, error }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
