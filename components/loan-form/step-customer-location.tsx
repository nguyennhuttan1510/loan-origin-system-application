"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
        <h2 className="text-xl font-semibold text-foreground">Địa chỉ</h2>
        <p className="text-sm text-muted-foreground mt-1">Địa chỉ thường trú và địa chỉ cư trú hiện tại của người vay.</p>
      </div>

      {/* Địa chỉ thường trú */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Địa chỉ thường trú (theo Hộ khẩu / KT3)</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
          <Input id="permanentAddress" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            value={data.permanentAddress}
            onChange={(e) => onChange({ permanentAddress: e.target.value })}
            className={errors.permanentAddress ? "border-destructive" : ""} />
          {errors.permanentAddress && <p className="text-xs text-destructive">{errors.permanentAddress}</p>}
        </div>
      </div>

      <Separator />

      {/* Địa chỉ cư trú hiện tại */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Địa chỉ cư trú hiện tại</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="addressLine1">Địa chỉ</Label>
            <Input id="addressLine1" placeholder="Số nhà, tên đường, phường/xã" value={data.addressLine1}
              onChange={(e) => onChange({ addressLine1: e.target.value })}
              className={errors.addressLine1 ? "border-destructive" : ""} />
            {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="addressLine2">Địa chỉ bổ sung <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="addressLine2" placeholder="Căn hộ, tầng, toà nhà..." value={data.addressLine2 || ""}
              onChange={(e) => onChange({ addressLine2: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city">Quận / Huyện / Thành phố</Label>
            <Input id="city" placeholder="VD: Quận Cầu Giấy" value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className={errors.city ? "border-destructive" : ""} />
            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="state">Tỉnh / Thành phố</Label>
            <Input id="state" placeholder="VD: Hà Nội" value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={errors.state ? "border-destructive" : ""} />
            {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="postalCode">Mã bưu chính</Label>
            <Input id="postalCode" placeholder="VD: 100000" value={data.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              className={errors.postalCode ? "border-destructive" : ""} />
            {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Quốc gia</Label>
            <Select value={data.country} onValueChange={(val) => onChange({ country: val })}>
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn quốc gia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vn">Việt Nam</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Loại hình cư trú</Label>
            <Select value={data.residenceType} onValueChange={(val) => onChange({ residenceType: val })}>
              <SelectTrigger className={errors.residenceType ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn loại hình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Nhà riêng</SelectItem>
                <SelectItem value="rented">Nhà thuê</SelectItem>
                <SelectItem value="family">Ở cùng gia đình</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.residenceType && <p className="text-xs text-destructive">{errors.residenceType}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="yearsAtAddress">Số năm cư trú tại địa chỉ này</Label>
            <Input id="yearsAtAddress" type="number" placeholder="VD: 3" value={data.yearsAtAddress}
              onChange={(e) => onChange({ yearsAtAddress: e.target.value })}
              className={errors.yearsAtAddress ? "border-destructive" : ""} />
            {errors.yearsAtAddress && <p className="text-xs text-destructive">{errors.yearsAtAddress}</p>}
          </div>

        </div>
      </div>
    </div>
  )
}
