"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface TextFieldProps {
  name: string
  label: ReactNode
  type?: "text" | "number" | "tel" | "email" | "date"
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function TextField({ name, label, type = "text", placeholder, value, onChange, error }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
