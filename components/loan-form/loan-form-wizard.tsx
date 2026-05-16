"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Send, FileText } from "lucide-react"
import { StepIndicator } from "@/components/loan-form/step-indicator"
import { StepCustomerInfo } from "@/components/loan-form/step-customer-info"
import { StepCustomerIncome } from "@/components/loan-form/step-customer-income"
import { StepCustomerRelationship } from "@/components/loan-form/step-customer-relationship"
import { StepCustomerLocation } from "@/components/loan-form/step-customer-location"
import { StepLoanInfo } from "@/components/loan-form/step-loan-info"
import { StepOverview } from "@/components/loan-form/step-overview"
import {
  customerInfoSchema,
  customerIncomeSchema,
  customerRelationshipSchema,
  customerLocationSchema,
  loanInfoSchema,
  type LoanFormData,
  type CustomerInfo,
  type CustomerIncome,
  type CustomerRelationship,
  type CustomerLocation,
  type LoanInfo,
} from "@/lib/loan-form-types"
import type { ZodSchema } from "zod"

const initialData: LoanFormData = {
  customerInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    email: "",
    phone: "",
    maritalStatus: "",
  },
  customerIncome: {
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    additionalIncome: "",
    incomeSource: "",
    yearsEmployed: "",
  },
  customerRelationship: {
    referenceName1: "",
    referencePhone1: "",
    referenceRelation1: "",
    referenceName2: "",
    referencePhone2: "",
    referenceRelation2: "",
    existingCustomer: "",
    accountNumber: "",
  },
  customerLocation: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    residenceType: "",
    yearsAtAddress: "",
  },
  loanInfo: {
    loanType: "",
    loanAmount: "",
    loanTerm: "",
    interestRateType: "",
    loanPurpose: "",
    collateralType: "",
    collateralValue: "",
  },
}

const stepSchemas: Record<number, ZodSchema> = {
  1: customerInfoSchema,
  2: customerIncomeSchema,
  3: customerRelationshipSchema,
  4: customerLocationSchema,
  5: loanInfoSchema,
}

const stepDataKeys: Record<number, keyof LoanFormData> = {
  1: "customerInfo",
  2: "customerIncome",
  3: "customerRelationship",
  4: "customerLocation",
  5: "loanInfo",
}

export function LoanFormWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LoanFormData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateStepData = useCallback(
    <T extends keyof LoanFormData>(step: T, partial: Partial<LoanFormData[T]>) => {
      setFormData((prev) => ({
        ...prev,
        [step]: { ...prev[step], ...partial },
      }))
      // Clear errors for changed fields
      const clearedErrors = { ...errors }
      Object.keys(partial).forEach((key) => {
        delete clearedErrors[key]
      })
      setErrors(clearedErrors)
    },
    [errors]
  )

  const validateCurrentStep = useCallback((): boolean => {
    if (currentStep === 6) return true

    const schema = stepSchemas[currentStep]
    const dataKey = stepDataKeys[currentStep]
    const result = schema.safeParse(formData[dataKey])

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
  }, [currentStep, formData])

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }, [validateCurrentStep])

  const handlePrevious = useCallback(() => {
    setErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true)
  }, [])

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Send className="h-7 w-7 text-success" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Application Submitted
          </h2>
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
            setCurrentStep(1)
            setIsSubmitted(false)
          }}
          variant="outline"
        >
          <FileText className="mr-2 h-4 w-4" />
          Start New Application
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator currentStep={currentStep} />

      <Card className="border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          {currentStep === 1 && (
            <StepCustomerInfo
              data={formData.customerInfo}
              onChange={(partial) =>
                updateStepData("customerInfo", partial as Partial<CustomerInfo>)
              }
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <StepCustomerIncome
              data={formData.customerIncome}
              onChange={(partial) =>
                updateStepData("customerIncome", partial as Partial<CustomerIncome>)
              }
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <StepCustomerRelationship
              data={formData.customerRelationship}
              onChange={(partial) =>
                updateStepData(
                  "customerRelationship",
                  partial as Partial<CustomerRelationship>
                )
              }
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <StepCustomerLocation
              data={formData.customerLocation}
              onChange={(partial) =>
                updateStepData("customerLocation", partial as Partial<CustomerLocation>)
              }
              errors={errors}
            />
          )}
          {currentStep === 5 && (
            <StepLoanInfo
              data={formData.loanInfo}
              onChange={(partial) =>
                updateStepData("loanInfo", partial as Partial<LoanInfo>)
              }
              errors={errors}
            />
          )}
          {currentStep === 6 && <StepOverview data={formData} />}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <p className="text-sm text-muted-foreground hidden sm:block">
          Step {currentStep} of 6
        </p>

        {currentStep < 6 ? (
          <Button onClick={handleNext} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2">
            <Send className="h-4 w-4" />
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}
