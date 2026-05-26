export type FormChannel = "STAFF" | "CLIENT" | "POS"
export type FieldVisibility = "required" | "optional" | "hidden"
export type FieldConfigMap = Record<string, FieldVisibility>

export interface WizardStepConfig {
  id: number
  title: string
  description: string
  enabled: boolean
  fields: FieldConfigMap
}

export interface FormFeatures {
  requiresOtp: boolean
  requiresEkyc: boolean
  saveAndResume: boolean
}

export interface FormConfig {
  channel: FormChannel
  productId?: number
  steps: WizardStepConfig[]
  features: FormFeatures
  submitEndpoint: string
}
