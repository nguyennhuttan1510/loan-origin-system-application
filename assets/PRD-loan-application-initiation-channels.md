# PRD: Khởi tạo Đơn Yêu cầu Vay Đa Kênh (Multi-channel Loan Application Initiation)

**Ngày tạo:** 30/04/2026
**Tác giả:** BA — los-ba-prd-writer
**Trạng thái:** Draft — Chờ review stakeholder

---

## 1. Tổng Quan (Overview)

### Mục tiêu tính năng

Thiết kế và chuẩn hóa flow khởi tạo đơn yêu cầu vay từ **3 kênh tiếp nhận** khác nhau, mỗi kênh phục vụ một nhóm actor riêng biệt với nhu cầu UX và data requirements khác nhau.

### Business Value

- Mở rộng kênh phân phối sản phẩm vay → tăng volume đơn tiếp nhận
- Giảm thời gian xử lý tại điểm bán (POS) → tăng tỷ lệ chuyển đổi
- Chuẩn hóa dữ liệu đầu vào từ tất cả kênh → tăng chất lượng underwriting

### Stakeholders

| Vai trò | Liên quan |
|---|---|
| Product Owner | Phê duyệt scope và priority |
| Backend Architect | Thiết kế API gateway + auth scope theo channel |
| Frontend Lead | Quyết định platform separation (1 app hay 3) |
| Compliance/Legal | Xác nhận PDPA consent flow, Nghị định 13/2023 |
| POS Partner Manager | Định nghĩa merchant tier và onboarding flow |
| Credit Risk | Xác nhận instant scoring availability |

---

## 2. Bối Cảnh Nghiệp Vụ (Business Context)

### Problem Statement

Hệ thống LOS hiện tại có 2 flow tạo đơn song song nhưng chưa liên kết:
- **Flow A** (`/application/create`): Quick Init cho Staff, đã kết nối API
- **Flow B** (`/application`): Full 6-step Wizard, UI hoàn chỉnh nhưng **chưa gọi API submit**

Ngoài ra, hệ thống chưa hỗ trợ kênh khách hàng tự phục vụ (client self-serve) và kênh đại lý bán lẻ (POS partner), dẫn đến bỏ lỡ nguồn đơn từ hai kênh tăng trưởng quan trọng.

### Target Users & Personas

| Persona | Mô tả | Môi trường |
|---|---|---|
| **Loan Officer** | Nhân viên tín dụng tại chi nhánh, xử lý 20–50 đơn/ngày | Desktop, văn phòng |
| **Client — Người vay cá nhân** | Khách hàng tự tìm hiểu và nộp đơn online | Mobile (80%+) |
| **POS Agent** | Nhân viên cửa hàng xe máy, điện tử, bất động sản | Tablet/Phone tại quầy |

### As-Is Process

```
Hiện tại (Staff Channel duy nhất):
Khách đến quầy → Staff tạo quick init → Staff điền 6-step wizard (chưa submit được API)
```

### To-Be Process

```
Channel 1 (Staff):    Walk-in/call → Quick Init → Full Wizard → Underwriting Queue
Channel 2 (Client):   Landing page → eKYC → Self-serve Form → OTP Consent → Status Tracking
Channel 3 (POS):      Khách mua hàng → POS form rút gọn → Instant Scoring → OTP Consent → Biên nhận
```

---

## 3. Phạm Vi (Scope)

### In Scope

- Chuẩn hóa và hoàn thiện **Staff Channel** (fix API submit của Flow B)
- Thiết kế **Client Self-serve Portal** (public-facing, separate từ internal)
- Thiết kế **POS Partner Portal** với Merchant auth scope riêng
- Định nghĩa data model thống nhất cho `ApplicationRequest` đa kênh
- OTP consent flow cho Client và POS channel
- Application status tracking page cho Client

### Out of Scope

- Underwriting / credit scoring engine (backend concern)
- eKYC vendor integration chi tiết (cần vendor selection trước)
- Disbursement flow sau approval
- Merchant commission management
- Offline mode cho POS

---

## 4. Yêu Cầu Chức Năng (Functional Requirements)

### 4.1 Channel 1 — Internal Staff

**US-01:** Kết nối API submit cho Full Wizard

> As a Loan Officer, I want to submit the complete 6-step application to the backend, so that the underwriting team can process it.

