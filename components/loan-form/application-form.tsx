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
import type {CustomerInfo, InitialApplicationType} from "@/lib/loan-form-types"
import {Send} from "lucide-react";
import {Button} from "@/components/ui/button";
import {CategoryItem, ProductPropertiesResponse, LoanProductResponse} from "@/lib/apis/category-types";
import Category from "@/lib/apis/category";
import {Slider} from "@/components/ui/slider";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {StatusSubmit} from "@/app/application/create/page";

export interface Categories {
  products: CategoryItem[];
  productProperties: ProductPropertiesResponse
}

interface InitialApplicationProps {
  data: InitialApplicationType
  status: StatusSubmit | undefined
  errors: Record<string, string>
  categories: Categories
  productSelected: LoanProductResponse | undefined
  onChange: (data: Partial<InitialApplicationType>) => void
  onSubmit: () => void
  onSelectedProduct: (val: CategoryItem["value"]) => void
}

export function InitialApplication({ data, errors, status, categories, productSelected, onChange, onSubmit, onSelectedProduct}: InitialApplicationProps) {
  return (
    <div className="flex flex-col gap-6">
      {!status?.success && (
        <Alert variant="destructive">
          <AlertDescription>{status?.message}</AlertDescription>
        </Alert>
      )}

      {status?.success && (
        <Alert className="border-success bg-success/10">
          <AlertDescription className="text-success">
            {status?.message}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-xl font-semibold text-foreground">Loan Application</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the info to init loan applicant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="productId">Product</Label>
          <Select
            value={data.productId}
            onValueChange={(val) => {
              onChange({ productId: val })
              onSelectedProduct(val)
            }}
          >
            <SelectTrigger className={`w-full ${errors.productId ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {categories.products.map((product) => (
                <SelectItem key={product.value} value={product.value}>{product.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productId && (
            <p className="text-xs text-destructive">{errors.productId}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="requestAmount">Request amount</Label>
          <Input
            id="requestAmount"
            placeholder="Enter first name"
            value={data.requestAmount ? new Intl.NumberFormat().format(parseInt(data.requestAmount)) : data.requestAmount}
            onChange={(e) => onChange({ requestAmount: e.target.value })}
            className={errors.requestAmount ? "border-destructive" : ""}
          />
          <Slider step={1000000} defaultValue={[productSelected?.maxLoanAmount ? productSelected.maxLoanAmount / 2 : 0]} min={productSelected?.minLoanAmount} max={productSelected?.maxLoanAmount} onValueChange={(value) => {
            onChange({ requestAmount: String(value?.[0]) })
          }} />
          {errors.requestAmount && (
            <p className="text-xs text-destructive">{errors.requestAmount}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="requestedTenureMonths">Tenure request</Label>
          <Select
            value={data.requestedTenureMonths}
            onValueChange={(val) => onChange({ requestedTenureMonths: val })}
          >
            <SelectTrigger className={`w-full ${errors.requestedTenureMonths ? "border-destructive" : ""}`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {categories.productProperties?.tenures?.map((tenure) => (
                <SelectItem key={tenure.value} value={tenure.value}>{tenure.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.requestedTenureMonths && (
            <p className="text-xs text-destructive">{errors.requestedTenureMonths}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="purpose">Loan purpose</Label>
          <Input
            id="purpose"
            placeholder="Enter purpose"
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
            className={errors.purpose ? "border-destructive" : ""}
          />
          {errors.purpose && (
            <p className="text-xs text-destructive">{errors.purpose}</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground">Customer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the customer info to init loan applicant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Fullname</Label>
          <Input
            id="firstName"
            placeholder="Enter fullname"
            value={data.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            className={errors.customerName ? "border-destructive" : ""}
          />
          {errors.customerName && (
            <p className="text-xs text-destructive">{errors.customerName}</p>
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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
            className={errors.phoneNumber ? "border-destructive" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-destructive">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="national">National</Label>
          <Input
            id="national"
            placeholder="Enter national ID"
            value={data.national}
            onChange={(e) => onChange({ national: e.target.value })}
            className={errors.national ? "border-destructive" : ""}
          />
          {errors.national && (
            <p className="text-xs text-destructive">{errors.national}</p>
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

      </div>

      <Button onClick={onSubmit} className="gap-2">
        <Send className="h-4 w-4" />
        Submit Application
      </Button>

    </div>
  )
}
