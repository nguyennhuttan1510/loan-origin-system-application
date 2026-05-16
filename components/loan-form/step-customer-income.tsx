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
import type { CustomerIncome } from "@/lib/loan-form-types"

interface StepCustomerIncomeProps {
  data: CustomerIncome
  onChange: (data: Partial<CustomerIncome>) => void
  errors: Record<string, string>
}

export function StepCustomerIncome({ data, onChange, errors }: StepCustomerIncomeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Income Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide employment and income information for the applicant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="employmentStatus">Employment Status</Label>
          <Select
            value={data.employmentStatus}
            onValueChange={(val) => onChange({ employmentStatus: val })}
          >
            <SelectTrigger className={errors.employmentStatus ? "border-destructive" : ""}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
          {errors.employmentStatus && (
            <p className="text-xs text-destructive">{errors.employmentStatus}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="employerName">Employer Name</Label>
          <Input
            id="employerName"
            placeholder="Company or employer name"
            value={data.employerName}
            onChange={(e) => onChange({ employerName: e.target.value })}
            className={errors.employerName ? "border-destructive" : ""}
          />
          {errors.employerName && (
            <p className="text-xs text-destructive">{errors.employerName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Software Engineer"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            className={errors.jobTitle ? "border-destructive" : ""}
          />
          {errors.jobTitle && (
            <p className="text-xs text-destructive">{errors.jobTitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="yearsEmployed">Years Employed</Label>
          <Input
            id="yearsEmployed"
            type="number"
            placeholder="e.g. 5"
            value={data.yearsEmployed}
            onChange={(e) => onChange({ yearsEmployed: e.target.value })}
            className={errors.yearsEmployed ? "border-destructive" : ""}
          />
          {errors.yearsEmployed && (
            <p className="text-xs text-destructive">{errors.yearsEmployed}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
          <Input
            id="monthlyIncome"
            type="number"
            placeholder="e.g. 5000"
            value={data.monthlyIncome}
            onChange={(e) => onChange({ monthlyIncome: e.target.value })}
            className={errors.monthlyIncome ? "border-destructive" : ""}
          />
          {errors.monthlyIncome && (
            <p className="text-xs text-destructive">{errors.monthlyIncome}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="additionalIncome">Additional Income ($)</Label>
          <Input
            id="additionalIncome"
            type="number"
            placeholder="Optional"
            value={data.additionalIncome || ""}
            onChange={(e) => onChange({ additionalIncome: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="incomeSource">Additional Income Source</Label>
          <Select
            value={data.incomeSource || ""}
            onValueChange={(val) => onChange({ incomeSource: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rental">Rental Income</SelectItem>
              <SelectItem value="investment">Investment Returns</SelectItem>
              <SelectItem value="freelance">Freelance Work</SelectItem>
              <SelectItem value="pension">Pension</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