**Acceptance Criteria:**
- Given: Staff đã hoàn thành bước 6 (Review)
- When: Bấm "Submit Application"
- Then: Hệ thống gọi `POST /loan-application/create` với đầy đủ payload từ 6 steps
- And: Nhận `applicationId` từ response và hiển thị confirmation screen
- And: Nếu API lỗi, hiển thị error message cụ thể (không để lỗi silent)

**US-02:** Pre-fill thông tin khách hàng hiện hữu

> As a Loan Officer, I want to search by phone number or national ID to pre-fill existing customer data, so that I don't re-enter information already in the system.

**Acceptance Criteria:**
- Given: Staff nhập số điện thoại hoặc số CMND/CCCD tại Quick Init
- When: Hệ thống tìm thấy khách hàng trong CRM/core banking
- Then: Tự động điền họ tên, ngày sinh, địa chỉ vào form
- And: Staff có thể chỉnh sửa thông tin đã pre-fill trước khi submit

**US-03:** Liên kết Quick Init với Full Wizard

> As a Loan Officer, I want the applicationId from quick init to carry over into the full wizard, so that the two forms represent a single application record.

**Acceptance Criteria:**
- Given: Quick Init submit thành công và nhận `applicationId`
- When: Hệ thống chuyển sang Full Wizard
- Then: `applicationId` được truyền và hiển thị ở header ("Đơn #12345")
- And: Full Wizard dùng `PUT /loan-application/:id` thay vì POST mới

---

### 4.2 Channel 2 — Client Self-serve

**US-04:** Đăng ký tài khoản và bắt đầu đơn vay

> As a Client, I want to register an account with my phone number and start a loan application, so that I can apply for a loan without visiting a branch.

**Acceptance Criteria:**
- Given: Khách truy cập Client Portal
- When: Nhập phone, password, họ tên, ngày sinh, CCCD
- Then: `POST /public/register` tạo tài khoản với `type: CLIENT`
- And: Hệ thống tự động chuyển sang màn hình bắt đầu đơn vay

**US-05:** Save-and-resume form

> As a Client, I want my form progress to be saved automatically, so that I can continue where I left off if I close the browser.

**Acceptance Criteria:**
- Given: Client đang điền form ở bất kỳ step nào
- When: Client đóng browser và quay lại sau
- Then: Form phục hồi đúng step và dữ liệu đã điền (localStorage draft hoặc server-side draft)
- And: Hiển thị banner "Bạn có đơn chưa hoàn thành — Tiếp tục?"

**US-06:** OTP consent trước khi submit

> As a Client, I want to confirm my loan application with an OTP, so that I provide explicit digital consent for the lender to process my application.

**Acceptance Criteria:**
- Given: Client đã hoàn thành Review step (step 6)
- When: Bấm "Xác nhận nộp đơn"
- Then: Hệ thống gửi OTP về số điện thoại đã đăng ký
- And: Client nhập OTP → hệ thống submit application
- And: Nếu OTP sai 3 lần → block 15 phút

**US-07:** Theo dõi trạng thái đơn vay

> As a Client, I want to track my application status after submission, so that I know what stage my loan is at without calling the branch.

**Acceptance Criteria:**
- Given: Client đã submit đơn thành công
- When: Truy cập trang "Đơn của tôi"
- Then: Hiển thị danh sách đơn với trạng thái hiện tại
- And: Mỗi đơn hiển thị: mã đơn, sản phẩm, số tiền, ngày nộp, trạng thái
- And: Trạng thái được mapping rõ ràng sang tiếng Việt thân thiện

---

### 4.3 Channel 3 — POS Partner

**US-08:** POS Agent đăng nhập với merchant account

> As a POS Agent, I want to log in with my store's merchant credentials, so that all applications I create are linked to the correct merchant.

**Acceptance Criteria:**
- Given: POS Agent mở POS Portal
- When: Nhập merchant code + password
- Then: Hệ thống xác thực qua merchant auth endpoint và cấp JWT với `scope: POS`
- And: Session gắn `merchantId` vào mọi request trong phiên làm việc

**US-09:** Tạo đơn nhanh tại điểm bán

> As a POS Agent, I want to create a loan application in under 2 minutes, so that the customer doesn't wait too long at the checkout.

