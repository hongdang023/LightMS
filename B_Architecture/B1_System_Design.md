# LightMS - B1: System Design (Kiến trúc Hệ thống)

Dựa trên các yêu cầu (Requirements) và quyết định công nghệ mới nhất, hệ thống LightMS sẽ được xây dựng theo kiến trúc **Serverless & Edge Computing**, tận dụng tối đa sức mạnh của hệ sinh thái Supabase và Cloudflare để đảm bảo tốc độ cao, khả năng mở rộng tốt và chi phí vận hành tối ưu.

## 1. Technology Stack (Công nghệ Cốt lõi)

- **Frontend (Giao diện người dùng):** 
  - **Framework:** **Vite** (kết hợp ReactJS hoặc VueJS + TypeScript). 
  - **Lợi ích:** Build cực nhanh, HMR (Hot Module Replacement) siêu mốc, tối ưu hóa trải nghiệm "Zero Friction".
  - **WYSIWYG Admin UI:** Giao diện Edit Mode/Reading Mode của Admin (Course Builder, Thông báo) sử dụng chung 100% UI Components với Student Mode, đảm bảo tính đồng nhất tuyệt đối.
- **Backend & Database (Dữ liệu & Logic):** 
  - **Nền tảng:** **Supabase** (BaaS - Backend as a Service).
  - **Database:** PostgreSQL (Cấu trúc dữ liệu quan hệ mạnh, lý tưởng cho LMS).
  - **Security:** Tận dụng Row Level Security (RLS) của Supabase PostgreSQL để phân quyền (Admin, Mentor, Student) trực tiếp ở tầng Data.
  - **Logic & API:** Supabase Edge Functions (Deno) để xử lý các logic nghiệp vụ phức tạp hoặc webhook.
- **Video Hosting & Infrastructure (Hạ tầng & Video):** 
  - **Cloudflare Stream (via External Links):** Video sẽ được lưu trữ qua Cloudflare Stream với DRM chống tải lậu. Thay vì nhúng (embed) vào website, hệ thống chỉ cung cấp **đường link bảo mật** để xem video trên tab/player độc lập.
  - **Cloudflare Pages / Workers:** Deploy Frontend trực tiếp lên Cloudflare Pages.
- **Rich-Text & Formatting:**
  - **Editor Components (TipTap / Quill):** Sử dụng các thư viện Rich-Text Editor chuyên nghiệp để đảm bảo yêu cầu bài tập, feedback và comment được format đẹp mắt (bôi đậm, chèn ảnh, code block, highlight) mang lại trải nghiệm cao cấp.

---

## 2. High-Level Architecture (Kiến trúc Tổng quan)

Mô hình hệ thống hoạt động theo chuẩn **BaaS (Backend-as-a-Service)**:

1. **Client Layer (Vite App):** 
   - Ứng dụng SPA (Single Page Application) được host trên Cloudflare Pages.
   - Giao tiếp trực tiếp với Supabase thông qua `supabase-js` SDK. Sử dụng cơ chế **Supabase Realtime** để tự động lắng nghe và đồng bộ thay đổi (Ví dụ: cập nhật tức thời khi Admin sửa nội dung bài học).
2. **Data Layer (Supabase PostgreSQL):** 
   - Mọi dữ liệu về khóa học, tiến độ, bài tập được lưu ở PostgreSQL.
   - Khi Học viên query danh sách khóa học, Supabase RLS sẽ tự động kiểm tra xem Học viên đó có quyền truy cập khóa học đó không.
3. **Video Layer (External Links):** 
   - Thay vì nhúng trực tiếp làm nặng Frontend, hệ thống chỉ lưu trữ và hiển thị **đường link xem video**.
   - Học viên click vào link để xem video trên môi trường Cloudflare Player độc lập, đảm bảo hiệu suất website và tối ưu tính năng chống tải lậu (DRM).
4. **Integration Layer (Edge Functions):**
   - **Telegram Bot / Rule Engine:** Khi có sự kiện (Ví dụ: Học viên nộp bài), Supabase Database Webhook sẽ trigger một Edge Function. Function này sẽ gọi API của Telegram Bot để gửi thông báo/vinh danh lên group lớp.
   - **Onboarding Scheduler & Email Broadcast:** Sử dụng **Supabase pg_cron** kết hợp Edge Functions để chạy các tác vụ định kỳ (mở khóa tự động). Tích hợp các Email Provider API (như **Resend**) để gửi thông báo email đồng loạt cho học viên.

---

## 3. Core Database Entities (Thiết kế Dữ liệu Cốt lõi)

Dựa vào triết lý **Outcome-based Mastery** và **Action-Oriented**, hệ thống sẽ có các bảng (Tables) chính sau:

