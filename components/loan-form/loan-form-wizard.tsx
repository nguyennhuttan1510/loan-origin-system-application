"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Send, FileText, Loader2 } from "lucide-react"
import { StepIndicator } from "@/components/loan-form/step-indicator"
import { DynamicFormStep } from "@/components/loan-form/dynamic-form-step"
import { StepOverview } from "@/components/loan-form/step-overview"
import { STEP_FIELD_SCHEMAS, buildDynamicSchema } from "@/lib/field-schema"
import {
  customerInfoSchema,
  customerIncomeSchema,
  customerRelationshipSchema,
  customerLocationSchema,
  loanInfoSchema,
  type LoanFormData,
} from "@/lib/loan-form-types"
import { FormConfigProvider, useFormConfig } from "@/lib/form-config-context"
import type { FormChannel, WizardStepConfig } from "@/lib/form-config-types"
import { DemoDataPicker } from "@/components/loan-form/demo-data-picker"
import { fillDemoData } from "@/lib/demo-data-utils"
import type { LoanApplicationSeed } from "@/lib/apis/seeder-types"

// ─── Static maps (step ID → base Zod schema / form-data key) ─────────────────

const BASE_STEP_SCHEMAS: Record<number, z.ZodTypeAny> = {
  1: customerInfoSchema,
  2: customerIncomeSchema,
  3: customerRelationshipSchema,
  4: customerLocationSchema,
  5: loanInfoSchema,
}

const STEP_DATA_KEYS: Record<number, keyof LoanFormData> = {
  1: "customerInfo",
  2: "customerIncome",
  3: "customerRelationship",
  4: "customerLocation",
  5: "loanInfo",
}

const DRAFT_KEY = (channel: FormChannel) => `loan-form-draft-${channel}`

// ─── Initial form state ───────────────────────────────────────────────────────

const initialData: LoanFormData = {
  customerInfo: {
    firstName: "", lastName: "", dateOfBirth: "", gender: "", nationalId: "",
    nationalIdIssueDate: "", nationalIdIssuePlace: "", email: "", phone: "",
    landlinePhone: "", maritalStatus: "", bidvRelationship: "",
  },
  customerIncome: {
    employmentStatus: "", employerName: "", jobTitle: "", employerAddress: "",
    employerPhone: "", yearsEmployed: "", monthlyIncome: "", businessIncome: "",
    rentalIncome: "", additionalIncome: "", incomeSource: "", livingExpenses: "",
    installmentExpenses: "", realEstateAssets: "", movableAssets: "", depositAssets: "",
  },
  customerRelationship: {
    coborrowerName: "", coborrowerDateOfBirth: "", coborrowerGender: "",
    coborrowerIdNumber: "", coborrowerIdIssueDate: "", coborrowerIdIssuePlace: "",
    coborrowerCurrentAddress: "", coborrowerMobilePhone: "", coborrowerMonthlyIncome: "",
    referenceName1: "", referencePhone1: "", referenceRelation1: "", referenceAddress1: "",
    referenceName2: "", referencePhone2: "", referenceRelation2: "",
    existingCustomer: "", accountNumber: "",
  },
  customerLocation: {
    permanentAddress: "", addressLine1: "", addressLine2: "", city: "", state: "",
    postalCode: "", country: "", residenceType: "", yearsAtAddress: "",
  },
  loanInfo: {
    loanType: "", loanMethod: "", loanAmount: "", loanTerm: "", loanPurpose: "",
    repaymentSource: "", principalRepaymentPeriod: "", interestRepaymentPeriod: "",
    principalRepaymentMethod: "", repaymentMethod: "", repaymentAccountNumber: "",
    collateralType: "", collateralValue: "", collateralAddress: "",
    collateralOwnerType: "", insurancePackage: "", insurancePaymentMethod: "",
  },
}

// ─── Public component — wraps engine with config provider ────────────────────

interface LoanFormWizardProps {
  channel?: FormChannel
  productId?: number
}