**Acceptance Criteria:**
- Given: POS Agent đã đăng nhập
- When: Nhập thông tin khách (tên, SĐT, CCCD), giá trị đơn hàng, chọn kỳ hạn
- Then: Form submit trong <5 giây
- And: Hệ thống trả về instant decision (approved/pending/rejected) trong <30 giây
- And: Nếu approved: hiển thị "Được duyệt — Góp X triệu/tháng trong Y tháng"

**US-10:** Khách hàng xác nhận OTP tại POS

> As a Customer at POS, I want to confirm my loan application with an OTP sent to my phone, so that I give explicit consent without needing to sign paperwork on the spot.

**Acceptance Criteria:**
- Given: POS Agent đã điền đủ thông tin và instant decision = approved
- When: Hệ thống gửi OTP về số điện thoại khách
- Then: Khách nhập OTP trên màn hình tablet/POS device
- And: Sau OTP thành công: application chính thức được ghi nhận
- And: Hệ thống in/gửi SMS biên nhận cho khách

---

### 4.4 Business Rules Chung

| Rule | Mô tả |
|---|---|
| BR-01 | Mỗi CCCD chỉ được có tối đa N đơn đang active (N do credit policy định nghĩa) |
| BR-02 | Số tiền vay không được vượt `maxAmount` của sản phẩm đã chọn |
| BR-03 | Thời hạn vay phải nằm trong `[minTenure, maxTenure]` của sản phẩm |
| BR-04 | Khách hàng phải đủ 18 tuổi tại thời điểm nộp đơn |
| BR-05 | Consent (OTP) bắt buộc với Client và POS channel trước khi lưu application |
| BR-06 | Staff channel: Staff phải có role `LOAN_OFFICER` hoặc cao hơn để tạo đơn |
| BR-07 | POS channel: Số tiền vay = Giá trị hàng - Down payment (không được âm) |

---

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

| Tiêu chí | Yêu cầu |
|---|---|
| **Performance** | Form submit < 3 giây; POS instant decision < 30 giây |
| **Availability** | POS channel: 99.9% uptime trong giờ kinh doanh |
| **Security** | JWT per channel scope; OTP rate-limit; HTTPS bắt buộc |
| **Compliance** | Thu thập PDPA consent trước khi xử lý PII (Nghị định 13/2023/NĐ-CP) |
| **Usability — Mobile** | Client Portal: WCAG 2.1 AA, responsive mobile-first |
| **Usability — POS** | Form POS: tối đa 5 fields, font ≥16px, touch-friendly |
| **Scalability** | Hỗ trợ đồng thời 500 POS sessions vào giờ cao điểm |

---

## 6. Luồng Nghiệp Vụ (Business Flows)

### 6.1 Channel 1 — Staff

```
[Khách hàng walk-in/call]
        |
[Staff đăng nhập LOS Portal] → POST /public/login
        |
[Dashboard] → [Tạo đơn mới: /application/create]
        |
[Quick Init Form]
  - productId, requestAmount, tenure, purpose
  - customerName, dateOfBirth, phoneNumber, national, nationalId
        |
[Submit] → POST /loan-application/create
        |
[Nhận applicationId] → [Chuyển sang Full Wizard /application?id=xxx]
        |
[Step 1] Thông tin cá nhân chi tiết
[Step 2] Thu nhập & Tài sản
[Step 3] Co-borrower + References
[Step 4] Địa chỉ
[Step 5] Loan details + Collateral + Insurance
[Step 6] Review & Submit
        |
[Submit] → PUT /loan-application/:id
        |
[Underwriting Queue]
```

### 6.2 Channel 2 — Client Self-serve

```
[Landing Page] → [Xem sản phẩm vay]
        |
[Đăng ký / Đăng nhập] → POST /public/register hoặc /public/login
        |
[eKYC] → Chụp CCCD + Selfie → auto-fill thông tin
        |
[Application Form — 6 steps, mobile-first]
        |
[Auto-save draft mỗi step]
        |
[Review] → [OTP Consent] → POST /public/otp/send
        |
[Nhập OTP] → POST /loan-application/create
        |
[Confirmation + Application tracking page]
```

### 6.3 Channel 3 — POS

