"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEPS } from "@/lib/loan-form-types"

interface StepIndicatorProps {
  currentStep: number
  /** Subset of step IDs to display. Defaults to all steps when omitted. */
  activeStepIds?: number[]
}

export function StepIndicator({ currentStep, activeStepIds }: StepIndicatorProps) {
  const visibleSteps = activeStepIds
    ? STEPS.filter((s) => activeStepIds.includes(s.id))
    : STEPS

  const currentVisible = visibleSteps.find((s) => s.id === currentStep) ?? visibleSteps[0]

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2">
        {visibleSteps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isUpcoming = currentStep < step.id

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center w-full">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent &&
                        "bg-primary text-primary-foreground ring-4 ring-primary/20",
                      isUpcoming &&
                        "border-2 border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < visibleSteps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-2 transition-all duration-300",
                        isCompleted ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
                <div className="text-center hidden md:block">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-2 md:hidden">
        <p className="text-sm font-medium text-primary">
          {currentVisible.title}
        </p>
        <p className="text-xs text-muted-foreground">{currentVisible.description}</p>
      </div>
    </nav>
  )
}
