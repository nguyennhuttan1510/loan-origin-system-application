"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { CustomerRelationship } from "@/lib/loan-form-types"

interface StepCustomerRelationshipProps {
  data: CustomerRelationship
  onChange: (data: Partial<CustomerRelationship>) => void
  errors: Record<string, string>
}

export function StepCustomerRelationship({ data, onChange, errors }: StepCustomerRelationshipProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Người đồng trả nợ & Tham chiếu</h2>
        <p className="text-sm text-muted-foreground mt-1">Thông tin người đồng trả nợ (nếu có) và người tham chiếu.</p>
      </div>

      {/* Người đồng trả nợ */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Người đồng trả nợ <span className="text-muted-foreground font-normal normal-case">(ngoài vợ/chồng — nếu có)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerName">Họ và tên</Label>
            <Input id="coborrowerName" placeholder="Tên đầy đủ" value={data.coborrowerName || ""}
              onChange={(e) => onChange({ coborrowerName: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerDateOfBirth">Ngày sinh</Label>
            <Input id="coborrowerDateOfBirth" type="date" value={data.coborrowerDateOfBirth || ""}
              onChange={(e) => onChange({ coborrowerDateOfBirth: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Giới tính</Label>
            <Select value={data.coborrowerGender || ""} onValueChange={(val) => onChange({ coborrowerGender: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerIdNumber">Số CMND / Hộ chiếu</Label>
            <Input id="coborrowerIdNumber" placeholder="Số CMND hoặc Hộ chiếu" value={data.coborrowerIdNumber || ""}
              onChange={(e) => onChange({ coborrowerIdNumber: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerIdIssueDate">Ngày cấp</Label>
            <Input id="coborrowerIdIssueDate" type="date" value={data.coborrowerIdIssueDate || ""}
              onChange={(e) => onChange({ coborrowerIdIssueDate: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerIdIssuePlace">Nơi cấp</Label>
            <Input id="coborrowerIdIssuePlace" placeholder="Công an TP. Hà Nội" value={data.coborrowerIdIssuePlace || ""}
              onChange={(e) => onChange({ coborrowerIdIssuePlace: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="coborrowerCurrentAddress">Địa chỉ cư trú hiện tại</Label>
            <Input id="coborrowerCurrentAddress" placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
              value={data.coborrowerCurrentAddress || ""}
              onChange={(e) => onChange({ coborrowerCurrentAddress: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerMobilePhone">Điện thoại di động</Label>
            <Input id="coborrowerMobilePhone" type="tel" placeholder="0901 234 567" value={data.coborrowerMobilePhone || ""}
              onChange={(e) => onChange({ coborrowerMobilePhone: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coborrowerMonthlyIncome">Thu nhập hàng tháng (VNĐ)</Label>
            <Input id="coborrowerMonthlyIncome" type="number" placeholder="VD: 10000000"
              value={data.coborrowerMonthlyIncome || ""}
              onChange={(e) => onChange({ coborrowerMonthlyIncome: e.target.value })} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Người tham chiếu */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Người tham chiếu chính</h3>
        <p className="text-xs text-muted-foreground">Cá nhân biết rõ về Bên vay, không cùng địa chỉ cư trú, có điện thoại liên hệ.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceName1">Họ và tên</Label>
            <Input id="referenceName1" placeholder="Tên đầy đủ" value={data.referenceName1}
              onChange={(e) => onChange({ referenceName1: e.target.value })}
              className={errors.referenceName1 ? "border-destructive" : ""} />
            {errors.referenceName1 && <p className="text-xs text-destructive">{errors.referenceName1}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceRelation1">Quan hệ với Bên vay</Label>
            <Select value={data.referenceRelation1} onValueChange={(val) => onChange({ referenceRelation1: val })}>
              <SelectTrigger className={errors.referenceRelation1 ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn quan hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Cha/Mẹ</SelectItem>
                <SelectItem value="sibling">Anh/Chị/Em</SelectItem>
                <SelectItem value="spouse">Vợ/Chồng</SelectItem>
                <SelectItem value="friend">Bạn bè</SelectItem>
                <SelectItem value="colleague">Đồng nghiệp</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.referenceRelation1 && <p className="text-xs text-destructive">{errors.referenceRelation1}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referencePhone1">Điện thoại liên hệ</Label>
            <Input id="referencePhone1" type="tel" placeholder="0901 234 567" value={data.referencePhone1}
              onChange={(e) => onChange({ referencePhone1: e.target.value })}
              className={errors.referencePhone1 ? "border-destructive" : ""} />
            {errors.referencePhone1 && <p className="text-xs text-destructive">{errors.referencePhone1}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceAddress1">Địa chỉ liên lạc <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="referenceAddress1" placeholder="Địa chỉ liên lạc" value={data.referenceAddress1 || ""}
              onChange={(e) => onChange({ referenceAddress1: e.target.value })} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Người tham chiếu phụ */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Người tham chiếu phụ <span className="text-muted-foreground font-normal normal-case">(Tuỳ chọn)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="referenceName2">Họ và tên</Label>
            <Input id="referenceName2" placeholder="Tên đầy đủ" value={data.referenceName2 || ""}
              onChange={(e) => onChange({ referenceName2: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="referencePhone2">Điện thoại</Label>
            <Input id="referencePhone2" type="tel" placeholder="0901 234 567" value={data.referencePhone2 || ""}
              onChange={(e) => onChange({ referencePhone2: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Quan hệ</Label>
            <Select value={data.referenceRelation2 || ""} onValueChange={(val) => onChange({ referenceRelation2: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn quan hệ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Cha/Mẹ</SelectItem>
                <SelectItem value="sibling">Anh/Chị/Em</SelectItem>
                <SelectItem value="spouse">Vợ/Chồng</SelectItem>
                <SelectItem value="friend">Bạn bè</SelectItem>
                <SelectItem value="colleague">Đồng nghiệp</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Quan hệ ngân hàng */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Quan hệ ngân hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Khách hàng hiện hữu?</Label>
            <Select value={data.existingCustomer} onValueChange={(val) => onChange({ existingCustomer: val })}>
              <SelectTrigger className={errors.existingCustomer ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Có</SelectItem>
                <SelectItem value="no">Không</SelectItem>
              </SelectContent>
            </Select>
            {errors.existingCustomer && <p className="text-xs text-destructive">{errors.existingCustomer}</p>}
          </div>

          {data.existingCustomer === "yes" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="accountNumber">Số tài khoản hiện có</Label>
              <Input id="accountNumber" placeholder="Số tài khoản" value={data.accountNumber || ""}
                onChange={(e) => onChange({ accountNumber: e.target.value })} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
