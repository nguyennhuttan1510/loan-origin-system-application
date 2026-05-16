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
import { Separator } from "@/components/ui/separator"
import type { CustomerRelationship } from "@/lib/loan-form-types"

interface StepCustomerRelationshipProps {
  data: CustomerRelationship
  onChange: (data: Partial<CustomerRelationship>) => void
  errors: Record<string, string>
}

export function StepCustomerRelationship({
  data,
  onChange,
  errors,
}: StepCustomerRelationshipProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Relationships</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide reference contacts and banking relationship details.
        </p>
      </div>

      {/* Reference 1 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Primary Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceName1">Full Name</Label>
            <Input
              id="referenceName1"
              placeholder="Reference full name"
              value={data.referenceName1}
              onChange={(e) => onChange({ referenceName1: e.target.value })}
              className={errors.referenceName1 ? "border-destructive" : ""}
            />
            {errors.referenceName1 && (
              <p className="text-xs text-destructive">{errors.referenceName1}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referencePhone1">Phone Number</Label>
            <Input
              id="referencePhone1"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.referencePhone1}
              onChange={(e) => onChange({ referencePhone1: e.target.value })}
              className={errors.referencePhone1 ? "border-destructive" : ""}
            />
            {errors.referencePhone1 && (
              <p className="text-xs text-destructive">{errors.referencePhone1}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceRelation1">Relationship</Label>
            <Select
              value={data.referenceRelation1}
              onValueChange={(val) => onChange({ referenceRelation1: val })}
            >
              <SelectTrigger
                className={errors.referenceRelation1 ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.referenceRelation1 && (
              <p className="text-xs text-destructive">{errors.referenceRelation1}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Reference 2 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Secondary Reference <span className="text-muted-foreground font-normal">(Optional)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceName2">Full Name</Label>
            <Input
              id="referenceName2"
              placeholder="Reference full name"
              value={data.referenceName2 || ""}
              onChange={(e) => onChange({ referenceName2: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referencePhone2">Phone Number</Label>
            <Input
              id="referencePhone2"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data.referencePhone2 || ""}
              onChange={(e) => onChange({ referencePhone2: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceRelation2">Relationship</Label>
            <Select
              value={data.referenceRelation2 || ""}
              onValueChange={(val) => onChange({ referenceRelation2: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Existing Relationship */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Banking Relationship
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="existingCustomer">Existing Customer?</Label>
            <Select
              value={data.existingCustomer}
              onValueChange={(val) => onChange({ existingCustomer: val })}
            >
              <SelectTrigger
                className={errors.existingCustomer ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {errors.existingCustomer && (
              <p className="text-xs text-destructive">{errors.existingCustomer}</p>
            )}
          </div>

          {data.existingCustomer === "yes" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Existing account number"
                value={data.accountNumber || ""}
                onChange={(e) => onChange({ accountNumber: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
