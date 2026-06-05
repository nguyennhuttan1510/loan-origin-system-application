"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CustomerInfo } from "@/lib/loan-form-types"
import { useFormConfig } from "@/lib/form-config-context"

interface StepCustomerInfoProps {
  data: CustomerInfo
  onChange: (data: Partial<CustomerInfo>) => void
  errors: Record<string, string>
}

const STEP_ID = 1

export function StepCustomerInfo({ data, onChange, errors }: StepCustomerInfoProps) {
  const { getFieldVisibility } = useFormConfig()
  const vis = (field: string) => getFieldVisibility(STEP_ID, field)

  // Helper: optional badge on label
  const optLabel = (label: string, field: string) =>
    vis(field) === "optional" ? (
      <>
        {label} <span className="text-muted-foreground font-normal">(Tuỳ chọn)</span>
      </>
    ) : (
      label
    )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
        <p className="text-sm text-muted-foreground mt-1">Thông tin định danh của người vay vốn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {vis("firstName") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">{optLabel("Họ", "firstName")}</Label>
            <Input id="firstName" placeholder="Nguyễn" value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className={errors.firstName ? "border-destructive" : ""} />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
          </div>
        )}

        {vis("lastName") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">{optLabel("Tên", "lastName")}</Label>
            <Input id="lastName" placeholder="Văn An" value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={errors.lastName ? "border-destructive" : ""} />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
          </div>
        )}

        {vis("dateOfBirth") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth">{optLabel("Ngày sinh", "dateOfBirth")}</Label>
            <Input id="dateOfBirth" type="date" value={data.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              className={errors.dateOfBirth ? "border-destructive" : ""} />
            {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
          </div>
        )}

        {vis("gender") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="gender">{optLabel("Giới tính", "gender")}</Label>
            <Select value={data.gender} onValueChange={(val) => onChange({ gender: val })}>
              <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
          </div>
        )}

        {vis("maritalStatus") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="maritalStatus">{optLabel("Tình trạng hôn nhân", "maritalStatus")}</Label>
            <Select value={data.maritalStatus} onValueChange={(val) => onChange({ maritalStatus: val })}>
              <SelectTrigger className={errors.maritalStatus ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Độc thân</SelectItem>
                <SelectItem value="married">Đã kết hôn</SelectItem>
                <SelectItem value="divorced">Ly hôn</SelectItem>
                <SelectItem value="widowed">Góa</SelectItem>
              </SelectContent>
            </Select>
            {errors.maritalStatus && <p className="text-xs text-destructive">{errors.maritalStatus}</p>}
          </div>
        )}

        {vis("nationalId") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationalId">{optLabel("Số CMND / Hộ chiếu", "nationalId")}</Label>
            <Input id="nationalId" placeholder="Số CMND hoặc Hộ chiếu" value={data.nationalId}
              onChange={(e) => onChange({ nationalId: e.target.value })}
              className={errors.nationalId ? "border-destructive" : ""} />
            {errors.nationalId && <p className="text-xs text-destructive">{errors.nationalId}</p>}
          </div>
        )}

        {vis("nationalIdIssueDate") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationalIdIssueDate">{optLabel("Ngày cấp CMND", "nationalIdIssueDate")}</Label>
            <Input id="nationalIdIssueDate" type="date" value={data.nationalIdIssueDate || ""}
              onChange={(e) => onChange({ nationalIdIssueDate: e.target.value })} />
          </div>
        )}

        {vis("nationalIdIssuePlace") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationalIdIssuePlace">{optLabel("Nơi cấp CMND", "nationalIdIssuePlace")}</Label>
            <Input id="nationalIdIssuePlace" placeholder="Công an TP. Hà Nội"
              value={data.nationalIdIssuePlace || ""}
              onChange={(e) => onChange({ nationalIdIssuePlace: e.target.value })} />
          </div>
        )}

        {vis("phone") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">{optLabel("Điện thoại di động", "phone")}</Label>
            <Input id="phone" type="tel" placeholder="0901 234 567" value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={errors.phone ? "border-destructive" : ""} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        )}

        {vis("landlinePhone") !== "hidden" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="landlinePhone">{optLabel("Điện thoại cố định", "landlinePhone")}</Label>
            <Input id="landlinePhone" type="tel" placeholder="024 1234 5678"
              value={data.landlinePhone || ""}
              onChange={(e) => onChange({ landlinePhone: e.target.value })} />
          </div>
        )}

        {vis("email") !== "hidden" && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="email">{optLabel("Email", "email")}</Label>
            <Input id="email" type="email" placeholder="email@example.com" value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
        )}

        {vis("hasRelationship") !== "hidden" && (
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="hasRelationship">{optLabel("Quan hệ tín dụng với BIDV", "hasRelationship")}</Label>
            <Select value={data.hasRelationship} onValueChange={(val) => onChange({ hasRelationship: val })}>
              <SelectTrigger className={errors.hasRelationship ? "border-destructive" : ""}>
                <SelectValue placeholder="Đã từng vay vốn tại BIDV?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="existing">Đã vay vốn tại BIDV</SelectItem>
                <SelectItem value="new">Chưa vay vốn tại BIDV</SelectItem>
              </SelectContent>
            </Select>
            {errors.hasRelationship && <p className="text-xs text-destructive">{errors.hasRelationship}</p>}
          </div>
        )}

      </div>
    </div>
  )
}