export function LoanFormWizard({ channel = "STAFF", productId }: LoanFormWizardProps) {
  return (
    <FormConfigProvider channel={channel} productId={productId}>
      <LoanFormWizardEngine />
    </FormConfigProvider>
  )
}

// ─── Engine — reads config from context ──────────────────────────────────────

function LoanFormWizardEngine() {
  const { formConfig, isLoading } = useFormConfig()

  const activeSteps = useMemo(
    () => formConfig.steps.filter((s) => s.enabled),
    [formConfig],
  )

  const contentSteps = useMemo(() => activeSteps.filter((s) => s.id !== 6), [activeSteps])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<LoanFormData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [otpState, setOtpState] = useState<"idle" | "pending" | "verified">("idle")
  const [otpValue, setOtpValue] = useState("")
  const [hasDraft, setHasDraft] = useState(false)

  const handleDemoSelect = useCallback((seed: LoanApplicationSeed) => {
    localStorage.removeItem(DRAFT_KEY(formConfig.channel))
    setHasDraft(false)
    setFormData(fillDemoData(seed))
    setCurrentStepIndex(0)
    setErrors({})
  }, [formConfig.channel])

  const currentStepConfig: WizardStepConfig = activeSteps[currentStepIndex]
  const isLastStep = currentStepIndex === activeSteps.length - 1

  // ── Draft persistence ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!formConfig.features.saveAndResume) return
    const saved = localStorage.getItem(DRAFT_KEY(formConfig.channel))
    if (saved) setHasDraft(true)
  }, [formConfig])

  const continueDraft = useCallback(() => {
    const saved = localStorage.getItem(DRAFT_KEY(formConfig.channel))
    if (!saved) return
    const { data, stepIndex } = JSON.parse(saved)
    setFormData(data)
    setCurrentStepIndex(stepIndex)
    setHasDraft(false)
  }, [formConfig.channel])

  const discardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY(formConfig.channel))
    setHasDraft(false)
  }, [formConfig.channel])

  useEffect(() => {
    if (!formConfig.features.saveAndResume || hasDraft) return
    localStorage.setItem(
      DRAFT_KEY(formConfig.channel),
      JSON.stringify({ data: formData, stepIndex: currentStepIndex }),
    )
  }, [formData, currentStepIndex, formConfig, hasDraft])

  // ── Step data update ───────────────────────────────────────────────────────

  const updateStepData = useCallback(
    (step: keyof LoanFormData, partial: Record<string, string>) => {
      setFormData((prev) => ({ ...prev, [step]: { ...prev[step], ...partial } }))
      setErrors((prev) => {
        const next = { ...prev }
        Object.keys(partial).forEach((k) => delete next[k])
        return next
      })
    },
    [],
  )

  // ── Validation — schema recomputed at validation time using visible fields ──

  const validateCurrentStep = useCallback((): boolean => {
    if (currentStepConfig.id === 6) return true

    const dataKey = STEP_DATA_KEYS[currentStepConfig.id]
    const fields = STEP_FIELD_SCHEMAS[currentStepConfig.id]
    if (!dataKey || !fields) return true

    const stepData = formData[dataKey] as Record<string, unknown>
    const schema = buildDynamicSchema(
      BASE_STEP_SCHEMAS[currentStepConfig.id],
      fields, // client config
      stepData,
      currentStepConfig.fields, // server config
    )

    const result = schema.safeParse(stepData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }, [currentStepConfig, formData])

  // ── Navigation ─────────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStepIndex((i) => Math.min(i + 1, activeSteps.length - 1))
    }
  }, [validateCurrentStep, activeSteps.length])

  const handlePrevious = useCallback(() => {
    setErrors({})
    setCurrentStepIndex((i) => Math.max(i - 1, 0))
  }, [])

  // ── Submit ─────────────────────────────────────────────────────────────────

  const doSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await new Promise((r) => setTimeout(r, 800)) // placeholder
      localStorage.removeItem(DRAFT_KEY(formConfig.channel))
      setIsSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại."
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }, [formConfig])

  const handleSubmit = useCallback(async () => {
    if (formConfig.features.requiresOtp && otpState !== "verified") {
      setOtpState("pending")
      return
    }
    await doSubmit()
  }, [formConfig.features.requiresOtp, otpState, doSubmit])

  const verifyOtp = useCallback(async () => {
    if (otpValue.length === 6) {
      setOtpState("verified")
      await doSubmit()
    }
  }, [otpValue, doSubmit])

  // ── Render: submitted ──────────────────────────────────────────────────────

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Send className="h-7 w-7 text-success" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Application Submitted</h2>
          <p className="text-muted-foreground max-w-md">
            The loan application for{" "}
            <span className="font-medium text-foreground">
              {formData.customerInfo.firstName} {formData.customerInfo.lastName}
            </span>{" "}
            has been submitted successfully. You will receive a confirmation shortly.
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData(initialData)
            setCurrentStepIndex(0)
            setIsSubmitted(false)
            setOtpState("idle")
            setOtpValue("")
          }}
          variant="outline"
        >
          <FileText className="mr-2 h-4 w-4" />
          Start New Application
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // ── Render: OTP gate ───────────────────────────────────────────────────────

  const otpOverlay = otpState === "pending" && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold">Xác nhận OTP</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập mã 6 chữ số được gửi về{" "}
              <span className="font-medium">{formData.customerInfo.phone}</span>
            </p>
          </div>
          <Input
            placeholder="000000"
            maxLength={6}
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl tracking-widest"
          />
          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setOtpState("idle")}>
              Hủy
            </Button>
            <Button className="flex-1" onClick={verifyOtp} disabled={otpValue.length !== 6 || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ── Render: draft resume banner ────────────────────────────────────────────

  const draftBanner = hasDraft && (
    <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
      <span className="flex-1 text-blue-800">Bạn có đơn chưa hoàn thành. Tiếp tục từ nơi bạn dừng lại?</span>
      <Button size="sm" variant="outline" onClick={continueDraft}>Tiếp tục</Button>
      <Button size="sm" variant="ghost" onClick={discardDraft}>Bắt đầu lại</Button>
    </div>
  )

  // ── Render: step content ───────────────────────────────────────────────────

  const stepContent = (() => {
    if (currentStepConfig.id === 6) return <StepOverview data={formData} />

    const dataKey = STEP_DATA_KEYS[currentStepConfig.id]
    const fields = STEP_FIELD_SCHEMAS[currentStepConfig.id]
    if (!dataKey || !fields) return null

    return (
      <DynamicFormStep
        stepId={currentStepConfig.id}
        title={currentStepConfig.title}
        description={currentStepConfig.description}
        fields={fields}
        data={formData[dataKey] as Record<string, string>}
        onChange={(partial) => updateStepData(dataKey, partial)}
        errors={errors}
      />
    )
  })()

  // ── Render: wizard shell ───────────────────────────────────────────────────

  const displayStepNumber = contentSteps.findIndex((s) => s.id === currentStepConfig.id) + 1
  const totalContentSteps = contentSteps.length

  return (
    <>
      {otpOverlay}
      <div className="flex flex-col gap-8">
        {draftBanner}

        {process.env.NODE_ENV !== "production" && (
          <div className="flex justify-end">
            <DemoDataPicker onSelect={handleDemoSelect} />
          </div>
        )}

        <StepIndicator currentStep={currentStepConfig.id} activeStepIds={activeSteps.map((s) => s.id)} />

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 md:p-8">{stepContent}</CardContent>
        </Card>

        {submitError && otpState === "idle" && (
          <p className="text-sm text-destructive text-center">{submitError}</p>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <p className="hidden text-sm text-muted-foreground sm:block">
            {currentStepConfig.id !== 6
              ? `Bước ${displayStepNumber} / ${totalContentSteps}`
              : "Xem lại & Nộp đơn"}
          </p>

          {!isLastStep ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
              {isSubmitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
