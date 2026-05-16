"use client"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  User,
  DollarSign,
  Users,
  MapPin,
  FileText,
} from "lucide-react"
import type { LoanFormData } from "@/lib/loan-form-types"

interface StepOverviewProps {
  data: LoanFormData
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/([0-9])/g, " $1")
    .trim()
}

function formatValue(key: string, value: string): string {
  if (!value) return "N/A"
  if (key.toLowerCase().includes("income") || key.toLowerCase().includes("amount") || key.toLowerCase().includes("value")) {
    const num = Number(value)
    if (!isNaN(num)) return `$${num.toLocaleString()}`
  }
  if (key === "loanTerm") return `${value} Months`
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ")
}

function SectionCard({
  icon: Icon,
  title,
  data,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  data: Record<string, string>
}) {
  const entries = Object.entries(data).filter(([, v]) => v && v.length > 0)

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{formatLabel(key)}</span>
            <span className="text-sm font-medium text-foreground">
              {formatValue(key, value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StepOverview({ data }: StepOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Application Review</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please review all information before submitting the loan application.
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          Draft
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        <SectionCard
          icon={User}
          title="Customer Information"
          data={data.customerInfo}
        />
        <SectionCard
          icon={DollarSign}
          title="Income Details"
          data={data.customerIncome}
        />
        <SectionCard
          icon={Users}
          title="Relationships"
          data={data.customerRelationship}
        />
        <SectionCard
          icon={MapPin}
          title="Location"
          data={data.customerLocation}
        />
        <SectionCard
          icon={FileText}
          title="Loan Details"
          data={data.loanInfo}
        />
      </div>
    </div>
  )
}
