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
import type { CustomerLocation } from "@/lib/loan-form-types"

interface StepCustomerLocationProps {
  data: CustomerLocation
  onChange: (data: Partial<CustomerLocation>) => void
  errors: Record<string, string>
}

export function StepCustomerLocation({ data, onChange, errors }: StepCustomerLocationProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Location Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the residential address of the applicant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input
            id="addressLine1"
            placeholder="Street address, P.O. box"
            value={data.addressLine1}
            onChange={(e) => onChange({ addressLine1: e.target.value })}
            className={errors.addressLine1 ? "border-destructive" : ""}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-destructive">{errors.addressLine1}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input
            id="addressLine2"
            placeholder="Apartment, suite, unit, building (optional)"
            value={data.addressLine2 || ""}
            onChange={(e) => onChange({ addressLine2: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter city"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state">State / Province</Label>
          <Input
            id="state"
            placeholder="Enter state or province"
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className={errors.state ? "border-destructive" : ""}
          />
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            placeholder="e.g. 10001"
            value={data.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            className={errors.postalCode ? "border-destructive" : ""}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={data.country}
            onValueChange={(val) => onChange({ country: val })}
          >
            <SelectTrigger className={errors.country ? "border-destructive" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-xs text-destructive">{errors.country}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="residenceType">Residence Type</Label>
          <Select
            value={data.residenceType}
            onValueChange={(val) => onChange({ residenceType: val })}
          >
            <SelectTrigger className={errors.residenceType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="family">Living with Family</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.residenceType && (
            <p className="text-xs text-destructive">{errors.residenceType}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="yearsAtAddress">Years at Address</Label>
          <Input
            id="yearsAtAddress"
            type="number"
            placeholder="e.g. 3"
            value={data.yearsAtAddress}
            onChange={(e) => onChange({ yearsAtAddress: e.target.value })}
            className={errors.yearsAtAddress ? "border-destructive" : ""}
          />
          {errors.yearsAtAddress && (
            <p className="text-xs text-destructive">{errors.yearsAtAddress}</p>
          )}
        </div>
      </div>
    </div>
  )
}