```
[Khách mua hàng tại cửa hàng]
        |
[POS Agent đăng nhập] → Merchant Auth → JWT scope=POS
        |
[POS Form rút gọn]
  - Thông tin đơn hàng (auto từ POS system)
  - Họ tên, SĐT, CCCD khách hàng
  - Chọn kỳ hạn trả góp
        |
[Submit sơ bộ] → POST /loan-application/pos/create
        |
[Instant Credit Scoring] (<30 giây)
        |
[Approved?]
  - YES → Hiển thị "Được duyệt — góp X/tháng trong Y tháng"
           → Gửi OTP về SĐT khách
           → Khách nhập OTP → Application confirmed
           → In biên nhận
  - NO  → Hiển thị lý do từ chối (nếu policy cho phép)
           → Gợi ý sản phẩm phù hợp hơn (nếu có)
```

### 6.4 Status Transitions

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
                              ↘ REJECTED
                              ↘ PENDING_DOCS → UNDER_REVIEW (sau khi bổ sung)
```

---

## 7. Ma Trận Phân Quyền (Permission Matrix)

| Hành động | Client | POS Agent | Loan Officer | Credit Manager | Admin |
|---|---|---|---|---|---|
| Tạo đơn (self) | ✅ | ✅ (scope POS) | ✅ | ✅ | ✅ |
| Xem đơn của mình | ✅ | ✅ (đơn trong ca) | ✅ | ✅ | ✅ |
| Xem đơn của người khác | ❌ | ❌ | ✅ (team) | ✅ (all) | ✅ |
| Chỉnh sửa đơn đang review | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve / Reject | ❌ | ❌ | ❌ | ✅ | ✅ |
| Xem báo cáo merchant | ❌ | ✅ (merchant của mình) | ❌ | ✅ | ✅ |

---

## 8. Yêu Cầu Dữ Liệu (Data Requirements)

### 8.1 ApplicationRequest — Unified Model

```typescript
interface ApplicationRequest {
  // Core (tất cả channel)
  productId: number
  requestAmount: string
  requestedTenureMonths: number
  purpose: string
  hasCollateral: boolean
  hasGuarantor: boolean

  // Customer identity
  user: {
    customerName: string
    dateOfBirth: string        // ISO date
    phoneNumber: string
    national: string
    nationalId: string
    type: "CLIENT" | "STAFF"
    username: string           // = phoneNumber cho client
  }

  // Channel metadata
  channel: "STAFF" | "CLIENT" | "POS"
  consentOtp?: string          // bắt buộc với CLIENT và POS

