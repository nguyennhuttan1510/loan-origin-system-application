# PRD: Admin Field Schema Settings

**Phiên bản:** 1.1  
**Ngày tạo:** 2026-05-06  
**Ngày cập nhật:** 2026-05-06  
**Tác giả:** Business Analyst — LOS Team  
**Trạng thái:** Draft  

---

## 1. Tổng Quan (Overview)

### 1.1 Mục tiêu tính năng

Cho phép người dùng có role **Admin** tùy chỉnh các thuộc tính hiển thị của từng field trong biểu mẫu đơn vay (`LoanFormWizard`) thông qua giao diện quản trị tại `/admin/setting` — mà không cần triển khai lại code.

Cụ thể, Admin có thể chỉnh sửa các thuộc tính sau của mỗi `FieldSchema`:

| Thuộc tính | Mô tả | Phase |
|---|---|---|
| `label` | Nhãn hiển thị trên form (ví dụ: "Họ" → "Họ và tên lót") | Phase 1 |
| `name` | Key định danh field trong data model (ví dụ: `firstName`) | Phase 1 |
| `placeholder` | Văn bản gợi ý bên trong input (ví dụ: "Nguyễn" → "Nhập họ của bạn") | Phase 1 |
| `visibleWhen` | Điều kiện hiển thị field (leaf condition đơn giản) | Phase 2 |
| `visibleWhen` (and/or tree) | Điều kiện hiển thị phức hợp nhiều nhánh and/or | Phase 3 |

### 1.2 Business Value

- **Linh hoạt nghiệp vụ:** Các đơn vị kinh doanh (chi nhánh, phòng ban) có thể điều chỉnh ngôn ngữ hiển thị phù hợp với từng phân khúc khách hàng mà không cần yêu cầu phát triển phần mềm.
- **Giảm chi phí vận hành:** Giảm tần suất release cycle chỉ để đổi label hoặc placeholder trên form.
- **Đảm bảo tính nhất quán:** Thay đổi được lưu tập trung, áp dụng đồng nhất trên toàn bộ form khi runtime.
- **Kiểm soát rủi ro:** Phân tầng quyền chỉnh sửa theo phase — `label`/`placeholder` ở phase 1 (rủi ro thấp), `visibleWhen` leaf condition ở phase 2 (rủi ro trung bình, kiểm soát chặt), `visibleWhen` and/or tree ở phase 3 (rủi ro cao, cần UX chuyên biệt); không cho phép thay đổi cấu trúc schema hay validation rule.

### 1.3 Stakeholders

| Stakeholder | Vai trò | Quan tâm chính |
|---|---|---|
| Admin hệ thống | Người dùng chính | Giao diện CRUD trực quan, không cần kỹ năng kỹ thuật |
| Product Owner | Phê duyệt yêu cầu | Scope kiểm soát, không phá vỡ form hiện tại |
| Developer | Triển khai | API shape rõ ràng, fallback an toàn |
| Loan Officer (STAFF) | Người dùng form | Form hiển thị đúng sau khi Admin chỉnh |

---

## 2. Bối Cảnh Nghiệp Vụ (Business Context)

### 2.1 Problem Statement

Hiện tại, toàn bộ `label`, `name`, và `placeholder` của các field trong `LoanFormWizard` được hardcode trực tiếp trong source code (ví dụ: `step-customer-info.tsx`, `lib/field-schema.ts`). Khi nghiệp vụ yêu cầu thay đổi ngôn ngữ hiển thị — dù chỉ đổi một nhãn như "Họ" thành "Họ và tên lót" — đội kỹ thuật phải:

1. Sửa code → commit → review → merge → deploy
2. Toàn bộ quy trình mất tối thiểu vài giờ đến vài ngày

Điều này tạo ra bottleneck cho các đơn vị kinh doanh và làm giảm tính chủ động của đội vận hành.

### 2.2 Target Users & Personas

**Persona chính: Admin vận hành (Operations Admin)**
- Không có kỹ năng lập trình
- Truy cập hệ thống qua giao diện web nội bộ
- Cần thực hiện thay đổi nhỏ nhanh chóng (ví dụ: trước một chiến dịch tín dụng)
- Quen với giao diện dạng bảng + dialog chỉnh sửa

### 2.3 As-Is Process (Hiện tại)

```
Yêu cầu thay đổi label
    → Gửi ticket cho dev
    → Dev sửa hardcode trong TSX/TS file
    → Code review
    → Merge to main
    → Deploy lên production
    → Verify trên staging
    → Done (2–5 ngày)
```

### 2.4 To-Be Process (Mục tiêu)

```
Admin vào /admin/setting
    → Tìm field cần chỉnh
    → Click "Chỉnh sửa" → Dialog mở
    → Sửa label / placeholder
    → Lưu → Hệ thống ghi diff vào /data/field-schema-overrides.json
    → Form LoanFormWizard tự động đọc override khi render
    → Done (< 5 phút, không cần dev)
```

---

## 3. Phạm Vi (Scope)

### 3.1 In Scope

