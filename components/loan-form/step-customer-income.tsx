"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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
        <h2 className="text-xl font-semibold text-foreground">Thu nhập & Tài chính</h2>
        <p className="text-sm text-muted-foreground mt-1">Thông tin nghề nghiệp, thu nhập và tài sản của người vay.</p>
      </div>

      {/* Nghề nghiệp */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Thông tin nghề nghiệp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Tình trạng việc làm</Label>
            <Select value={data.employmentStatus} onValueChange={(val) => onChange({ employmentStatus: val })}>
              <SelectTrigger className={errors.employmentStatus ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Làm công ăn lương</SelectItem>
                <SelectItem value="self-employed">Tự kinh doanh</SelectItem>
                <SelectItem value="business-owner">Chủ doanh nghiệp</SelectItem>
                <SelectItem value="retired">Về hưu</SelectItem>
                <SelectItem value="unemployed">Không có việc làm</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentStatus && <p className="text-xs text-destructive">{errors.employmentStatus}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="yearsEmployed">Số năm làm việc</Label>
            <Input id="yearsEmployed" type="number" placeholder="VD: 5" value={data.yearsEmployed}
              onChange={(e) => onChange({ yearsEmployed: e.target.value })}
              className={errors.yearsEmployed ? "border-destructive" : ""} />
            {errors.yearsEmployed && <p className="text-xs text-destructive">{errors.yearsEmployed}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="employerName">Tên cơ quan / Nơi công tác</Label>
            <Input id="employerName" placeholder="Công ty TNHH ABC" value={data.employerName}
              onChange={(e) => onChange({ employerName: e.target.value })}
              className={errors.employerName ? "border-destructive" : ""} />
            {errors.employerName && <p className="text-xs text-destructive">{errors.employerName}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="jobTitle">Vị trí công tác</Label>
            <Input id="jobTitle" placeholder="VD: Kỹ sư phần mềm" value={data.jobTitle}
              onChange={(e) => onChange({ jobTitle: e.target.value })}
              className={errors.jobTitle ? "border-destructive" : ""} />
            {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="employerAddress">Địa chỉ cơ quan <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="employerAddress" placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố" value={data.employerAddress || ""}
              onChange={(e) => onChange({ employerAddress: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="employerPhone">Điện thoại cơ quan <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="employerPhone" type="tel" placeholder="024 1234 5678" value={data.employerPhone || ""}
              onChange={(e) => onChange({ employerPhone: e.target.value })} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Thu nhập hàng tháng */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Thu nhập hàng tháng (VNĐ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthlyIncome">Lương</Label>
            <Input id="monthlyIncome" type="number" placeholder="VD: 15000000" value={data.monthlyIncome}
              onChange={(e) => onChange({ monthlyIncome: e.target.value })}
              className={errors.monthlyIncome ? "border-destructive" : ""} />
            {errors.monthlyIncome && <p className="text-xs text-destructive">{errors.monthlyIncome}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="businessIncome">Thu nhập kinh doanh <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="businessIncome" type="number" placeholder="VD: 5000000" value={data.businessIncome || ""}
              onChange={(e) => onChange({ businessIncome: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rentalIncome">Thu nhập cho thuê tài sản <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="rentalIncome" type="number" placeholder="VD: 3000000" value={data.rentalIncome || ""}
              onChange={(e) => onChange({ rentalIncome: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="additionalIncome">Thu nhập khác <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="additionalIncome" type="number" placeholder="VD: 2000000" value={data.additionalIncome || ""}
              onChange={(e) => onChange({ additionalIncome: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Nguồn thu nhập khác</Label>
            <Select value={data.incomeSource || ""} onValueChange={(val) => onChange({ incomeSource: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn nguồn (tuỳ chọn)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rental">Cho thuê tài sản</SelectItem>
                <SelectItem value="investment">Đầu tư tài chính</SelectItem>
                <SelectItem value="freelance">Làm thêm</SelectItem>
                <SelectItem value="pension">Lương hưu</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Chi phí hàng tháng */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Chi phí hàng tháng (VNĐ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="livingExpenses">Chi phí sinh hoạt</Label>
            <Input id="livingExpenses" type="number" placeholder="VD: 8000000" value={data.livingExpenses}
              onChange={(e) => onChange({ livingExpenses: e.target.value })}
              className={errors.livingExpenses ? "border-destructive" : ""} />
            {errors.livingExpenses && <p className="text-xs text-destructive">{errors.livingExpenses}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="installmentExpenses">Các khoản trả góp hiện tại <span className="text-muted-foreground">(Tuỳ chọn)</span></Label>
            <Input id="installmentExpenses" type="number" placeholder="VD: 3000000" value={data.installmentExpenses || ""}
              onChange={(e) => onChange({ installmentExpenses: e.target.value })} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Tài sản đang sở hữu */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Tài sản đang sở hữu (VNĐ) <span className="text-muted-foreground font-normal normal-case">(Tuỳ chọn)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="realEstateAssets">Bất động sản</Label>
            <Input id="realEstateAssets" type="number" placeholder="Giá trị ước tính" value={data.realEstateAssets || ""}
              onChange={(e) => onChange({ realEstateAssets: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="movableAssets">Động sản (xe, thiết bị...)</Label>
            <Input id="movableAssets" type="number" placeholder="Giá trị ước tính" value={data.movableAssets || ""}
              onChange={(e) => onChange({ movableAssets: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="depositAssets">Tiền gửi ngân hàng</Label>
            <Input id="depositAssets" type="number" placeholder="Số dư" value={data.depositAssets || ""}
              onChange={(e) => onChange({ depositAssets: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  )
}