  // POS-specific (optional, chỉ có khi channel = POS)
  merchantId?: string
  merchantCode?: string
  purchaseAmount?: number
  productCategory?: string
  downPaymentAmount?: number
}
```

### 8.2 Validation Rules

| Field | Rule |
|---|---|
| `requestAmount` | > 0; <= `product.maxAmount` |
| `requestedTenureMonths` | Trong `[product.minTenure, product.maxTenure]` |
| `dateOfBirth` | Khách >= 18 tuổi |
| `nationalId` | Format CCCD 12 số (Việt Nam) |
| `phoneNumber` | Format VN: 0[3-9]xxxxxxxx |
| `downPaymentAmount` | POS: `purchaseAmount - downPaymentAmount >= 0` |

### 8.3 Data Retention

- Đơn vay (kể cả rejected): lưu tối thiểu 5 năm (yêu cầu SBV)
- OTP logs: lưu 90 ngày cho audit
- eKYC data: theo chính sách PDPA nội bộ

---

## 9. Phụ Thuộc & Rủi Ro (Dependencies & Risks)

### Dependencies

| Phụ thuộc | Mô tả | Owner |
|---|---|---|
| Backend API `/loan-application/create` | Phải hỗ trợ unified model với `channel` field | Backend team |
| eKYC Vendor | Chưa chọn vendor — cần quyết định trước sprint Client Portal | Product |
| Credit Scoring Engine | Cần realtime scoring API cho POS instant decision | Risk team |
| Merchant Onboarding | Cần quy trình cấp merchant credentials cho POS agents | Operations |
| PDPA Consent Backend | API lưu consent record trước khi tạo application | Backend team |

### Risks & Mitigation

| Rủi ro | Xác suất | Tác động | Mitigation |
|---|---|---|---|
| eKYC vendor chưa chọn → delay Client Portal | Cao | Cao | Thiết kế eKYC abstraction layer, có thể swap vendor |
| Instant scoring chưa sẵn sàng → POS experience tệ | Trung bình | Cao | Fallback: hiển thị "Đơn đang xét duyệt" thay vì instant |
| PDPA compliance chưa clear → legal risk | Thấp | Rất cao | Ưu tiên review với legal trước khi launch client portal |
| POS thiết bị network yếu → timeout | Trung bình | Trung bình | Retry logic + offline draft cho POS form |

---

## 10. Câu Hỏi Mở (Open Questions)

### Business & Strategy

1. **Channel isolation:** Hệ thống có 1 frontend nhiều role, hay 3 platform riêng (domain khác nhau)?
2. **POS Partner tiers:** Có phân cấp đại lý A/B/C không? Mỗi tier có product catalog/lãi suất riêng không?
3. **BNPL flow:** Với POS, tiền giải ngân thẳng cho merchant hay qua khách hàng?

### Data & Integration

4. **CRM pre-fill:** Có API tra cứu thông tin khách hiện hữu theo CCCD/SĐT không?
5. **Application lifecycle:** Sau quick init, full wizard dùng `PUT /loan-application/:id` hay endpoint riêng?
6. **Document upload:** Bước nào cần upload file? Hiện tại không có upload trong bất kỳ form nào.
7. **Co-borrower:** Co-borrower có cần OTP xác thực riêng hay chỉ declarative?

### Technical

8. **eKYC vendor:** Đã chọn nhà cung cấp chưa? (VNPTSmartCA, FPT.AI, VNID, Gimo...)
9. **Backend gateway:** Production có API gateway riêng cho từng channel không?
10. **Staff roles:** Roles nào được phép tạo đơn? Loan Officer / Credit Manager có permission khác nhau?
11. **Session tại POS:** Thiết bị chia sẻ giữa nhiều nhân viên — cần per-shift logout / PIN lock?
12. **Offline support:** POS khu vực mạng yếu có cần offline mode không?

### Compliance

13. **PDPA (Nghị định 13/2023):** Consent flow cần thiết kế riêng trước khi thu thập PII — khi nào có legal review?
14. **Số đơn tối đa / CCCD:** Policy cho phép bao nhiêu đơn active đồng thời cho 1 khách hàng?

---

## 11. Phân Loại Ưu Tiên (MoSCoW)

### Must Have (blocking production)

- Nối API submit cho Flow B (6-step wizard) — `handleSubmit` phải gọi API thực
- Liên kết `applicationId` giữa Quick Init và Full Wizard
- Unified `ApplicationRequest` model với `channel` field

### Should Have (launch MVP)

- Client self-serve portal (register, form, OTP consent, status tracking)
- Save-and-resume cho client form
- Application status tracking page
- Pre-fill từ CRM khi staff tạo đơn cho khách hiện hữu

### Could Have (post-launch)

- POS Partner portal và merchant auth
- Instant credit scoring tại POS
- eKYC auto-fill từ CCCD scan
- Merchant dashboard (commission, disbursement tracking)

### Won't Have (release này)

- Offline mode cho POS
- Co-borrower eKYC riêng
- Multi-language support
- Merchant tier management

---

## 12. Định Nghĩa Hoàn Thành (Definition of Done)

### Channel 1 — Staff (Must Have)

- [ ] `handleSubmit` trong loan-form-wizard.tsx gọi `ApplicationApi.createApplication()`
- [ ] `applicationId` được truyền từ Quick Init sang Full Wizard qua URL param hoặc context
- [ ] Full Wizard dùng `PUT /loan-application/:id` để update
- [ ] Error handling hiển thị thông báo rõ ràng khi API lỗi
- [ ] Loading state + disabled button trong khi submit

### Channel 2 — Client Self-serve (Should Have)

- [ ] Public-facing route không require staff auth
- [ ] OTP flow hoàn chỉnh (send → verify → submit)
- [ ] Save-and-resume hoạt động qua localStorage
- [ ] Application status page hiển thị đúng trạng thái từ API
- [ ] Mobile responsive đạt WCAG 2.1 AA

### Channel 3 — POS Partner (Could Have)

- [ ] Merchant auth endpoint và JWT scope POS
- [ ] POS form ≤ 5 fields, submit < 5 giây
- [ ] Instant decision hiển thị trong < 30 giây
- [ ] OTP consent flow tại POS hoàn chỉnh
- [ ] Biên nhận SMS gửi về khách sau khi confirmed

---

*Tài liệu này dựa trên phân tích codebase tại ngày 30/04/2026 và kiến thức về mô hình phân phối cho vay tiêu dùng tại Việt Nam. Cần được review bởi Product Owner, Backend Architect, và Legal/Compliance trước khi đưa vào backlog chính thức.*