- Giao diện `/admin/setting` liệt kê toàn bộ field schemas hiện có theo từng Step
- Chức năng chỉnh sửa `label`, `name`, `placeholder` cho từng field
- Lưu trữ diff dưới dạng JSON tại `/data/field-schema-overrides.json` qua Next.js Route Handler (fs)
- Auth check: chỉ role `admin` (từ `AuthContext`) mới truy cập được trang và gọi được API ghi
- API đọc override khi form wizard khởi tạo (merge với static default)
- Chức năng reset về giá trị mặc định (xóa override của một field)
- Hiển thị trạng thái "đã chỉnh sửa" (badge) trên các field có override
- Override `visibleWhen` với một điều kiện đơn dạng leaf — phase 2 (field, operator, value)
- Override `visibleWhen` với cây điều kiện and/or nhiều nhánh — phase 3

### 3.2 Out of Scope

| Tính năng | Lý do loại khỏi scope |
|---|---|
| Chỉnh sửa `type` field (input/select/date) | Có thể phá vỡ validation schema Zod |
| Thêm field mới vào form | Vượt quá scope admin UI, cần thay đổi data model |
| Chỉnh sửa `options` của Select field | Liên quan đến nghiệp vụ, cần kiểm soát riêng |
| Chỉnh sửa `colSpan` / layout | Thuộc về design system, không phải nghiệp vụ |
| Phân quyền theo kênh (per-channel override) | Không trong scope lần này |
| Audit trail chi tiết (ai sửa gì, khi nào) | Sẽ xem xét trong phiên bản tiếp theo |
| Sync override lên backend API bên ngoài | Lưu local file là đủ cho giai đoạn này |

---

## 4. Yêu Cầu Chức Năng (Functional Requirements)

### 4.1 User Stories

---

**US-01: Xem danh sách tất cả field schema**

> _As an Admin, I want to view all form fields grouped by step, so that I can understand what is configurable and find the field I need to edit._

**Acceptance Criteria:**

```
Given: Admin đã đăng nhập và có role "admin"
When: Admin truy cập /admin/setting
Then:
  - Trang hiển thị danh sách field, nhóm theo Step (1–5)
  - Mỗi field hiển thị: Step ID, Field Name (key), Label hiện tại, Placeholder hiện tại
  - Field đang có override hiển thị badge "Đã chỉnh sửa"
  - Field chưa bị chỉnh sửa không có badge
  - Tổng số field hiển thị đúng với số field được định nghĩa trong STEP_FIELD_SCHEMAS
```

---

**US-02: Chỉnh sửa label và placeholder của một field**

> _As an Admin, I want to edit the label and placeholder of a specific field, so that the form displays terminology appropriate for our customers._

**Acceptance Criteria:**

```
Given: Admin đang xem danh sách field tại /admin/setting
When: Admin click nút "Chỉnh sửa" trên một field
Then: Dialog mở ra với 3 input: Label, Name (readonly), Placeholder

Given: Admin thay đổi Label và/hoặc Placeholder rồi click "Lưu"
When: API PATCH /api/admin/field-schema-overrides được gọi thành công
Then:
  - Dialog đóng lại
  - Field trong bảng hiển thị giá trị mới ngay lập tức (optimistic update)
  - Badge "Đã chỉnh sửa" xuất hiện trên field đó
  - Toast notification: "Cập nhật thành công"

Given: API trả về lỗi
Then:
  - Dialog giữ nguyên, hiển thị thông báo lỗi inline
  - Dữ liệu trong bảng không thay đổi
```

---

**US-03: Reset field về giá trị mặc định**

> _As an Admin, I want to reset a field's label/placeholder to its original default, so that I can undo accidental changes._

**Acceptance Criteria:**

```
Given: Field đang có override (badge "Đã chỉnh sửa" hiển thị)
When: Admin click "Reset về mặc định" trong dialog chỉnh sửa
Then:
  - Override của field đó bị xóa khỏi /data/field-schema-overrides.json
  - Field hiển thị lại giá trị mặc định từ static schema
  - Badge "Đã chỉnh sửa" biến mất
  - Toast notification: "Đã khôi phục về mặc định"

Given: Field không có override
Then: Nút "Reset về mặc định" bị disabled hoặc ẩn
```

---

**US-04: Tìm kiếm field theo tên**

> _As an Admin, I want to search fields by name or label, so that I can quickly find the field I need without scrolling through all steps._

**Acceptance Criteria:**

```
Given: Admin đang ở trang /admin/setting
When: Admin nhập từ khóa vào ô tìm kiếm
Then:
  - Danh sách field được lọc real-time (client-side filtering, không gọi API)
  - Kết quả match theo: field name (key) HOẶC label hiện tại (case-insensitive)
  - Nếu không có kết quả, hiển thị thông báo "Không tìm thấy field phù hợp"
  - Khi xóa từ khóa, danh sách trở về đầy đủ
```

---

**US-05: Ngăn chặn truy cập trái phép**

> _As a System, I want to restrict access to /admin/setting and the write APIs to admin role only, so that unauthorized users cannot modify form configurations._

**Acceptance Criteria:**

```
Given: Người dùng đăng nhập với role khác "admin" (ví dụ: STAFF, SUPERVISOR)
When: Người dùng truy cập /admin/setting
Then: Bị redirect về /dashboard với thông báo "Bạn không có quyền truy cập"

Given: Request gọi PATCH /api/admin/field-schema-overrides hoặc DELETE không có token admin
When: Route Handler kiểm tra role
Then: Trả về HTTP 403 Forbidden với body { error: "Forbidden" }

Given: Token hợp lệ nhưng role không phải "admin"
Then: Trả về HTTP 403 Forbidden
```

---

**US-06: Chỉnh sửa điều kiện hiển thị đơn giản (leaf condition) — Phase 2**

