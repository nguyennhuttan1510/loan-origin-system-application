"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { FormConfig, FormChannel, FieldVisibility } from "@/lib/form-config-types"
import { getDefaultConfig } from "@/lib/form-config-defaults"
import FormConfigApi from "@/lib/apis/form-config"
import { EMPTY_OVERRIDE_MAP, type FieldSchemaOverrideMap } from "@/lib/field-schema-override-types"
import type { FieldSchema } from "@/lib/field-schema/types"

interface FormConfigContextValue {
  formConfig: FormConfig
  isLoading: boolean
  getFieldVisibility: (stepId: number, fieldName: string) => FieldVisibility
  isStepEnabled: (stepId: number) => boolean
  applyOverrides: (stepId: number, fields: FieldSchema[]) => FieldSchema[]
}

const FormConfigContext = createContext<FormConfigContextValue | null>(null)

interface FormConfigProviderProps {
  channel: FormChannel
  productId?: number
  children: ReactNode
}

export function FormConfigProvider({ channel, productId, children }: FormConfigProviderProps) {
  const [formConfig, setFormConfig] = useState<FormConfig>(() => getDefaultConfig(channel))
  const [isLoading, setIsLoading] = useState(true)
  const [overrideMap, setOverrideMap] = useState<FieldSchemaOverrideMap>(EMPTY_OVERRIDE_MAP)

  useEffect(() => {
    setIsLoading(true)
    FormConfigApi.getFormConfig(channel, productId)
      .then(setFormConfig)
      .finally(() => setIsLoading(false))
  }, [channel, productId])

  useEffect(() => {
    fetch("/api/field-schema-overrides")
      .then((r) => r.json())
      .then((data: FieldSchemaOverrideMap) => setOverrideMap(data))
      .catch(() => {
        // silent fallback — form still works with static defaults
      })
  }, [])

  const getFieldVisibility = useCallback(
    (stepId: number, fieldName: string): FieldVisibility => {
      const step = formConfig.steps.find((s) => s.id === stepId)
      return step?.fields[fieldName] ?? "required"
    },
    [formConfig],
  )

  const isStepEnabled = useCallback(
    (stepId: number) => formConfig.steps.find((s) => s.id === stepId)?.enabled ?? true,
    [formConfig],
  )

  const applyOverrides = useCallback(
    (stepId: number, fields: FieldSchema[]): FieldSchema[] => {
      return fields.map((field) => {
        if (field.type === "separator") return field
        const key = `${stepId}:${field.name}`
        const ov = overrideMap.overrides[key]
        if (!ov) return field

        const merged = { ...field }
        if (ov.label !== undefined) merged.label = ov.label
        if (ov.placeholder !== undefined) merged.placeholder = ov.placeholder
        if ("visibleWhen" in ov) {
          // null = admin explicitly removed condition → always visible
          // ConditionNode = override condition
          merged.visibleWhen = ov.visibleWhen === null ? undefined : ov.visibleWhen ?? undefined
        }
        return merged
      })
    },
    [overrideMap],
  )

  return (
    <FormConfigContext.Provider
      value={{ formConfig, isLoading, getFieldVisibility, isStepEnabled, applyOverrides }}
    >
      {children}
    </FormConfigContext.Provider>
  )
}

export function useFormConfig(): FormConfigContextValue {
  const ctx = useContext(FormConfigContext)
  if (!ctx) throw new Error("useFormConfig must be used within <FormConfigProvider>")
  return ctx
}

/** Convenience hook for a single field in a known step. */
export function useFieldVisibility(stepId: number, fieldName: string): FieldVisibility {
  const { getFieldVisibility } = useFormConfig()
  return getFieldVisibility(stepId, fieldName)
}