### 3.1. Users & Roles
- `profiles`: Liên kết với Supabase Auth. Lưu trữ thông tin cá nhân cơ bản (Name, Avatar, Role, Bio, Telegram_ID) cùng các thông tin nhân khẩu học & chuyên môn mở rộng (Gmail, Phone/Zalo, Facebook, Lĩnh vực, Chức danh, Tech Level, Ý tưởng sản phẩm, Cam kết thời gian, Đặt cược cá nhân, Trạng thái điền profile, và số Hải lý tích lũy).

### 3.2. Course Content (Lộ trình học)
- `courses`: Tên khóa, Mô tả, Ảnh bìa.
- `modules`: Thuộc `courses`, Thứ tự sắp xếp, `unlock_at` (Hẹn giờ mở khóa).
- `batch_schedules`: Bảng quản lý lịch trình chi tiết của từng lớp (Batch). Ánh xạ `lessons` vào ngày học cụ thể, hỗ trợ chèn tuần nghỉ và tự động dời lịch (auto-shifting).
- `announcements`: Quản lý các thông báo từ Ban tổ chức kèm tùy chọn gửi email tự động.
- `lessons`: Thuộc `modules`, Loại bài học (Video/Doc), Video_URL (Đường link bảo mật dẫn ra player ngoài), các thông tin bổ sung như ngày học, mục tiêu, tài liệu đi kèm (slide, study notes).
- `onboarding_days`: Lộ trình Onboarding 7 ngày (7 cards) quản lý việc mở khóa và nội dung từng ngày.
- `calendar_events`: Lịch học và sự kiện kiểu Google Calendar (phân loại theo các sự kiện: Kick-off, Office Hour, Live Class, Onboarding, Capstone, Class Bonding).

### 3.3. Assignments & Submissions (Bài tập & Nộp bài)
- `assignments`: Gắn liền với `lessons`. Yêu cầu bài tập được lưu trữ định dạng **Rich-Text (JSON/HTML)** đảm bảo trình bày đẹp mắt, rõ ràng.
- `submissions`: Thuộc `assignments` and `users`. Nội dung bài nộp hỗ trợ Rich-Text Editor (cho phép format text, chèn ảnh, đính kèm link, theo dõi lượt upvote từ cộng đồng).
- `feedbacks`: Của Mentor đánh giá cho `submissions`. Cung cấp khung Rich-Text Editor cho Mentor để feedback trực quan, bôi đậm lỗi sai, kèm mức độ đánh giá (Mastery Level: Đạt / Chưa đạt).

### 3.4. Community & Tracking
- `discussion_topics`: Các chủ đề thảo luận chung (như Light Support, Assignments) do Admin quản lý.
- `discussion_posts`: Các bài viết thảo luận trong từng chủ đề, hỗ trợ tag bài tập, lượt upvote, và bình luận.
- `comments`: Bình luận và thảo luận chéo giữa học viên trên bài viết hoặc bài nộp bài tập. Số lượng Upvotes và trạng thái Verified (Tích xanh cho lên Top).
- **Tracking Tiến độ (Progress Tracking):** Hệ thống đánh giá tiến độ và tính điểm của học viên hoàn toàn dựa trên mức độ hoàn thành bài tập về nhà (`submissions` có status = `submitted` hoặc `graded`), thay vì đo lường qua hệ thống kỹ năng phức tạp.

### 3.5. Gamification & Rewards (Hệ thống phần thưởng)
- `nautical_miles_transactions`: Lưu lịch sử giao dịch cộng/trừ điểm Hải lý của học viên (ngày, lý do, số lượng).
- `badges`: Danh mục các Huy hiệu có thể đạt được trong khóa học.
- `profile_badges`: Bảng trung gian lưu trữ các Huy hiệu mà từng học viên đã mở khóa.

---

## 4. Rule Engine & Automations (Kiến trúc Tự động hóa)

Để giải quyết yêu cầu **Tự động hóa (Rule Engine)**, hệ thống sẽ sử dụng **Supabase Database Webhooks** kết hợp **Edge Functions**:

1. **Trigger (Bóp cò):** Một bản ghi được INSERT/UPDATE trong database.
   - *Ví dụ:* Một `submission` được chuyển status thành `Graded` và Mastery Level = `Mastery`.
2. **Processing (Xử lý):** Webhook đẩy data gọi Supabase Edge Function (hoặc Cloudflare Worker).
3. **Action (Hành động):** 
   - Function format lại thông báo thành text có chứa Emoji chúc mừng.
   - Gọi POST request đến API của Telegram Bot.
   - Telegram Bot bắn tin nhắn vinh danh lên Channel của Lớp (Wall of Fame).

Kiến trúc này giúp hệ thống tách bạch hoàn toàn phần logic gửi thông báo ra khỏi Frontend, không làm chậm quá trình nộp bài của học viên, và cực kỳ dễ scale khi số lượng học viên tăng đột biến.