> _As an Admin, I want to set a simple visibility condition (one field + one operator + one value) for a form field, so that the field only appears when the specified condition is met._

**Acceptance Criteria:**

```
Given: Admin đang ở dialog chỉnh sửa của một field
When: Admin mở tab/section "Điều kiện hiển thị"
Then:
  - Hiển thị UI Condition Builder với 3 dropdown/input:
      [Field] [Operator] [Value]
  - Field dropdown liệt kê tất cả field trong cùng Step (trừ chính field đang sửa)
  - Operator dropdown gồm: "bằng" (eq), "không bằng" (neq), "chứa" (contains)
  - Value là input text tự do
  - Nếu field hiện có visibleWhen, pre-fill giá trị vào 3 ô
  - Nếu field không có visibleWhen, 3 ô để trống (field luôn hiển thị)

Given: Admin chọn Field + Operator + Value hợp lệ rồi click "Lưu"
When: API PATCH được gọi thành công
Then:
  - visibleWhen được lưu dưới dạng ConditionLeaf: { field, op, value }
  - Badge "Đã chỉnh sửa" xuất hiện (hoặc cập nhật)
  - Toast: "Cập nhật điều kiện hiển thị thành công"

Given: Admin xóa trắng tất cả 3 ô rồi click "Lưu"
Then: visibleWhen bị xóa → field luôn hiển thị (không điều kiện)

Given: Admin chỉ điền một trong ba ô (không đầy đủ)
Then: Validation lỗi inline: "Vui lòng điền đầy đủ field, operator và value"
      Nút "Lưu" bị disabled cho đến khi hợp lệ
```

---

**US-07: Chỉnh sửa điều kiện hiển thị phức hợp (and/or tree) — Phase 3**

> _As an Admin, I want to build complex visibility conditions with AND/OR logic combining multiple leaf conditions, so that I can express nuanced business rules for when a field should appear._

**Acceptance Criteria:**

```
Given: Admin đang ở Condition Builder (phase 3 UI)
When: Admin click "Thêm nhóm điều kiện"
Then:
  - Giao diện hiển thị dạng cây: ConditionGroup { op: "and" | "or", conditions: [...] }
  - Mỗi node trong cây có thể là leaf (field/op/value) hoặc group lồng nhau
  - Admin có thể thêm/xóa leaf và group bất kỳ
  - Nút AND/OR để chuyển đổi logic operator của mỗi group

Given: Admin lưu cây điều kiện hợp lệ
When: API PATCH được gọi
Then: visibleWhen lưu dạng ConditionGroup { op, conditions: [ConditionLeaf | ConditionGroup] }

Given: Admin muốn downgrade từ tree về leaf đơn giản
Then: Admin xóa bớt node đến khi chỉ còn một leaf duy nhất → tự động lưu dạng ConditionLeaf
```

> **Lưu ý:** US-07 thuộc phase 3 — chưa triển khai trong release này. Ghi nhận để định hướng data model.

---

### 4.2 Business Rules

| ID | Rule |
|---|---|
| BR-01 | Admin chỉ được chỉnh sửa `label`, `name`, `placeholder`, và `visibleWhen` (theo phase). Các thuộc tính khác (`type`, `colSpan`, `options`, `required`) là readonly và không bao giờ được ghi vào override. |
| BR-02 | `name` (field key) không được chỉnh sửa qua UI — đây là định danh kỹ thuật. Field `name` hiển thị readonly trong dialog. |
| BR-03 | `label` không được để trống sau khi chỉnh sửa. |
| BR-04 | `placeholder` có thể để trống (một số field không cần placeholder). |
| BR-05 | Override được lưu theo cặp `(stepId, fieldName)` — đây là composite key. |
| BR-06 | Khi không có override, form wizard fallback về giá trị static mặc định. |
| BR-07 | Thay đổi có hiệu lực ngay lập tức với các phiên form mới — không ảnh hưởng draft đang lưu. |
| BR-08 | `visibleWhen` leaf condition phải có đủ cả ba thành phần: `field`, `op`, `value`. Thiếu bất kỳ thành phần nào → validation lỗi, không cho lưu. |
| BR-09 | `field` trong leaf condition phải là tên của một field tồn tại trong cùng `stepId` — không được tham chiếu field ở step khác trong phase 2. |
| BR-10 | Khi Admin xóa trắng toàn bộ điều kiện hiển thị, `visibleWhen` được ghi thành `null` trong override (không phải xóa key `visibleWhen`), đảm bảo fallback về "luôn hiển thị" hoạt động đúng. |

### 4.3 Validation Rules

| Field | Rule |
|---|---|
| `label` | Bắt buộc, tối thiểu 1 ký tự, tối đa 100 ký tự |
| `placeholder` | Tùy chọn, tối đa 200 ký tự |
| `stepId` | Phải là số nguyên từ 1–5 |
| `fieldName` | Phải tồn tại trong `STEP_FIELD_SCHEMAS[stepId]` |
| `visibleWhen.field` | Phải là tên field tồn tại trong `STEP_FIELD_SCHEMAS[stepId]`; không được trùng với chính `fieldName` đang sửa |
| `visibleWhen.op` | Phải thuộc enum: `"eq"`, `"neq"`, `"contains"` |
| `visibleWhen.value` | Bắt buộc khi `visibleWhen` được cung cấp; chuỗi không rỗng, tối đa 200 ký tự |
| `visibleWhen` (null) | Giá trị `null` được chấp nhận — xóa điều kiện hiển thị, field luôn hiển thị |

