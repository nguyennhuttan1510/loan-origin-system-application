# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start Next.js development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

There is no test suite configured.

## Architecture

This is a **Next.js 16 App Router** frontend for a Loan Origination System (LOS). It communicates with a separate backend API hardcoded at `http://localhost:8080`. There is no database or server logic in this repo.

### Request flow

```
Page/Component → custom hook (useAuth) or direct import → /lib/apis/* → Axios client → backend
```

Axios intercepts every outgoing request to inject the Bearer token from localStorage (`access_token`).

### Auth

`AuthContext` (`auth-context.tsx`) is the single source of truth for session state. It reads/writes `access_token` from localStorage. Route protection is handled inside each page — unauthenticated users are redirected to `/login`.

### API layer (`/lib/apis/`)

Each file maps to a backend resource:
- `auth.ts` — login, register, `/me`, change-password
- `application.ts` — create loan application
- `staff.ts` — CRUD for staff (`/user/staffs`, `/user/staff/:id`)
- `category.ts` — products, product properties, roles (`/categories/*`)

### Multi-step loan form (`/components/loan-form/`)

Six steps rendered by a single parent component, each with its own Zod schema and React Hook Form instance:
1. Customer Information
2. Income Details
3. Relationships / References
4. Location / Address
5. Loan Details
6. Review & Submit

### UI components

All 59 primitives live in `/components/ui/` and are generated/managed by **shadcn/ui** (New York style, Radix UI under the hood). Do not hand-edit these files — regenerate via `npx shadcn add <component>`.

## Code Review Workflow

Code review là **bắt buộc** trước mỗi push. Hệ thống dùng một agent độc lập chạy Claude Sonnet, hoàn toàn tách khỏi main conversation để đảm bảo tính khách quan.

**Tiêu chí:** `.claude/skills/review.md` (8 rules R1–R5 Critical, R6–R8 Warning)

**Tự động (pre-push hook):** Sau khi setup, mỗi `git push` tự động trigger agent — push bị block nếu có Critical issue.

**Thủ công:**
```bash
./.claude/scripts/run-review.sh    # chạy review bất kỳ lúc nào
```

**Cài đặt hook lần đầu:**
```bash
bash .claude/scripts/setup-hooks.sh
```

| # | Tiêu chí | Mức độ |
|---|----------|--------|
| R1 | Không có `console.log` | Critical |
| R2 | Không hardcode URL/key/env var | Critical |
| R3 | Không commit file `.env*` | Critical |
| R4 | String lặp lại → enum/constant trong `/lib/` | Critical |
| R5 | Import đúng thứ tự, không thừa | Critical |
| R6 | Button gọi API phải có loading state + disabled | Warning |
| R7 | Không dùng `useState` cho derived value | Warning |
| R8 | State isolate đúng cấp, tránh re-render thừa | Warning |

---

### Key configuration notes

- `next.config.mjs` disables TypeScript build errors and image optimization — do not rely on these as safety nets.
- Path alias `@/` resolves to the project root (configured in `tsconfig.json`).
- No `.env` files are committed; the API base URL must be extracted to `NEXT_PUBLIC_API_BASE_URL` before deploying.
- Several pages use `MOCK_LOANS` / `MOCK_STAFF` arrays as placeholder data — these are not wired to the real API yet.
