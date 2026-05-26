import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import type { FieldSchemaOverrideMap } from "@/lib/field-schema-override-types"
import { EMPTY_OVERRIDE_MAP } from "@/lib/field-schema-override-types"
import { STEP_FIELD_SCHEMAS } from "@/lib/field-schema"

const OVERRIDE_FILE = path.join(process.cwd(), "data", "field-schema-overrides.json")
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) return false

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: authHeader },
    })
    if (!res.ok) return false
    const body = await res.json()
    return body?.data?.type === "ADMIN"
  } catch {
    return false
  }
}

function readOverrides(): FieldSchemaOverrideMap {
  try {
    const raw = fs.readFileSync(OVERRIDE_FILE, "utf-8")
    return JSON.parse(raw) as FieldSchemaOverrideMap
  } catch {
    return { ...EMPTY_OVERRIDE_MAP }
  }
}

function writeOverrides(map: FieldSchemaOverrideMap): void {
  const dir = path.dirname(OVERRIDE_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(OVERRIDE_FILE, JSON.stringify(map, null, 2), "utf-8")
}

function fieldExists(stepId: number, fieldName: string): boolean {
  const fields = STEP_FIELD_SCHEMAS[stepId]
  return !!fields?.some((f) => f.name === fieldName && f.type !== "separator")
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return NextResponse.json(readOverrides())
}

// ─── PATCH ───────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { stepId, fieldName, label, placeholder, visibleWhen } = body as {
    stepId: number
    fieldName: string
    label?: string
    placeholder?: string
    visibleWhen?: unknown
  }

  const errors: Record<string, string> = {}

  if (!stepId || typeof stepId !== "number" || stepId < 1 || stepId > 5) {
    errors.stepId = "stepId phải là số nguyên từ 1 đến 5"
  }
  if (!fieldName || typeof fieldName !== "string") {
    errors.fieldName = "fieldName là bắt buộc"
  }
  if (stepId && fieldName && !fieldExists(stepId, fieldName)) {
    errors.fieldName = `Field '${fieldName}' không tồn tại trong step ${stepId}`
  }
  if (label !== undefined && (typeof label !== "string" || label.trim().length === 0)) {
    errors.label = "Label không được để trống"
  }
  if (label !== undefined && typeof label === "string" && label.length > 100) {
    errors.label = "Label tối đa 100 ký tự"
  }
  if (placeholder !== undefined && typeof placeholder === "string" && placeholder.length > 200) {
    errors.placeholder = "Placeholder tối đa 200 ký tự"
  }
  if (visibleWhen !== undefined && visibleWhen !== null) {
    const vw = visibleWhen as Record<string, unknown>
    if (typeof vw !== "object") {
      errors.visibleWhen = "visibleWhen phải là object hoặc null"
    } else if ("field" in vw) {
      if (!vw.field || typeof vw.field !== "string") {
        errors["visibleWhen.field"] = "visibleWhen.field là bắt buộc"
      } else if (stepId && !fieldExists(stepId, vw.field as string)) {
        errors["visibleWhen.field"] = `Field '${vw.field}' không tồn tại trong step ${stepId}`
      } else if (vw.field === fieldName) {
        errors["visibleWhen.field"] = "Field không thể tham chiếu chính nó"
      }
      const validOps = ["eq", "neq", "in", "nin", "filled", "empty"]
      if (!vw.op || !validOps.includes(vw.op as string)) {
        errors["visibleWhen.op"] = `Operator phải là một trong: ${validOps.join(", ")}`
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
  }

  const map = readOverrides()
  const key = `${stepId}:${fieldName}`
  const existing = map.overrides[key] ?? {}

  const updated: Record<string, unknown> = { ...existing }
  if (label !== undefined) updated.label = label.trim()
  if (placeholder !== undefined) updated.placeholder = placeholder
  if (visibleWhen !== undefined) updated.visibleWhen = visibleWhen ?? null

  map.overrides[key] = updated as typeof existing
  map.updatedAt = new Date().toISOString()

  try {
    writeOverrides(map)
  } catch {
    return NextResponse.json({ error: "Failed to write override file" }, { status: 500 })
  }

  return NextResponse.json(map)
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { stepId, fieldName } = body as { stepId: number; fieldName: string }
  const key = `${stepId}:${fieldName}`
  const map = readOverrides()

  if (!map.overrides[key]) {
    return NextResponse.json(
      { error: `Override not found for ${key}` },
      { status: 404 },
    )
  }

  delete map.overrides[key]
  map.updatedAt = new Date().toISOString()

  try {
    writeOverrides(map)
  } catch {
    return NextResponse.json({ error: "Failed to write override file" }, { status: 500 })
  }

  return NextResponse.json(map)
}