---

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 5.1 Performance

- Trang `/admin/setting` tải danh sách field trong vòng **< 500ms** (dữ liệu chủ yếu là static, đọc file JSON nhỏ)
- Thao tác PATCH/DELETE hoàn thành trong **< 1 giây** (ghi file JSON local)
- Client-side search phản hồi trong **< 50ms** (không có network call)

### 5.2 Security & Compliance

- Auth check được thực hiện ở **cả hai lớp**: page-level (client redirect) và Route Handler (server-side 403)
- File `/data/field-schema-overrides.json` phải nằm ngoài `public/` để không bị expose trực tiếp qua HTTP
- Không lưu thông tin nhạy cảm vào override file (chỉ chứa label/placeholder là văn bản thuần)
- Input từ Admin phải được sanitize trước khi ghi file (loại bỏ HTML tags, ký tự đặc biệt nguy hiểm)

### 5.3 Usability

- Admin không cần hiểu cấu trúc JSON hay code để thực hiện thay đổi
- Mỗi thao tác có confirmation feedback rõ ràng (toast success/error)
- Trạng thái "đã chỉnh sửa" phân biệt rõ với "mặc định" qua badge trực quan
- Dialog chỉnh sửa hiển thị đồng thời giá trị mặc định (readonly) và giá trị override để so sánh

### 5.4 Scalability

- Số field tối đa dự kiến: ~80 field (5 steps × ~16 field/step)
- File JSON override nhỏ (< 10KB), không cần database cho giai đoạn này
- Thiết kế data model phải dễ migrate sang database nếu cần mở rộng trong tương lai

---

## 6. Luồng Nghiệp Vụ (Business Flows)

### 6.1 Happy Path — Chỉnh sửa một field

```
1. Admin truy cập /admin/setting
2. Hệ thống:
   a. Kiểm tra AuthContext → role === "admin" → cho phép
   b. Load static STEP_FIELD_SCHEMAS (client-side)
   c. Gọi GET /api/admin/field-schema-overrides → nhận diff JSON
   d. Merge: override ghi đè lên static default
   e. Render bảng với dữ liệu đã merge
3. Admin tìm field "Họ" (stepId=1, fieldName="firstName")
4. Admin click "Chỉnh sửa"
5. Dialog mở: Label="Họ", Name="firstName" (readonly), Placeholder="Nguyễn"
6. Admin sửa Label thành "Họ và tên lót", Placeholder thành "Ví dụ: Nguyễn Văn"
7. Admin click "Lưu"
8. Hệ thống:
   a. Validate input (label không rỗng, độ dài hợp lệ)
   b. Gọi PATCH /api/admin/field-schema-overrides
   c. Route Handler: kiểm tra token → đọc file hiện tại → merge diff → ghi file
   d. Trả về 200 OK với toàn bộ override map
9. UI: đóng dialog, cập nhật bảng, hiển thị badge "Đã chỉnh sửa", toast thành công
```

### 6.2 Alternative Flow — Field chưa có override

```
Tại bước 6.1-step 5:
- Dialog hiển thị giá trị từ static default
- Ô "Giá trị mặc định" hiển thị cùng dòng với giá trị đang nhập (để so sánh)
- Nút "Reset về mặc định" bị disabled
```

### 6.3 Exception Flow — Lỗi ghi file

```
Tại bước 6.1-step 8:
- Route Handler không thể ghi file (permission error, disk full)
- Trả về 500 Internal Server Error
- UI: hiển thị thông báo lỗi trong dialog, KHÔNG đóng dialog
- Admin có thể thử lại hoặc hủy
```

### 6.4 Exception Flow — Truy cập trái phép

```
1. Người dùng không có role "admin" truy cập /admin/setting
2. Page component kiểm tra AuthContext
3. role !== "admin" → redirect ngay lập tức về /dashboard
4. Nếu gọi trực tiếp API: Route Handler trả về 403
```

### 6.5 State Transitions của một FieldSchemaOverride

```
[Không tồn tại]
      │
      │ Admin chỉnh lần đầu (PATCH)
      ▼
[Override tồn tại] ─── Admin chỉnh lại (PATCH) ──▶ [Override tồn tại, giá trị mới]
      │
      │ Admin reset (DELETE)
      ▼
[Không tồn tại] (fallback về static default)
```

---

## 7. Wireframe Mô Tả Bằng Text

### 7.1 Trang `/admin/setting` — Table View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Admin > Cài đặt Field Schema                                           │
│                                                                         │
│  [🔍 Tìm kiếm field...                    ] [Hiển thị: Tất cả ▼]       │
│                                                                         │
│  ── Step 1: Thông tin cá nhân ──────────────────────────────────────── │
│                                                                         │
│  Field Name      Label hiện tại          Placeholder hiện tại   Hành động │
│  ─────────────   ─────────────────────   ──────────────────────  ──────── │
│  firstName       Họ [Đã chỉnh sửa]       Nhập họ của bạn         [Sửa]   │
│  lastName        Tên                     Văn An                  [Sửa]   │
│  dateOfBirth     Ngày sinh               —                       [Sửa]   │
│  gender          Giới tính               Chọn giới tính          [Sửa]   │
│  nationalId      Số CMND / Hộ chiếu      Số CMND hoặc Hộ chiếu  [Sửa]   │
│  phone           Điện thoại di động      0901 234 567            [Sửa]   │
│  email           Email                   email@example.com       [Sửa]   │
│  ...                                                                    │
│                                                                         │
│  ── Step 2: Thu nhập & Tài chính ──────────────────────────────────── │
│  ...                                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Ghi chú:**
- Badge `[Đã chỉnh sửa]` màu xanh lam (blue), chỉ xuất hiện khi field có override
- Cột "Placeholder hiện tại": nếu không có placeholder thì hiển thị dấu gạch ngang `—`
- Nút `[Sửa]` luôn hiển thị với tất cả field
- Có thể nhóm/collapse từng Step để dễ điều hướng

