"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { LoanInfo } from "@/lib/loan-form-types"

interface StepLoanInfoProps {
  data: LoanInfo
  onChange: (data: Partial<LoanInfo>) => void
  errors: Record<string, string>
}

export function StepLoanInfo({ data, onChange, errors }: StepLoanInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Loan Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Specify the loan type, amount, and terms for this application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="loanType">Loan Type</Label>
          <Select
            value={data.loanType}
            onValueChange={(val) => onChange({ loanType: val })}
          >
            <SelectTrigger className={errors.loanType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select loan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Loan</SelectItem>
              <SelectItem value="mortgage">Mortgage</SelectItem>
              <SelectItem value="auto">Auto Loan</SelectItem>
              <SelectItem value="business">Business Loan</SelectItem>
              <SelectItem value="education">Education Loan</SelectItem>
              <SelectItem value="home-equity">Home Equity Loan</SelectItem>
            </SelectContent>
          </Select>
          {errors.loanType && (
            <p className="text-xs text-destructive">{errors.loanType}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="loanAmount">Loan Amount ($)</Label>
          <Input
            id="loanAmount"
            type="number"
            placeholder="e.g. 50000"
            value={data.loanAmount}
            onChange={(e) => onChange({ loanAmount: e.target.value })}
            className={errors.loanAmount ? "border-destructive" : ""}
          />
          {errors.loanAmount && (
            <p className="text-xs text-destructive">{errors.loanAmount}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="loanTerm">Loan Term (Months)</Label>
          <Select
            value={data.loanTerm}
            onValueChange={(val) => onChange({ loanTerm: val })}
          >
            <SelectTrigger className={errors.loanTerm ? "border-destructive" : ""}>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
              <SelectItem value="36">36 Months</SelectItem>
              <SelectItem value="48">48 Months</SelectItem>
              <SelectItem value="60">60 Months</SelectItem>
              <SelectItem value="120">120 Months</SelectItem>
              <SelectItem value="240">240 Months</SelectItem>
              <SelectItem value="360">360 Months</SelectItem>
            </SelectContent>
          </Select>
          {errors.loanTerm && (
            <p className="text-xs text-destructive">{errors.loanTerm}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="interestRateType">Interest Rate Type</Label>
          <Select
            value={data.interestRateType}
            onValueChange={(val) => onChange({ interestRateType: val })}
          >
            <SelectTrigger
              className={errors.interestRateType ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select rate type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Rate</SelectItem>
              <SelectItem value="variable">Variable Rate</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          {errors.interestRateType && (
            <p className="text-xs text-destructive">{errors.interestRateType}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="loanPurpose">Loan Purpose</Label>
          <Textarea
            id="loanPurpose"
            placeholder="Describe the purpose of this loan..."
            value={data.loanPurpose}
            onChange={(e) => onChange({ loanPurpose: e.target.value })}
            className={errors.loanPurpose ? "border-destructive" : ""}
            rows={3}
          />
          {errors.loanPurpose && (
            <p className="text-xs text-destructive">{errors.loanPurpose}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="collateralType">Collateral Type <span className="text-muted-foreground">(Optional)</span></Label>
          <Select
            value={data.collateralType || ""}
            onValueChange={(val) => onChange({ collateralType: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select collateral type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="deposit">Fixed Deposit</SelectItem>
              <SelectItem value="securities">Securities</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="collateralValue">Collateral Value ($) <span className="text-muted-foreground">(Optional)</span></Label>
          <Input
            id="collateralValue"
            type="number"
            placeholder="e.g. 100000"
            value={data.collateralValue || ""}
            onChange={(e) => onChange({ collateralValue: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
