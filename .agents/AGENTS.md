# LightMS — Agent Rules (AGENTS.md)

## 🚨 CRITICAL: Docs-First Workflow

**Docs là luật tối cao. Code phải tuân theo docs, không phải ngược lại.**

Toàn bộ quyết định về tính năng, thiết kế, database, và UX đều đã được định nghĩa trong tài liệu A_ và B_. AI PHẢI đọc tài liệu liên quan trước khi viết bất kỳ dòng code nào.

---

## 1. Hệ thống Tài liệu

### Layer A — Requirements (Yêu cầu nghiệp vụ)
> **Đây là nguồn gốc của mọi tính năng.** Nếu một tính năng không được mô tả trong A_, nó không tồn tại.

| File | Phạm vi quy định |
|------|-----------------|
| [A0_Standards.md](A_Requirement/A0_Standards.md) | Triết lý chung, tiêu chí hoàn thiện một requirement |
| [A1_User_Stories.md](A_Requirement/A1_User_Stories.md) | User stories, use cases từ góc nhìn người dùng |
| [A2_Sitemap.md](A_Requirement/A2_Sitemap.md) | Cấu trúc trang, navigation flow, page hierarchy |
| [A3_Functional_Requirements.md](A_Requirement/A3_Functional_Requirements.md) | Yêu cầu chức năng cụ thể cho từng tính năng |
| [A4_Non_Functional_Requirements.md](A_Requirement/A4_Non_Functional_Requirements.md) | Yêu cầu phi chức năng (performance, security, UX) |
| [A6_Gamification.md](A_Requirement/A6_Gamification.md) | Toàn bộ logic gamification: Hải lý, Badge, Leaderboard |
| [A7_Onboarding_Week.md](A_Requirement/A7_Onboarding_Week.md) | Chi tiết luồng Onboarding 7 ngày |
| [A8_Syllabus_Contents.md](A_Requirement/A8_Syllabus_Contents.md) | Cấu trúc nội dung bài học, assignments, submissions |
| [A9.1_Test_Scenarios_Students.md](A_Requirement/A9.1_Test_Scenarios_Students.md) | Test scenarios cho Student flow |
| [A9.2_Test_Scenarios_Admin.md](A_Requirement/A9.2_Test_Scenarios_Admin.md) | Test scenarios cho Admin flow |

### Layer B — Architecture (Kiến trúc & Thiết kế)
> **Đây là blueprint kỹ thuật.** Mọi quyết định về tech, UI, database phải tuân theo B_.

| File | Phạm vi quy định | Code files bị ảnh hưởng |
|------|-----------------|------------------------|
| [B1_System_Design.md](B_Architecture/B1_System_Design.md) | Tech stack, kiến trúc hệ thống, deployment | `vite.config.ts`, `package.json`, env configs |
| [B2_Database_Schema.md](B_Architecture/B2_Database_Schema.md) | Database schema, table definitions, relations | `supabase/migrations/`, `DatabaseContext.tsx`, tất cả types |
| [B3_ERD_Diagram.md](B_Architecture/B3_ERD_Diagram.md) | ERD diagram — visual của B2 | Không có file code trực tiếp |
| [B4_UI_Design_System.md](B_Architecture/B4_UI_Design_System.md) | Colors, Typography, Components, Tokens | `src/index.css`, `src/components/ui/*`, mọi className UI |
| [B5_Tone_of_Voices.md](B_Architecture/B5_Tone_of_Voices.md) | Ngôn ngữ, giọng văn, copy cho mọi UI text | Mọi string hiển thị cho user |

---

## 2. Mandatory Reading Rules (Bắt buộc đọc trước khi làm)

### Rule 2.1 — Trước khi viết bất kỳ code UI nào:
**BẮT BUỘC** đọc theo thứ tự:
1. `B4_UI_Design_System.md` — §7 Design Tokens + §8 Component Specs
2. `B5_Tone_of_Voices.md` — nếu có text hiển thị cho user

