"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, RotateCcw, Search, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { STEP_FIELD_SCHEMAS } from "@/lib/field-schema"
import type { FieldSchema } from "@/lib/field-schema/types"
import type { FieldSchemaOverride, FieldSchemaOverrideMap } from "@/lib/field-schema-override-types"
import { EMPTY_OVERRIDE_MAP } from "@/lib/field-schema-override-types"
import { useAuth } from "@/lib/auth-context"
import { hasAnyRole, USER_TYPE } from "@/lib/constants/user-types"

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS: Record<number, string> = {
  1: "Step 1 — Thông tin cá nhân",
  2: "Step 2 — Thu nhập & Tài chính",
  3: "Step 3 — Người liên quan",
  4: "Step 4 — Địa chỉ",
  5: "Step 5 — Thông tin khoản vay",
}

const OP_OPTIONS = [
  { value: "eq",     label: "bằng (=)" },
  { value: "neq",    label: "không bằng (≠)" },
  { value: "filled", label: "có giá trị" },
  { value: "empty",  label: "trống" },
]

const NO_VALUE_OPS = new Set(["filled", "empty"])

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditTarget {
  stepId: number
  field: FieldSchema
}

interface EditForm {
  label: string
  placeholder: string
  condField: string
  condOp: string
  condValue: string
  hasCondition: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mergeField(field: FieldSchema, override?: FieldSchemaOverride): FieldSchema {
  if (!override) return field
  const merged = { ...field }
  if (override.label !== undefined) merged.label = override.label
  if (override.placeholder !== undefined) merged.placeholder = override.placeholder
  if ("visibleWhen" in override) {
    merged.visibleWhen = override.visibleWhen ?? undefined
  }
  return merged
}

function overrideKey(stepId: number, fieldName: string) {
  return `${stepId}:${fieldName}`
}

function conditionSummary(field: FieldSchema): string {
  const vw = field.visibleWhen
  if (!vw) return "—"
  if ("and" in vw) return `(${vw.and.length} điều kiện AND)`
  if ("or" in vw) return `(${vw.or.length} điều kiện OR)`
  const opLabel = OP_OPTIONS.find((o) => o.value === vw.op)?.label ?? vw.op
  if (NO_VALUE_OPS.has(vw.op)) return `${vw.field} ${opLabel}`
  return `${vw.field} ${opLabel} "${vw.value ?? ""}"`
}

function getAccessToken(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("accessToken") ?? ""
}

async function apiFetch(path: string, options?: RequestInit) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
      ...options?.headers,
    },
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [overrideMap, setOverrideMap] = useState<FieldSchemaOverrideMap>(EMPTY_OVERRIDE_MAP)
  const [isFetching, setIsFetching] = useState(true)
  const [search, setSearch] = useState("")
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    label: "", placeholder: "", condField: "", condOp: "eq", condValue: "", hasCondition: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // ── Auth guard ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace("/login"); return }
    if (!hasAnyRole(user.roles, USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN)) { router.replace("/dashboard"); return }
  }, [user, authLoading, router])

  // ── Fetch overrides ──────────────────────────────────────────────────────────

  const fetchOverrides = useCallback(async () => {
    setIsFetching(true)
    try {
      const res = await apiFetch("/api/admin/field-schema-overrides")
      if (res.ok) {
        setOverrideMap(await res.json())
      }
    } catch {
      toast.error("Không thể tải cấu hình override")
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    if (hasAnyRole(user?.roles, USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN)) fetchOverrides()
  }, [user, fetchOverrides])

  // ── Merged schemas ───────────────────────────────────────────────────────────

  const mergedSteps = useMemo(() => {
    return Object.entries(STEP_FIELD_SCHEMAS).map(([stepIdStr, fields]) => {
      const stepId = Number(stepIdStr)
      const nonSeparators = fields.filter((f) => f.type !== "separator")
      return {
        stepId,
        label: STEP_LABELS[stepId] ?? `Step ${stepId}`,
        fields: nonSeparators.map((f) => ({
          merged: mergeField(f, overrideMap.overrides[overrideKey(stepId, f.name)]),
          original: f,
          hasOverride: !!overrideMap.overrides[overrideKey(stepId, f.name)],
        })),
      }
    })
  }, [overrideMap])

  // ── Search filter ────────────────────────────────────────────────────────────

  const filteredSteps = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return mergedSteps
    return mergedSteps
      .map((step) => ({
        ...step,
        fields: step.fields.filter(
          (f) =>
            f.merged.name.toLowerCase().includes(q) ||
            (f.merged.label ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((step) => step.fields.length > 0)
  }, [mergedSteps, search])

  // ── Open edit dialog ─────────────────────────────────────────────────────────

  const openEdit = useCallback(
    (stepId: number, field: FieldSchema) => {
      const override = overrideMap.overrides[overrideKey(stepId, field.name)]
      const mergedField = mergeField(field, override)
      const vw = mergedField.visibleWhen

      let condField = ""
      let condOp = "eq"
      let condValue = ""
      let hasCondition = false

      if (vw && !("and" in vw) && !("or" in vw)) {
        condField = vw.field
        condOp = vw.op
        condValue = Array.isArray(vw.value) ? vw.value[0] ?? "" : vw.value ?? ""
        hasCondition = true
      }

      setEditForm({
        label: mergedField.label ?? "",
        placeholder: mergedField.placeholder ?? "",
        condField,
        condOp,
        condValue,
        hasCondition,
      })
      setEditTarget({ stepId, field })
    },
    [overrideMap],
  )

  // ── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (!editTarget) return
    if (!editForm.label.trim()) {
      toast.error("Label không được để trống")
      return
    }
    if (editForm.hasCondition && (!editForm.condField || !editForm.condOp)) {
      toast.error("Vui lòng điền đầy đủ điều kiện hiển thị")
      return
    }
    if (
      editForm.hasCondition &&
      !NO_VALUE_OPS.has(editForm.condOp) &&
      !editForm.condValue.trim()
    ) {
      toast.error("Vui lòng nhập giá trị cho điều kiện")
      return
    }

    setIsSaving(true)
    try {
      let visibleWhen: unknown = undefined
      if (editForm.hasCondition && editForm.condField) {
        visibleWhen = NO_VALUE_OPS.has(editForm.condOp)
          ? { field: editForm.condField, op: editForm.condOp }
          : { field: editForm.condField, op: editForm.condOp, value: editForm.condValue.trim() }
      } else if (!editForm.hasCondition) {
        visibleWhen = null
      }

      const res = await apiFetch("/api/admin/field-schema-overrides", {
        method: "PATCH",
        body: JSON.stringify({
          stepId: editTarget.stepId,
          fieldName: editTarget.field.name,
          label: editForm.label.trim(),
          placeholder: editForm.placeholder,
          ...(visibleWhen !== undefined ? { visibleWhen } : {}),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? "Lưu thất bại")
        return
      }

      setOverrideMap(await res.json())
      setEditTarget(null)
      toast.success("Cập nhật thành công")
    } catch {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsSaving(false)
    }
  }, [editTarget, editForm])

  // ── Reset ─────────────────────────────────────────────────────────────────────

  const handleReset = useCallback(async () => {
    if (!editTarget) return
    setIsResetting(true)
    try {
      const res = await apiFetch("/api/admin/field-schema-overrides", {
        method: "DELETE",
        body: JSON.stringify({
          stepId: editTarget.stepId,
          fieldName: editTarget.field.name,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? "Reset thất bại")
        return
      }

      setOverrideMap(await res.json())
      setEditTarget(null)
      toast.success("Đã khôi phục về mặc định")
    } catch {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsResetting(false)
    }
  }, [editTarget])

  // ── Derived state for edit dialog ─────────────────────────────────────────────

  const currentStepFields = useMemo(() => {
    if (!editTarget) return []
    return (STEP_FIELD_SCHEMAS[editTarget.stepId] ?? []).filter(
      (f) => f.type !== "separator" && f.name !== editTarget.field.name,
    )
  }, [editTarget])

  const hasOverrideForEdit = editTarget
    ? !!overrideMap.overrides[overrideKey(editTarget.stepId, editTarget.field.name)]
    : false

  // ── Guard: wait for auth ──────────────────────────────────────────────────────

  if (authLoading || !user || !hasAnyRole(user.roles, USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-0">
        <header className="border-b border-border bg-card">
          <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Settings2 className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Cài đặt Field Schema</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tuỳ chỉnh label, placeholder và điều kiện hiển thị cho từng field trong form đơn vay
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên field hoặc label..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Loading */}
          {isFetching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSteps.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Không tìm thấy field phù hợp
            </p>
          ) : (
            filteredSteps.map(({ stepId, label, fields }) => (
              <Card key={stepId}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground">
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground w-40">Field Name</th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Label</th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Placeholder</th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hiện khi</th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map(({ merged, original, hasOverride }) => (
                          <tr
                            key={merged.name}
                            className="border-b border-border last:border-0 hover:bg-muted/20"
                          >
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {merged.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-foreground">{merged.label ?? "—"}</span>
                              {hasOverride && (
                                <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                                  Đã chỉnh sửa
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {merged.placeholder || <span className="italic text-xs">không có</span>}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                              {conditionSummary(merged)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEdit(stepId, original)}
                                className="h-7 w-7 p-0"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* ─── Edit Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Chỉnh sửa Field
              <span className="font-mono text-sm font-normal text-muted-foreground">
                {editTarget?.field.name}
              </span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground pt-1">
              {editTarget ? STEP_LABELS[editTarget.stepId] : ""}
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Field Name (readonly) */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Field Name (định danh kỹ thuật)</Label>
              <Input value={editTarget?.field.name ?? ""} readOnly disabled className="font-mono text-sm" />
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <Label>
                Label <span className="text-destructive">*</span>
              </Label>
              {editTarget?.field.label && (
                <p className="text-xs text-muted-foreground">
                  Mặc định: <span className="italic">"{editTarget.field.label}"</span>
                </p>
              )}
              <Input
                value={editForm.label}
                onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="Nhập label hiển thị..."
              />
            </div>

            {/* Placeholder */}
            <div className="space-y-1.5">
              <Label>Placeholder</Label>
              {editTarget?.field.placeholder && (
                <p className="text-xs text-muted-foreground">
                  Mặc định: <span className="italic">"{editTarget.field.placeholder}"</span>
                </p>
              )}
              <Input
                value={editForm.placeholder}
                onChange={(e) => setEditForm((f) => ({ ...f, placeholder: e.target.value }))}
                placeholder="Nhập placeholder gợi ý (tuỳ chọn)..."
              />
            </div>

            {/* Condition Builder */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Điều kiện hiển thị (visibleWhen)</Label>
                {editForm.hasCondition && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setEditForm((f) => ({
                        ...f,
                        hasCondition: false,
                        condField: "",
                        condOp: "eq",
                        condValue: "",
                      }))
                    }
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Xóa điều kiện
                  </Button>
                )}
              </div>

              {!editForm.hasCondition ? (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Field luôn hiển thị (không có điều kiện)</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => setEditForm((f) => ({ ...f, hasCondition: true, condOp: "eq" }))}
                  >
                    Thêm điều kiện
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Field chỉ hiển thị khi:</p>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
                    {/* Field dropdown */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Field</Label>
                      <Select
                        value={editForm.condField}
                        onValueChange={(v) => setEditForm((f) => ({ ...f, condField: v }))}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Chọn field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {currentStepFields.map((f) => (
                            <SelectItem key={f.name} value={f.name} className="text-xs">
                              <span className="font-mono">{f.name}</span>
                              {f.label && <span className="ml-1 text-muted-foreground">({f.label})</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Operator dropdown */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Toán tử</Label>
                      <Select
                        value={editForm.condOp}
                        onValueChange={(v) => setEditForm((f) => ({ ...f, condOp: v, condValue: "" }))}
                      >
                        <SelectTrigger className="h-8 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OP_OPTIONS.map((op) => (
                            <SelectItem key={op.value} value={op.value} className="text-xs">
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value input */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Giá trị</Label>
                      <Input
                        className="h-8 text-xs"
                        placeholder={NO_VALUE_OPS.has(editForm.condOp) ? "— không cần —" : "Nhập giá trị..."}
                        disabled={NO_VALUE_OPS.has(editForm.condOp)}
                        value={NO_VALUE_OPS.has(editForm.condOp) ? "" : editForm.condValue}
                        onChange={(e) => setEditForm((f) => ({ ...f, condValue: e.target.value }))}
                      />
                    </div>
                  </div>

                  {editForm.hasCondition &&
                    !editForm.condField && (
                      <p className="text-xs text-destructive">Vui lòng chọn field cho điều kiện</p>
                    )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasOverrideForEdit || isResetting || isSaving}
              onClick={handleReset}
              className="mr-auto text-muted-foreground"
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              Reset về mặc định
            </Button>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isSaving || isResetting}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isResetting || !editForm.label.trim()}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