### 7.2 Dialog Chỉnh Sửa

```
┌──────────────────────────────────────────────────┐
│  Chỉnh sửa Field: firstName                      │
│  Step 1 — Thông tin cá nhân                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Field Name (định danh kỹ thuật)                 │
│  ┌────────────────────────────────────┐          │
│  │ firstName                   [khoá] │          │
│  └────────────────────────────────────┘          │
│  Không thể thay đổi field name.                  │
│                                                  │
│  Label *                                         │
│  Mặc định: "Họ"                                  │
│  ┌────────────────────────────────────┐          │
│  │ Họ và tên lót                      │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  Placeholder                                     │
│  Mặc định: "Nguyễn"                              │
│  ┌────────────────────────────────────┐          │
│  │ Ví dụ: Nguyễn Văn                 │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  [Reset về mặc định]        [Hủy] [Lưu thay đổi]│
└──────────────────────────────────────────────────┘
```

**Ghi chú:**
- "Mặc định: ..." hiển thị giá trị static để Admin có thể so sánh
- Nút "Reset về mặc định" ở góc trái, style ghost/outline, màu cảnh báo
- Nút "Lưu thay đổi" disabled khi Label trống
- Nút "Lưu thay đổi" hiển thị spinner khi đang gọi API

### 7.3 Section "Điều kiện hiển thị" trong Dialog — Condition Builder UI (Phase 2)

```
┌──────────────────────────────────────────────────┐
│  Điều kiện hiển thị (visibleWhen)                │
│  Field này chỉ hiển thị khi:                     │
│                                                  │
│  ┌──────────────────┐ ┌──────────┐ ┌──────────┐  │
│  │ gender        ▼  │ │ bằng  ▼  │ │ Nam      │  │
│  └──────────────────┘ └──────────┘ └──────────┘  │
│   [Field trong step]   [Operator]   [Giá trị]    │
│                                                  │
│  Ví dụ: "Hiển thị khi gender = Nam"              │
│                                                  │
│  [Xóa điều kiện]                                 │
└──────────────────────────────────────────────────┘
```

**Ghi chú Condition Builder:**
- Dropdown "Field" liệt kê toàn bộ field trong cùng step, loại trừ field đang chỉnh sửa
- Dropdown "Operator" gồm 3 lựa chọn: `bằng (eq)`, `không bằng (neq)`, `chứa (contains)`
- Input "Giá trị" là text field tự do; placeholder gợi ý ví dụ giá trị
- Nút "Xóa điều kiện" chỉ hiển thị khi đang có điều kiện được cài đặt; click sẽ xóa cả 3 ô và ghi `visibleWhen: null`
- Khi một trong ba ô bị bỏ trống (nhưng không xóa hết), hiển thị lỗi inline bên dưới builder
- Section này nằm bên dưới các input Label/Placeholder trong dialog, có thể collapsible
- Phase 3 (and/or tree) sẽ thay thế section này bằng visual tree builder — thiết kế chi tiết trong PRD riêng

---

## 8. Data Model

### 8.1 TypeScript Types

```typescript
// Điều kiện đơn (leaf): một field so sánh với một giá trị
interface ConditionLeaf {
  type: "leaf"
  field: string                        // Tên field trong cùng step
  op: "eq" | "neq" | "contains"       // Operator
  value: string                        // Giá trị so sánh
}

// Điều kiện phức hợp (group): nhiều node kết hợp bằng and/or — dùng trong Phase 3
interface ConditionGroup {
  type: "group"
  op: "and" | "or"
  conditions: Array<ConditionLeaf | ConditionGroup>  // Hỗ trợ lồng nhau tùy ý
}

// Union type: một ConditionNode có thể là leaf hoặc group
type ConditionNode = ConditionLeaf | ConditionGroup

// Đơn vị lưu trữ override cho một field cụ thể
interface FieldSchemaOverride {
  label?: string                   // Nếu undefined → dùng giá trị static mặc định
  placeholder?: string             // Nếu undefined → dùng giá trị static mặc định
  visibleWhen?: ConditionNode | null
  // null = Admin đã chủ động xóa điều kiện → luôn hiển thị
  // undefined = không có override → dùng static mặc định
  // ConditionNode = điều kiện đang được áp dụng
  // "name" KHÔNG có trong override: định danh kỹ thuật không được thay đổi
}

// Key: "stepId:fieldName" — ví dụ: "1:firstName"
type OverrideKey = `${number}:${string}`

// Toàn bộ nội dung file /data/field-schema-overrides.json
interface FieldSchemaOverrideMap {
  version: 1                                    // Schema version để migrate sau này
  updatedAt: string                             // ISO 8601 timestamp lần ghi gần nhất
  overrides: Record<OverrideKey, FieldSchemaOverride>
}
```

### 8.2 Ví Dụ nội dung `/data/field-schema-overrides.json`

