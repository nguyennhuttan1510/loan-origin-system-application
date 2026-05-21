"use client"

import { useEffect, useState } from "react"
import { FlaskConical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { SeederApi } from "@/lib/apis"
import type { LoanApplicationSeed } from "@/lib/apis/seeder-types"

interface DemoDataPickerProps {
  onSelect: (seed: LoanApplicationSeed) => void
}

const STATUS_VARIANT: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  APPROVED: "default",
  REJECTED: "destructive",
  UNDER_REVIEW: "secondary",
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount)
}

export function DemoDataPicker({ onSelect }: DemoDataPickerProps) {
  const [open, setOpen] = useState(false)
  const [seeds, setSeeds] = useState<LoanApplicationSeed[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (seeds.length > 0) return

    const fetch = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await SeederApi.getAll()
        setSeeds(res.data?.data ?? [])
      } catch {
        setError("Không thể tải dữ liệu demo. Kiểm tra backend đã chạy chưa.")
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [open, seeds.length])

  const handleSelect = (seed: LoanApplicationSeed) => {
    onSelect(seed)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FlaskConical className="h-4 w-4" />
          Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn case demo</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setSeeds([])}>
                Thử lại
              </Button>
            </div>
          )}

          {!isLoading && !error && seeds.map((seed) => (
            <button
              key={seed.applicationNumber}
              onClick={() => handleSelect(seed)}
              className="w-full rounded-lg border border-border p-4 text-left hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-medium text-foreground truncate">{seed.borrowerName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{seed.applicationNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {seed.loanProductCode} · {formatVnd(seed.requestedAmount)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant={STATUS_VARIANT[seed.status] ?? "outline"}>
                    {seed.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{seed.underwritingDecision}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
