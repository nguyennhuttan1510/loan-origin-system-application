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
import type { CustomerInfo } from "@/lib/loan-form-types"

interface StepCustomerInfoProps {
  data: CustomerInfo
  onChange: (data: Partial<CustomerInfo>) => void
  errors: Record<string, string>
}

export function StepCustomerInfo({ data, onChange, errors }: StepCustomerInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Customer Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the personal details of the loan applicant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className={errors.firstName ? "border-destructive" : ""}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className={errors.lastName ? "border-destructive" : ""}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className={errors.dateOfBirth ? "border-destructive" : ""}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={data.gender} onValueChange={(val) => onChange({ gender: val })}>
            <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nationalId">National ID / SSN</Label>
          <Input
            id="nationalId"
            placeholder="Enter national ID"
            value={data.nationalId}
            onChange={(e) => onChange({ nationalId: e.target.value })}
            className={errors.nationalId ? "border-destructive" : ""}
          />
          {errors.nationalId && (
            <p className="text-xs text-destructive">{errors.nationalId}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            value={data.maritalStatus}
            onValueChange={(val) => onChange({ maritalStatus: val })}
          >
            <SelectTrigger className={errors.maritalStatus ? "border-destructive" : ""}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
          {errors.maritalStatus && (
            <p className="text-xs text-destructive">{errors.maritalStatus}</p>
          )}
        </div>
      </div>
    </div>
  )
}