```json
{
  "version": 1,
  "updatedAt": "2026-05-06T09:30:00.000Z",
  "overrides": {
    "1:firstName": {
      "label": "Họ và tên lót",
      "placeholder": "Ví dụ: Nguyễn Văn"
    },
    "1:email": {
      "placeholder": "Nhập địa chỉ email công ty"
    },
    "1:spouseName": {
      "label": "Họ tên vợ/chồng",
      "visibleWhen": {
        "type": "leaf",
        "field": "maritalStatus",
        "op": "eq",
        "value": "married"
      }
    },
    "1:companyName": {
      "label": "Tên đơn vị công tác",
      "visibleWhen": null
    },
    "5:loanAmount": {
      "label": "Số tiền đề nghị vay (VNĐ)"
    }
  }
}
```

**Ghi chú ví dụ:**
- `"1:spouseName"` — field chỉ hiển thị khi `maritalStatus = "married"` (leaf condition, phase 2)
- `"1:companyName"` — Admin đã chủ động xóa điều kiện cũ (`visibleWhen: null`), field luôn hiển thị
- `"5:loanAmount"` — chỉ override label, không có visibleWhen override (dùng static mặc định)

### 8.3 Nguyên tắc lưu trữ Diff-Only

- File chỉ chứa các field **đã được Admin chỉnh sửa** (diff), không lưu toàn bộ schema
- Một field chỉ lưu thuộc tính nào được thay đổi — nếu chỉ đổi `label` thì `placeholder` không xuất hiện trong object
- Khi Admin reset một field về mặc định → key tương ứng bị xóa khỏi `overrides`
- Khi `overrides` rỗng, file vẫn tồn tại với structure hợp lệ (không xóa file)

### 8.4 Data Retention

- File không có TTL — override tồn tại vĩnh viễn cho đến khi Admin chủ động reset
- Backup file trước mỗi lần ghi là khuyến nghị (xem Migration Plan)

---

## 9. API Specification

### 9.1 Route Handler: GET `/api/admin/field-schema-overrides`

**Mục đích:** Đọc toàn bộ override map hiện tại để render bảng trên `/admin/setting`.

**Auth:** Yêu cầu Bearer token hợp lệ với role `admin`.

**Request:**
```
GET /api/admin/field-schema-overrides
Authorization: Bearer <access_token>
```

**Response 200 OK:**
```json
{
  "version": 1,
  "updatedAt": "2026-05-06T09:30:00.000Z",
  "overrides": {
    "1:firstName": {
      "label": "Họ và tên lót",
      "placeholder": "Ví dụ: Nguyễn Văn"
    }
  }
}
```

**Response khi file chưa tồn tại (first run):**
```json
{
  "version": 1,
  "updatedAt": null,
  "overrides": {}
}
```

**Response 403 Forbidden:**
```json
{ "error": "Forbidden" }
```

---

### 9.2 Route Handler: PATCH `/api/admin/field-schema-overrides`

**Mục đích:** Thêm hoặc cập nhật override cho một field cụ thể.

**Auth:** Yêu cầu Bearer token hợp lệ với role `admin`.

**Request Body:**
```json
{
  "stepId": 1,
  "fieldName": "spouseName",
  "label": "Họ tên vợ/chồng",
  "placeholder": "Ví dụ: Nguyễn Thị B",
  "visibleWhen": {
    "type": "leaf",
    "field": "maritalStatus",
    "op": "eq",
    "value": "married"
  }
}
```

Ghi chú: `visibleWhen` là optional. Các giá trị hợp lệ:
- Omit hoàn toàn (undefined) → không thay đổi visibleWhen hiện tại trong override
- `null` → xóa điều kiện hiển thị, field luôn hiển thị
- `ConditionLeaf` object → đặt điều kiện đơn (phase 2)
- `ConditionGroup` object → đặt điều kiện phức hợp (phase 3)

**Validation:**
- `stepId`: required, integer 1–5
- `fieldName`: required, phải tồn tại trong STEP_FIELD_SCHEMAS[stepId]
- `label`: required nếu có trong body, string 1–100 chars, sau khi trim
- `placeholder`: optional, string 0–200 chars
- `visibleWhen`: optional; nếu cung cấp và không null thì phải hợp lệ theo ConditionNode schema:
  - `type` bắt buộc: `"leaf"` hoặc `"group"`
  - Nếu `"leaf"`: `field`, `op`, `value` đều bắt buộc; `field` phải tồn tại trong STEP_FIELD_SCHEMAS[stepId] và khác `fieldName`
  - `op` phải thuộc: `"eq"`, `"neq"`, `"contains"`

**Response 200 OK** — trả về toàn bộ override map sau khi cập nhật:
```json
{
  "version": 1,
  "updatedAt": "2026-05-06T10:15:00.000Z",
  "overrides": {
    "1:spouseName": {
      "label": "Họ tên vợ/chồng",
      "placeholder": "Ví dụ: Nguyễn Thị B",
      "visibleWhen": {
        "type": "leaf",
        "field": "maritalStatus",
        "op": "eq",
        "value": "married"
      }
    }
  }
}
```

**Response 400 Bad Request** — validation thất bại:
```json
{
  "error": "Validation failed",
  "details": {
    "label": "Label không được để trống",
    "visibleWhen.field": "Field 'unknownField' không tồn tại trong step 1",
    "visibleWhen.op": "Operator phải là một trong: eq, neq, contains"
  }
}
```

