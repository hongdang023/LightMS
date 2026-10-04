# LightMS - B1: System Design (Kiến trúc Hệ thống)

> **Last Updated:** 2026-10-01 | **Status:** ✅ Synced với Cloudflare D1/R2 Stack & Multi-Course Multi-Batch

Dựa trên các yêu cầu (Requirements) và quyết định công nghệ mới nhất, hệ thống LightMS được xây dựng theo kiến trúc **Serverless & Edge Computing**, chạy hoàn toàn trên hệ sinh thái **Cloudflare (Pages, Workers, D1, R2)** với **Drizzle ORM** để đảm bảo tốc độ đáp ứng siêu tốc (Edge latency), khả năng mở rộng đa khóa học/đa lớp (Multi-Course & Multi-Batch), và tối ưu hóa chi phí vận hành.

---

## 1. Technology Stack (Công nghệ Cốt lõi)

- **Frontend (Giao diện người dùng):**
  - **Framework:** **Vite + React + TypeScript**.
  - **Deployment:** Cloudflare Pages (SPA - Single Page Application).
  - **WYSIWYG Admin UI:** Giao diện Edit Mode/Reading Mode của Admin sử dụng chung 100% UI Components với Student Mode.
  - **Mobile Responsive Design:** Phương thức Mobile-first thông qua các breakpoint của Tailwind CSS (`md: 768px`) và media queries tùy chỉnh. Giao diện Sidebar chuyển thành Drawer trượt trên thiết bị di động.
- **Backend & Database (Dữ liệu & Logic ở Edge):**
  - **Database:** **Cloudflare D1** (Serverless SQL Database dựa trên SQLite ở Edge).
  - **ORM & Data Layer:** **Drizzle ORM** (Type-safe SQL query builder & schema migration tool tối ưu nhất cho D1).
  - **Object Storage:** **Cloudflare R2** (Lưu trữ ảnh đại diện, tài liệu bài học, ảnh nộp bài tập).
  - **API & Logic Layer:** **Cloudflare Workers** (Edge Functions xử lý API REST/RPC, JWT Auth, Enrollment Codes).
  - **Auth Strategy:** Cloudflare Worker JWT / Session Token lưu tại D1 HTTP-only Cookies + Secure Headers.
- **Rich-Text & Formatting:**
  - **Editor Components (TipTap / Quill):** Format bài viết, yêu cầu bài tập, feedback và comment đẹp mắt (bôi đậm, chèn ảnh, code block, highlight).

---

## 2. High-Level Architecture (Kiến trúc Tổng quan)

Mô hình hệ thống hoạt động theo chuẩn **Edge Micro-Services / API Gateway**:

1. **Client Layer (Vite SPA on Cloudflare Pages):**
   - Học viên & Admin tương tác với ứng dụng Web SPA.
   - Giao tiếp với Backend qua Cloudflare Worker REST API (`/api/*`).
2. **Edge API Layer (Cloudflare Workers):**
   - Xử lý xác thực người dùng (Auth Worker), xác minh **Mã kích hoạt khóa học (Access Code)**, cấp quyền truy cập Batch.
   - Xử lý các tác vụ nghiệp vụ, tính điểm Hải lý, cấp Badge.
3. **Data & Storage Layer (Cloudflare D1 & R2):**
   - **D1 SQL Database:** Quản lý `courses`, `batches`, `enrollments`, `users`, `lessons`, `calendar_events`, `submissions`, `badges`.
   - **R2 Storage:** Lưu trữ và phân phối static media, avatar, assignment attachments qua Cloudflare CDN URL.

---

## 3. Core Database Entities (Thiết kế Dữ liệu Multi-Course & Multi-Batch)

Hệ thống hỗ trợ hệ sinh thái nhiều Khóa học (Vibe Coding 101, Vibe Coding 201, Obsidian 101, Mobile Agents...) và nhiều Batch (K1, K2, K3...):

### 3.1. Users, Roles & Enrollments
- `users`: Tài khoản người dùng (Email, Password Hash / Auth Provider ID, Role: `Admin` | `Student`, Profile Info, Hải lý tích lũy tổng).
- `courses`: Danh mục khóa học (id, slug, title, description, cover_image, is_active).
- `batches`: Danh sách các khóa/lớp học của từng Course (id, course_id, batch_name, access_code, start_date, end_date, max_students).
- `batch_enrollments`: Quản lý việc ghi danh của học viên vào từng Batch (id, user_id, batch_id, access_code_used, enrolled_at, status). Học viên phải nhập đúng `access_code` của Batch để kích hoạt ghi danh.

### 3.2. Shared vs Batch-Scoped Content
- **Course Level (Dùng chung cho cả Course):**
  - `lessons`: Danh mục bài học, video URL, study notes, rubric bài tập, onboarding cards framework.
- **Batch Level (Tách riêng cho từng Batch):**
  - `calendar_events`: Lịch học, Office Hours, Kick-off riêng của từng Batch.
  - `submissions`: Bài nộp & Feedback của học viên theo Batch.
  - `leaderboard`: Bảng xếp hạng Hải lý riêng của từng Batch.

---

## 4. Enrollment Code & Access Control (Cơ chế Mã kích hoạt)

1. **Khóa học công khai vs Khóa học bảo mật:**
   - Mỗi Batch sở hữu một **Mã kích hoạt (Access Code)** duy nhất do Admin tạo (ví dụ: `VIBE201-K3-888`).
2. **Kích hoạt tài khoản / Khóa học:**
   - Khi học viên truy cập Course Hub trên Dashboard, các khóa học chưa kích hoạt sẽ có biểu tượng 🔒 **Yêu cầu mã kích hoạt**.
   - Học viên nhập mã -> API xác thực `access_code` -> Tạo bản ghi trong `batch_enrollments` -> Mở khóa không gian học tập của Batch tương ứng.
