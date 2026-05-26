import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { EMPTY_OVERRIDE_MAP } from "@/lib/field-schema-override-types"

const OVERRIDE_FILE = path.join(process.cwd(), "data", "field-schema-overrides.json")

export async function GET() {
  try {
    const raw = fs.readFileSync(OVERRIDE_FILE, "utf-8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ ...EMPTY_OVERRIDE_MAP })
  }
}