**Response 403 Forbidden:**
```json
{ "error": "Forbidden" }
```

**Response 500 Internal Server Error** — lỗi ghi file:
```json
{ "error": "Failed to write override file" }
```

---

### 9.3 Route Handler: DELETE `/api/admin/field-schema-overrides`

**Mục đích:** Xóa override của một field, trả về giá trị mặc định static.

**Auth:** Yêu cầu Bearer token hợp lệ với role `admin`.

**Request Body:**
```json
{
  "stepId": 1,
  "fieldName": "firstName"
}
```

**Response 200 OK** — trả về override map sau khi đã xóa key:
```json
{
  "version": 1,
  "updatedAt": "2026-05-06T10:20:00.000Z",
  "overrides": {}
}
```

**Response 404 Not Found** — field không có override để xóa:
```json
{ "error": "Override not found for 1:firstName" }
```

**Response 403 Forbidden:**
```json
{ "error": "Forbidden" }
```

---

## 10. Migration Plan

### Giai đoạn 1: Static (Hiện tại — Baseline)

- Toàn bộ `label` và `placeholder` hardcode trong `step-customer-info.tsx` và các step component khác
- `STEP_FIELD_SCHEMAS` trong `lib/field-schema.ts` định nghĩa static schema
- Không có mechanism override nào

**Deliverable của giai đoạn 1:** Không có gì — đây là baseline.

---

### Giai đoạn 2: Dynamic với Fallback (Target của PRD này)

**Bước 2.1 — Chuẩn bị data layer:**
- Tạo `/data/field-schema-overrides.json` (empty: `{ "version": 1, "updatedAt": null, "overrides": {} }`)
- Thêm types `ConditionLeaf`, `ConditionGroup`, `ConditionNode`, `FieldSchemaOverride`, `FieldSchemaOverrideMap` vào `lib/field-schema-types.ts` (file mới)

**Bước 2.2 — Tạo 3 Route Handlers:**
- `app/api/admin/field-schema-overrides/route.ts`
  - Handler `GET`: đọc file, trả JSON
  - Handler `PATCH`: validate → đọc → merge → ghi → trả kết quả
  - Handler `DELETE`: validate → đọc → xóa key → ghi → trả kết quả
- Mỗi handler thực hiện auth check từ Authorization header

**Bước 2.3 — Tạo API client:**
- Thêm `lib/apis/field-schema-overrides.ts` với 3 method tương ứng

**Bước 2.4 — Tạo trang Admin:**
- `app/admin/setting/page.tsx`: auth check → render table
- Load static STEP_FIELD_SCHEMAS + gọi GET API → merge → render
- Edit dialog component với form state local
- Thêm section Condition Builder (3 dropdown/input: field, op, value) vào dialog — chỉ hiển thị khi field có thể có `visibleWhen`

**Bước 2.4b — Condition Builder cho `visibleWhen` leaf:**
- Dropdown Field: liệt kê field trong cùng step, loại trừ field đang sửa
- Dropdown Operator: `eq`, `neq`, `contains`
- Input Value: text tự do
- Validate: ba ô phải cùng điền hoặc cùng trống
- Nút "Xóa điều kiện": ghi `visibleWhen: null` vào override

**Bước 2.5 — Tích hợp override vào Form Wizard:**
- Trong `FormConfigProvider` hoặc `DynamicFormStep`: fetch override một lần khi mount
- Apply override: nếu field có override → dùng override label/placeholder; nếu không → dùng static default
- Fallback: nếu GET API thất bại → im lặng dùng static default (không block form)

**Validation gate (không deploy nếu thất bại):**
- Form vẫn hoạt động bình thường khi file override không tồn tại
- Form vẫn hoạt động bình thường khi API GET trả về lỗi
- Admin không thể lưu override với label rỗng
- Non-admin nhận 403 khi gọi write API
- Khi override có `visibleWhen` hợp lệ, Form Wizard evaluate đúng điều kiện và ẩn/hiện field tương ứng
- Khi `visibleWhen = null` trong override, Form Wizard bỏ qua điều kiện static và luôn hiển thị field

---

### Giai đoạn 3: Mở rộng (Future — ngoài scope PRD này)

- Migrate từ file JSON sang database table (khi có nhiều admin hoặc cần audit trail)
- Thêm per-channel override (STAFF vs CLIENT vs POS có label khác nhau)
- Thêm audit log: ai thay đổi gì, lúc nào
- Thêm preview mode: Admin xem trước form với override trước khi lưu
- **`visibleWhen` and/or tree:** thay thế Condition Builder đơn bằng visual tree builder hỗ trợ `ConditionGroup` lồng nhau; lưu `visibleWhen` dạng `{ type: "group", op: "and"|"or", conditions: [...] }` (US-07)

---

## 11. Ma Trận Phân Quyền (Permission Matrix)

| Hành động | Admin | Supervisor | Staff | Client | Ghi chú |
|---|---|---|---|---|---|
| Truy cập `/admin/setting` | Cho phép | Từ chối | Từ chối | Từ chối | Redirect về /dashboard |
| GET `/api/admin/field-schema-overrides` | Cho phép | Từ chối (403) | Từ chối (403) | Từ chối (403) | — |
| PATCH `/api/admin/field-schema-overrides` | Cho phép | Từ chối (403) | Từ chối (403) | Từ chối (403) | — |
| DELETE `/api/admin/field-schema-overrides` | Cho phép | Từ chối (403) | Từ chối (403) | Từ chối (403) | — |
| Xem form với override đã áp dụng | Cho phép | Cho phép | Cho phép | Cho phép | Override hiển thị cho tất cả người dùng form |