### Rule 2.2 — Trước khi implement tính năng mới:
**BẮT BUỘC** đọc theo thứ tự:
1. `A3_Functional_Requirements.md` — xác nhận tính năng có được yêu cầu không
2. `A1_User_Stories.md` — hiểu context người dùng
3. `B2_Database_Schema.md` — xác nhận table/column cần thiết đã tồn tại

### Rule 2.3 — Trước khi đụng vào database/schema:
**BẮT BUỘC** đọc:
1. `B2_Database_Schema.md` — full schema
2. `B3_ERD_Diagram.md` — kiểm tra relations

### Rule 2.4 — Trước khi thêm/sửa gamification logic:
**BẮT BUỘC** đọc:
1. `A6_Gamification.md` — toàn bộ

### Rule 2.5 — Trước khi thêm/sửa onboarding logic:
**BẮT BUỘC** đọc:
1. `A7_Onboarding_Week.md` — toàn bộ

---

## 3. Docs-First Protocol (Quy trình bắt buộc)

### Khi User thay đổi một file trong A_ hoặc B_:

**AI phải:**
1. **Đọc toàn bộ file vừa thay đổi**
2. **Xác định Impact** — file docs này ảnh hưởng đến code file nào (dựa theo bảng §1)
3. **Cập nhật code** theo đúng spec mới trong docs
4. **Kiểm tra tính nhất quán** — nếu thay đổi ảnh hưởng đến docs khác, báo cáo cho User

**AI không được:**
- Implement tính năng không có trong A_Requirement
- Dùng màu, font, spacing không có trong B4 §7 Design Tokens
- Tự quyết định UI pattern không được document trong B4

### Khi User yêu cầu thêm tính năng mới:

**Nếu tính năng chưa có trong A_Requirement:**
→ AI phải **từ chối implement ngay** và nhắc User: *"Tính năng này chưa được document. Bạn muốn thêm vào A3_Functional_Requirements.md trước không?"*

**Nếu tính năng đã có:**
→ Đọc A_ + B_ liên quan, implement đúng spec, không thêm/bớt.

---

## 4. UI Implementation Rules

> Mọi rule dưới đây đến từ `B4_UI_Design_System.md`.

### Colors
- **Chỉ dùng màu từ B4 §7.1 Design Tokens**. Không hardcode hex màu tùy tiện.
- Màu brand: dùng CSS variable `var(--primary-teal)`, `var(--deep-gold)`, v.v.
- Không dùng Tailwind color classes mặc định (`bg-blue-500`, `text-green-600`) cho brand elements.

### Typography
- Font: **Inter** cho UI text, **JetBrains Mono** cho code. Không dùng Roboto hay font khác.
- Heading scale: tuân theo B4 §3.2.

### Buttons
- Chỉ dùng `<Button>` component từ `src/components/ui/Button.tsx`
- Variants hợp lệ: `primary`, `secondary`, `gamification`, `danger`, `ghost`
- **Không dùng `variant="amber"`** — đã deprecated, thay bằng `variant="gamification"`
- Mỗi màn hình chỉ được có **1 Primary Button**

### Badges
- Chỉ dùng `<Badge>` component từ `src/components/ui/Badge.tsx`
- Variants theo ngữ nghĩa LightMS: `mastery`, `submitted`, `graded`, `pending`, `overdue`

### Alerts
- Success (nộp bài, hoàn thành): màu `var(--success)` = `#10B981` (xanh lá)
- Mastery (gamification): màu `var(--deep-gold)` = `#EAB308` (vàng)
- **Không dùng vàng gold cho generic success**

---

## 5. What NOT to do

- ❌ Không tự tạo component UI mới mà không check B4 §8 trước
- ❌ Không gợi ý "tạo Button.tsx" nếu file đó đã tồn tại
- ❌ Không implement logic gamification mà không đọc A6
- ❌ Không sửa database migration mà không đọc B2
- ❌ Không dùng màu `sky`, `emerald`, `purple` của Tailwind cho brand elements
- ❌ Không để section trống trong docs (§ không có body là bug của docs, phải báo)
- ❌ Không nói "hoặc" trong spec — mọi quyết định phải được chốt 1 giá trị duy nhất
