"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { LoanInfo } from "@/lib/loan-form-types"

interface StepLoanInfoProps {
  data: LoanInfo
  onChange: (data: Partial<LoanInfo>) => void
  errors: Record<string, string>
}

export function StepLoanInfo({ data, onChange, errors }: StepLoanInfoProps) {
  const showAccountField = data.repaymentMethod === "auto-debit"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Thông tin khoản vay</h2>
        <p className="text-sm text-muted-foreground mt-1">Thông tin khoản vay đề nghị, kế hoạch trả nợ và tài sản bảo đảm.</p>
      </div>

      {/* Thông tin khoản vay */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Khoản vay đề nghị</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Sản phẩm vay</Label>
            <Select value={data.loanType} onValueChange={(val) => onChange({ loanType: val })}>
              <SelectTrigger className={errors.loanType ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn sản phẩm vay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Vay mua ô tô</SelectItem>
                <SelectItem value="home">Vay mua nhà/đất</SelectItem>
                <SelectItem value="study-abroad">Vay du học</SelectItem>
                <SelectItem value="consumer">Tiêu dùng khác</SelectItem>
              </SelectContent>
            </Select>
            {errors.loanType && <p className="text-xs text-destructive">{errors.loanType}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Phương thức vay</Label>
            <Select value={data.loanMethod} onValueChange={(val) => onChange({ loanMethod: val })}>
              <SelectTrigger className={errors.loanMethod ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installment">Theo món</SelectItem>
                <SelectItem value="credit-line">Theo hạn mức</SelectItem>
                <SelectItem value="overdraft">Thấu chi</SelectItem>
              </SelectContent>
            </Select>
            {errors.loanMethod && <p className="text-xs text-destructive">{errors.loanMethod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="loanAmount">Số tiền vay / Hạn mức (VNĐ)</Label>
            <Input id="loanAmount" type="number" placeholder="VD: 500000000" value={data.loanAmount}
              onChange={(e) => onChange({ loanAmount: e.target.value })}
              className={errors.loanAmount ? "border-destructive" : ""} />
            {errors.loanAmount && <p className="text-xs text-destructive">{errors.loanAmount}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Thời hạn vay (tháng)</Label>
            <Select value={data.loanTerm} onValueChange={(val) => onChange({ loanTerm: val })}>
              <SelectTrigger className={errors.loanTerm ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn thời hạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 tháng</SelectItem>
                <SelectItem value="24">24 tháng</SelectItem>
                <SelectItem value="36">36 tháng</SelectItem>
                <SelectItem value="48">48 tháng</SelectItem>
                <SelectItem value="60">60 tháng</SelectItem>
                <SelectItem value="84">84 tháng</SelectItem>
                <SelectItem value="120">120 tháng</SelectItem>
              </SelectContent>
            </Select>
            {errors.loanTerm && <p className="text-xs text-destructive">{errors.loanTerm}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="loanPurpose">Mục đích vay</Label>
            <Textarea id="loanPurpose" placeholder="Mô tả mục đích sử dụng vốn vay..." value={data.loanPurpose}
              onChange={(e) => onChange({ loanPurpose: e.target.value })}
              className={errors.loanPurpose ? "border-destructive" : ""} rows={2} />
            {errors.loanPurpose && <p className="text-xs text-destructive">{errors.loanPurpose}</p>}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="repaymentSource">Nguồn trả nợ</Label>
            <Input id="repaymentSource" placeholder="VD: Lương tháng từ công ty ABC" value={data.repaymentSource}
              onChange={(e) => onChange({ repaymentSource: e.target.value })}
              className={errors.repaymentSource ? "border-destructive" : ""} />
            {errors.repaymentSource && <p className="text-xs text-destructive">{errors.repaymentSource}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* Kế hoạch trả nợ */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Kế hoạch trả nợ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Kỳ trả nợ gốc</Label>
            <Select value={data.principalRepaymentPeriod} onValueChange={(val) => onChange({ principalRepaymentPeriod: val })}>
              <SelectTrigger className={errors.principalRepaymentPeriod ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
                <SelectItem value="quarterly">Hàng quý</SelectItem>
                <SelectItem value="semi-annual">Bán niên</SelectItem>
                <SelectItem value="annual">Hàng năm</SelectItem>
              </SelectContent>
            </Select>
            {errors.principalRepaymentPeriod && <p className="text-xs text-destructive">{errors.principalRepaymentPeriod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Kỳ trả nợ lãi</Label>
            <Select value={data.interestRepaymentPeriod} onValueChange={(val) => onChange({ interestRepaymentPeriod: val })}>
              <SelectTrigger className={errors.interestRepaymentPeriod ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
                <SelectItem value="quarterly">Hàng quý</SelectItem>
              </SelectContent>
            </Select>
            {errors.interestRepaymentPeriod && <p className="text-xs text-destructive">{errors.interestRepaymentPeriod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Hình thức trả nợ gốc</Label>
            <Select value={data.principalRepaymentMethod} onValueChange={(val) => onChange({ principalRepaymentMethod: val })}>
              <SelectTrigger className={errors.principalRepaymentMethod ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Trả đều</SelectItem>
                <SelectItem value="installment">Trả góp</SelectItem>
                <SelectItem value="flexible">Trả linh hoạt</SelectItem>
              </SelectContent>
            </Select>
            {errors.principalRepaymentMethod && <p className="text-xs text-destructive">{errors.principalRepaymentMethod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Phương thức trả nợ</Label>
            <Select value={data.repaymentMethod} onValueChange={(val) => onChange({ repaymentMethod: val })}>
              <SelectTrigger className={errors.repaymentMethod ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Nộp tiền mặt</SelectItem>
                <SelectItem value="transfer">Chuyển khoản</SelectItem>
                <SelectItem value="auto-debit">Tự động trừ tài khoản</SelectItem>
              </SelectContent>
            </Select>
            {errors.repaymentMethod && <p className="text-xs text-destructive">{errors.repaymentMethod}</p>}
          </div>

          {showAccountField && (
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="repaymentAccountNumber">Số tài khoản tự động trừ</Label>
              <Input id="repaymentAccountNumber" placeholder="Số tài khoản" value={data.repaymentAccountNumber || ""}
                onChange={(e) => onChange({ repaymentAccountNumber: e.target.value })} />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Tài sản bảo đảm */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Tài sản bảo đảm <span className="text-muted-foreground font-normal normal-case">(Tuỳ chọn)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Loại tài sản bảo đảm</Label>
            <Select value={data.collateralType || ""} onValueChange={(val) => onChange({ collateralType: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn loại tài sản" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="real-estate">Bất động sản</SelectItem>
                <SelectItem value="vehicle">Phương tiện vận tải</SelectItem>
                <SelectItem value="deposit">Tiền gửi</SelectItem>
                <SelectItem value="securities">Chứng khoán</SelectItem>
                <SelectItem value="none">Không có</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="collateralValue">Giá trị ước tính (VNĐ)</Label>
            <Input id="collateralValue" type="number" placeholder="VD: 800000000" value={data.collateralValue || ""}
              onChange={(e) => onChange({ collateralValue: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="collateralAddress">Địa chỉ / Mô tả tài sản bảo đảm</Label>
            <Input id="collateralAddress" placeholder="VD: Xe Toyota Camry 2022, BKS 30A-12345" value={data.collateralAddress || ""}
              onChange={(e) => onChange({ collateralAddress: e.target.value })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Chủ sở hữu tài sản bảo đảm</Label>
            <Select value={data.collateralOwnerType || ""} onValueChange={(val) => onChange({ collateralOwnerType: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn chủ sở hữu" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="borrower">Bên vay</SelectItem>
                <SelectItem value="spouse">Vợ/Chồng bên vay</SelectItem>
                <SelectItem value="co-owner">Bên vay và đồng chủ sở hữu</SelectItem>
                <SelectItem value="third-party">Bên thứ ba</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bảo hiểm */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Bảo hiểm người vay <span className="text-muted-foreground font-normal normal-case">(Tuỳ chọn)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label>Gói bảo hiểm BIC Bình An</Label>
            <Select value={data.insurancePackage || ""} onValueChange={(val) => onChange({ insurancePackage: val })}>
              <SelectTrigger><SelectValue placeholder="Chọn gói bảo hiểm" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Gói A (Tai nạn tối đa 1 tỷ, ốm đau 50%)</SelectItem>
                <SelectItem value="B">Gói B (Tai nạn tối đa 1 tỷ, ốm đau 100%)</SelectItem>
                <SelectItem value="none">Không tham gia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.insurancePackage && data.insurancePackage !== "none" && (
            <div className="flex flex-col gap-2">
              <Label>Hình thức thanh toán phí bảo hiểm</Label>
              <Select value={data.insurancePaymentMethod || ""} onValueChange={(val) => onChange({ insurancePaymentMethod: val })}>
                <SelectTrigger><SelectValue placeholder="Chọn hình thức" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lump-sum">Trả 1 lần toàn bộ phí (giảm 10%)</SelectItem>
                  <SelectItem value="annual">Trả từng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