**Cơ chế xác định role:**
- Client-side: đọc từ `AuthContext` (field `role` trong user object từ `/me` API)
- Server-side (Route Handler): decode JWT từ `Authorization: Bearer <token>` header, kiểm tra claim `role === "admin"`
- Không tin tưởng role từ client body/params — luôn verify từ token phía server

---

## 12. Open Questions

| # | Câu hỏi | Mức độ ưu tiên | Người cần trả lời |
|---|---|---|---|
| OQ-01 | `/me` API hiện tại trả về field `role` không? Nếu có, format cụ thể là gì (string "admin" hay enum)? | Critical | Backend Dev |
| OQ-02 | JWT có chứa claim `role` để Route Handler decode không, hay cần gọi `/me` endpoint để verify? | Critical | Backend Dev |
| OQ-03 | File `/data/field-schema-overrides.json` có được commit vào git không? Hay nên gitignore và tạo lại khi deploy? | High | DevOps / Tech Lead |
| OQ-04 | Khi nhiều Admin thao tác đồng thời (race condition khi ghi file), cơ chế xử lý là gì? | High | Tech Lead |
| OQ-05 | `STEP_FIELD_SCHEMAS` trong `lib/field-schema.ts` hiện chứa những gì? File này có tồn tại chưa hay cần tạo mới? | High | Dev |
| OQ-06 | Override có áp dụng cho cả 3 channel (STAFF, CLIENT, POS) không, hay chỉ STAFF trong giai đoạn này? | Medium | Product Owner |
| OQ-07 | Cần backup file override trước khi ghi không? Nếu có, lưu bao nhiêu phiên bản? | Medium | Tech Lead |
| OQ-08 | Admin có cần confirm (modal xác nhận) trước khi "Reset về mặc định" không? | Low | UX / Product Owner |
| OQ-09 | Step 6 (Xem lại & Nộp đơn) có field nào cần override label không? | Low | Product Owner |

---

## 13. Phân Loại Ưu Tiên (MoSCoW)

### Must Have (bắt buộc trong release này)

- Trang `/admin/setting` với bảng liệt kê field theo step
- Chức năng chỉnh sửa `label` và `placeholder` qua dialog
- Lưu diff vào `/data/field-schema-overrides.json` qua PATCH Route Handler
- Auth check role `admin` ở cả page level và API level
- Fallback an toàn khi file override không tồn tại hoặc API lỗi
- Form wizard đọc và áp dụng override khi render

### Should Have (nên có nếu đủ thời gian)

- Chức năng reset field về mặc định (DELETE Route Handler + UI button)
- Badge "Đã chỉnh sửa" để phân biệt field có override
- Hiển thị giá trị mặc định trong dialog để so sánh
- Toast notification cho success/error
- Override `visibleWhen` leaf condition đơn giản (US-06): Condition Builder 3 ô — field, operator, value

### Could Have (có thể bổ sung sau)

- Search/filter field theo tên hoặc label (US-04)
- Collapse/expand từng Step trong bảng
- Confirm dialog trước khi reset
- Override `visibleWhen` and/or tree (US-07): visual tree builder hỗ trợ `ConditionGroup` lồng nhau — Phase 3

### Won't Have (không làm trong release này)

- Per-channel override (STAFF vs CLIENT vs POS)
- Audit trail (ai sửa, lúc nào)
- Preview mode
- Override `type`, `options`, `colSpan`
- Thêm field mới vào form
- Sync override lên backend API bên ngoài

---

## 14. Định Nghĩa Hoàn Thành (Definition of Done)

### Functionality

- [ ] Trang `/admin/setting` render đúng danh sách field từ tất cả 5 step
- [ ] Dialog chỉnh sửa mở/đóng đúng, validate input trước khi gửi
- [ ] PATCH API ghi thành công vào file và trả về 200 với data mới
- [ ] DELETE API xóa key đúng và trả về 200
- [ ] GET API trả về empty map khi file chưa tồn tại (không throw 500)
- [ ] Form wizard áp dụng override label/placeholder đúng tại runtime
- [ ] Form wizard fallback về static khi API lỗi (không block form)

### Security

- [ ] Non-admin user bị redirect khi truy cập `/admin/setting`
- [ ] Non-admin token nhận 403 từ tất cả 3 Route Handlers
- [ ] Input được sanitize trước khi ghi file

### Quality

- [ ] Không có `console.log` trong code (R1)
- [ ] Không hardcode URL hay token (R2)
- [ ] Button "Lưu thay đổi" có loading state và disabled khi đang gọi API (R6)
- [ ] Catch block trong API client xử lý lỗi đúng (R10)
- [ ] Unit test cho merge logic (override ghi đè static default)
- [ ] Unit test cho validation rules

### UX

- [ ] Toast success hiển thị sau khi lưu thành công
- [ ] Toast error hiển thị khi API thất bại
- [ ] Badge "Đã chỉnh sửa" xuất hiện đúng sau khi override được lưu

---

*Tài liệu này được tạo bởi Business Analyst dựa trên phân tích codebase Next.js App Router tại `/Users/nguyentan/Desktop/projects/loan-application`. Mọi thay đổi về scope phải được xác nhận với Product Owner trước khi cập nhật PRD.*
