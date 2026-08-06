# LightMS - B2: Database Schema (Thiết kế Cơ sở dữ liệu)

> **Last Updated:** 2026-08-07 | **Status:** ✅ Synced với codebase hiện tại

Hệ thống sử dụng **PostgreSQL** trên nền tảng **Supabase**. Cấu trúc dưới đây được thiết kế tối ưu cho mô hình Outcome-based Mastery và Action-Oriented, đồng bộ 100% với mã nguồn đang chạy trên Website.

---

## 1. User & Access Management (Quản lý Người dùng)

Xác thực (Authentication) được quản lý qua bảng mặc định `auth.users` của Supabase. Hệ thống tách riêng **`profiles`** (dành riêng cho Học viên) và **`admins`** (dành riêng cho Quản trị viên).

### `profiles` (Hồ sơ học viên)

| Column Name               | Type          | Constraints                       | Description                                                        |
| :------------------------ | :------------ | :-------------------------------- | :----------------------------------------------------------------- |
| `id`                      | `uuid`        | PK, FK (`auth.users.id`)          | Liên kết với Supabase Auth                                         |
| `full_name`               | `text`        | NOT NULL                          | Họ và tên học viên                                                 |
| `avatar_url`              | `text`        |                                   | Link ảnh đại diện                                                  |
| `gmail`                   | `text`        | NOT NULL, UNIQUE                  | Email liên kết Google Workspace/Calendar                           |
| `phone_number`            | `text`        |                                   | Số điện thoại liên hệ (Zalo)                                       |
| `facebook_url`            | `text`        |                                   | Đường dẫn đến profile Facebook cá nhân                             |
| `industry`                | `text`        |                                   | Lĩnh vực hoạt động chuyên môn                                      |
| `current_job`             | `text`        |                                   | Công việc/Chức danh hiện tại                                       |
| `product_idea`            | `text`        |                                   | Ý tưởng sản phẩm số dự kiến xây dựng                               |
| `is_profile_completed`    | `boolean`     | DEFAULT `false`                   | Đánh dấu đã khai báo đầy đủ 100% profile                           |
| `nautical_miles`          | `int`         | DEFAULT 0                         | Tổng số Hải lý (Điểm tích lũy Gamification)                        |
| `visits`                  | `int`         | DEFAULT 0                         | Số lần truy cập vào hệ thống                                       |
| `referral_source`         | `text`        |                                   | Bạn biết tới khoá học này từ đâu? (Lựa chọn từ danh sách)          |
| `current_role`            | `text`        |                                   | Vai trò hiện tại của bạn? (Lựa chọn từ danh sách)                  |
| `work_field`              | `text`        |                                   | Bạn đang học/làm trong lĩnh vực gì? (Lựa chọn từ danh sách)        |
| `living_region`           | `text`        |                                   | Hiện tại bạn đang sinh sống ở khu vực nào? (Lựa chọn từ danh sách) |
| `gender`                  | `text`        |                                   | Giới tính (Nam, Nữ, Other)                                         |
| `age_group`               | `text`        |                                   | Bạn năm nay bao nhiêu tuổi? (Lựa chọn từ danh sách)                |
| `onboarding_tasks`        | `jsonb`       | DEFAULT `'{}'::jsonb`             | Danh sách check-off các nhiệm vụ onboarding (dạng Object mapping)  |
| `liveclass_tasks`         | `jsonb`       | DEFAULT `'{}'::jsonb`             | Danh sách check-off các bài tập/tiêu chí Live Class                |
| `badges`                  | `jsonb`       | DEFAULT `'[]'::jsonb`             | Danh sách các huy hiệu học viên sở hữu (dạng Array Object)         |
| `created_at`              | `timestamptz` | DEFAULT `now()`                   |                                                                    |

### `admins` (Hồ sơ quản trị viên)

| Column Name        | Type          | Constraints              | Description                                                                     |
| :----------------- | :------------ | :----------------------- | :------------------------------------------------------------------------------ |
| `id`               | `uuid`        | PK, FK (`auth.users.id`) | Liên kết với Supabase Auth                                                      |
| `full_name`        | `text`        | NOT NULL                 | Họ và tên Admin                                                                 |
| `avatar_url`       | `text`        |                          | Link ảnh đại diện                                                               |
| `gmail`            | `text`        | NOT NULL, UNIQUE         | Email liên hệ / đăng nhập                                                       |
| `phone_number`     | `text`        |                          | Số điện thoại liên hệ                                                           |
| `admin_role`       | `enum`        | DEFAULT `'Operations'`   | Vai trò: `'Founder'`, `'Trainer'`, `'Teaching Assistant (TA)'`, `'Operations'` |
| `assigned_batches` | `text[]`      | DEFAULT `'{}'`           | Lớp học phụ trách                                                               |
| `expertise_areas`  | `text`        |                          | Thế mạnh chuyên môn (Tự điền)                                                   |
| `is_onboarded`     | `boolean`     | DEFAULT `false`          | Đã hoàn thành khảo sát Onboarding Admin                                         |
| `telegram_id`      | `text`        |                          | ID Telegram hỗ trợ                                                              |
| `created_at`       | `timestamptz` | DEFAULT `now()`          |                                                                                 |
---

## 2. Course, Cohorts & Learning Materials (Khóa học & Lớp học)

### `courses` (Khóa học)

| Column Name   | Type   | Constraints | Description                      |
| :------------ | :----- | :---------- | :------------------------------- |
| `id`          | `uuid` | PK          |                                  |
| `title`       | `text` | NOT NULL    | Tên khóa học                     |
| `description` | `text` |             | Giới thiệu tổng quan (Rich-text) |
| `cover_image` | `text` |             | Ảnh bìa                          |

### `batches` (Lớp học / Cohorts)

| Column Name  | Type   | Constraints        | Description                  |
| :----------- | :----- | :----------------- | :--------------------------- |
| `id`         | `uuid` | PK                 |                              |
| `course_id`  | `uuid` | FK (`courses.id`)  | Batch này thuộc Khóa học nào |
| `name`       | `text` | NOT NULL           | Tên lớp (VD: DA-Batch 1)     |
| `start_date` | `date` |                    | Ngày khai giảng              |
| `end_date`   | `date` |                    | Ngày bế giảng                |
| `mentor_id`  | `uuid` | FK (`profiles.id`) | Admin phụ trách chính        |
### `lessons` (Bài học)

| Column Name      | Type      | Constraints           | Description                        |
| :--------------- | :-------- | :-------------------- | :--------------------------------- |
| `id`             | `uuid`    | PK                    |                                    |
| `course_id`      | `uuid`    | FK (`courses.id`)     | Bài học này thuộc Khóa học nào     |
| `title`          | `text`    | NOT NULL              | Tên bài học                        |
| `type`           | `enum`    | `'video', 'document'` | Phân loại bài học                  |
| `content`        | `text`    |                       | Nội dung text/tài liệu (Rich-text) |
| `video_url`      | `text`    |                       | Đường link xem video bảo mật       |
| `order_index`    | `int`     |                       | Thứ tự hiển thị                    |
| `start_date`     | `date`    |                       | Ngày học/mở khóa                   |
| `target`         | `text`    |                       | Mục tiêu của bài học               |
| `has_materials`  | `boolean` | DEFAULT `false`       | Có tài liệu học tập hay không      |
| `slide_url`      | `text`    |                       | Đường link tài liệu Slide          |
| `study_note_url` | `text`    |                       | Đường link tài liệu Study Notes    |
| `key_concepts`   | `text[]`  |                       | Khái niệm cốt lõi của bài học      |
| `supporting_resources` | `jsonb` |                    | Danh sách các tài nguyên hỗ trợ khác (VD: `[{"label": "Link", "url": "..."}]`) |
| `assignment_description` | `text` |                    | Đề bài bài tập về nhà (Rich-text) |
| `assignment_rubric_checklist` | `jsonb` |              | Danh sách tiêu chí tự đánh giá (VD: `[{"item": "X", "is_optional": false}]`) |

---

## 3. Gamification & Rewards (Hệ thống Trò chơi hóa)

### Thiết kế tối ưu hóa
1. **Điểm Hải lý (Nautical Miles):**
   - Điểm số tích lũy của học viên được lưu trực tiếp trong trường `profiles.nautical_miles` làm bộ nhớ đệm (Cache) để hiển thị tức thời lên thanh giao diện (Header, Dashboard).
   - Bảng `nautical_miles_transactions` đóng vai trò là **sổ cái giao dịch (Audit Trail)**, ghi lại lịch sử cộng/trừ điểm chi tiết. Việc này giúp hệ thống minh bạch, dễ dàng đối chiếu khi học viên thắc mắc và vẽ biểu đồ tiến độ lịch sử.
2. **Huy hiệu (Badges):**
   - Danh sách huy hiệu định sẵn được lưu ở bảng `badges`.
   - Để tối ưu hóa và giảm số lượng bảng liên kết (Junction tables), chúng ta **loại bỏ hoàn toàn bảng `profile_badges`**. Danh sách huy hiệu học viên đã mở khóa được lưu trực tiếp trong cột `profiles.badges` dưới dạng một mảng JSONB: `[ { "badge_id": "uuid", "unlocked_at": "timestamp" } ]`. Điều này giúp truy vấn thông tin học viên kèm huy hiệu chỉ trong một câu lệnh duy nhất mà không cần JOIN nhiều bảng.

---

### `nautical_miles_transactions` (Lịch sử giao dịch Hải lý)

| Column Name    | Type          | Constraints        | Description                                        |
| :------------- | :------------ | :----------------- | :------------------------------------------------- |
| `id`           | `uuid`        | PK                 |                                                    |
| `student_id`   | `uuid`        | FK (`profiles.id`) | Thủy thủ nhận điểm                                 |
| `amount`       | `int`         | NOT NULL           | Số Hải lý cộng/trừ (Ví dụ: +50, -10)               |
| `action_type`  | `text`        | NOT NULL           | Loại hành động — xem danh sách đầy đủ bên dưới    |
| `reference_id` | `uuid`        |                    | Khóa ngoại tham chiếu (VD: ID bài học)             |
| `description`  | `text`        | NOT NULL           | Nội dung chi tiết giao dịch                        |
| `created_at`   | `timestamptz` | DEFAULT `now()`    | Thời điểm thực hiện                                |

**Danh sách `action_type` hợp lệ:**

| `action_type` | Điểm | Mô tả |
| :--- | :--- | :--- |
| `profile_completion` | +50 NM | Hoàn thành khai báo 100% Profile lần đầu |
| `lesson_complete` | +20 NM | Hoàn thành bài học không có bài tập |
| `assignment_graded` | +50 NM | Hoàn thành tự đối chiếu Rubric Checklist của bài học có bài tập |
| `onboarding_day_complete` | +50 NM | Hoàn thành 1 ngày Onboarding |
| `submission_kudos` | Biến động | Admin khen thưởng điểm thêm |
| `assignment_submitted` | 0 NM | *Legacy — hiện không dùng* |


### `badges` (Danh mục Huy hiệu)

| Column Name   | Type   | Constraints | Description                                       |
| :------------ | :----- | :---------- | :------------------------------------------------ |
| `id`          | `uuid` | PK          |                                                   |
| `name`        | `text` | NOT NULL    | Tên huy hiệu (VD: Cánh buồm no gió, Thẻ căn cước) |
| `icon`        | `text` | NOT NULL    | Biểu tượng cảm xúc hiển thị                       |
| `description` | `text` |             | Ý nghĩa của huy hiệu                              |
| `condition`   | `text` |             | Điều kiện tự động mở khóa huy hiệu                |

---

### Quy tắc Tính điểm & Game hoạt động (Gamification Mechanics)

#### 1. Quy tắc cộng điểm Hải lý (Nautical Miles)
* **Hoàn thành hồ sơ (Onboarding Profile):** Cộng `50 NM` khi học viên hoàn tất thông tin khảo sát onboarding (khi `is_profile_completed` chuyển thành `true`).
* **Hoàn thành Ngày học Onboarding (Day 1 - Day 7):** Mỗi ngày học onboarding hoàn thành (check-off hết các task bắt buộc) được cộng `50 NM`.
* **Hoàn thành bài học Live Class (không có bài tập):** Cộng `20 NM` khi học viên bấm hoàn thành nội dung bài học.
* **Hoàn thành bài học Live Class (có bài tập về nhà):** Cộng `50 NM` khi học viên hoàn thành tự đối chiếu bộ tiêu chí đánh giá (Checklist Rubrics) của bài học đó.


#### 2. Cơ chế kích hoạt mở khóa Huy hiệu (Badges)
Hệ thống tự động kiểm tra điều kiện mở khóa (Triggers) mỗi khi có giao dịch điểm hoặc hành động mới:
* **Huy hiệu "Thẻ Căn Cước Thủy Thủ" 🪪:** Mở khóa ngay khi học viên hoàn thành khai báo 100% Profile.
* **Huy hiệu "Cánh Buồm Khởi Hành" ⛵:** Mở khóa khi hoàn thành ngày học Onboarding đầu tiên (Day 1).
* **Huy hiệu "Vượt Sóng Băng Băng" 🌊:** Mở khóa khi hoàn thành mốc 3 ngày Onboarding đầu tiên (Day 1 - Day 3).
* **Huy hiệu "Thủy Thủ Lão Luyện" ⚓:** Mở khóa khi hoàn thành trọn vẹn hành trình 7 ngày Onboarding.
* **Huy hiệu "Bài Tập Đầu Tay" 📝:** Mở khóa khi hoàn thành bài tập về nhà đầu tiên.
* **Huy hiệu "Thủy Thủ Chăm Chỉ" ✍️:** Mở khóa khi hoàn thành mốc 3 bài tập về nhà.
* **Huy hiệu "Thuyền Trưởng Gương Mẫu" 🧑‍✈️:** Mở khóa khi hoàn thành đầy đủ 100% bài tập về nhà của khóa học.

---

## 4. Announcements & Schedules (Thông báo & Lịch học)

### `announcements` (Thông báo)

| Column Name     | Type          | Constraints        | Description                                |
| :-------------- | :------------ | :----------------- | :----------------------------------------- |
| `id`            | `uuid`        | PK                 |                                            |
| `course_id`     | `uuid`        | FK (`courses.id`)  | Thông báo chung cho toàn khóa học (nếu có) |
| `batch_id`      | `uuid`        | FK (`batches.id`)  | Thông báo riêng cho lớp học (nếu có)       |
| `title`         | `text`        | NOT NULL           | Tiêu đề thông báo                          |
| `content`       | `text`        | NOT NULL           | Nội dung thông báo                         |
| `created_by`    | `uuid`        | FK (`profiles.id`) | Admin tạo thông báo                        |
| `send_email`    | `boolean`     | DEFAULT `false`    | Cờ gửi email tự động                       |
| `sent_email_at` | `timestamptz` |                    | Thời điểm đã gửi email                     |
| `media_urls`    | `text[]`      | DEFAULT `'{}'`     | Link đính kèm hình ảnh/video               |
| `category`      | `text`        |                    | Phân loại: `'system'`, `'leaderboard'`, `'content_update'`, `'schedule'`, `'achievement'` |
| `is_auto`       | `boolean`     | DEFAULT `false`    | `true` = do Automated System tạo, `false` = Admin tạo thủ công. Dùng để Admin filter và kiểm soát tần suất tự động |
| `target_id`     | `text`        |                    | ID tham chiếu tới entity gốc trigger thông báo (VD: `leaderboard-top1-{student_id}-{date}`). Dùng để check trùng tránh spam |
| `created_at`    | `timestamptz` | DEFAULT `now()`    |                                            |

### `onboarding_days` (Chi tiết ngày Onboarding)

| Column Name      | Type   | Constraints | Description                                |
| :--------------- | :----- | :---------- | :----------------------------------------- |
| `day`            | `int`  | PK          | Số ngày (Từ 1 đến 8)                       |
| `title`          | `text` | NOT NULL    | Tiêu đề ngày học                           |
| `intro`          | `text` |             | Lời giới thiệu đầu ngày                    |
| `objective`      | `text` |             | Mục tiêu ngày học                          |
| `checklist`      | `text` |             | Các nhiệm vụ cần thực hiện (dạng Markdown) |
| `takeaway`       | `text` |             | Thu hoạch đúc kết sau ngày học             |
| `email_subject`  | `text` |             | Tiêu đề email mở khóa tự động              |
| `email_body`     | `text` |             | Nội dung email mở khóa tự động             |
| `companionHint`  | `text` |             | Gợi ý của đồng đội ảo                      |
| `bonusResources` | `text` |             | Tài nguyên mở rộng đi kèm                  |
### `calendar_events` (Sự kiện lớp học)

| Column Name       | Type      | Constraints     | Description                                                                                   |
| :---------------- | :-------- | :-------------- | :-------------------------------------------------------------------------------------------- |
| `id`              | `uuid`    | PK              |                                                                                               |
| `title`           | `text`    | NOT NULL        | Tiêu đề buổi học/sự kiện                                                                      |
| `time`            | `text`    | NOT NULL        | Giờ bắt đầu (Ví dụ: '20:00')                                                                  |
| `end_time`        | `text`    |                 | Giờ kết thúc (Ví dụ: '22:00')                                                                 |
| `all_day`         | `boolean` | DEFAULT `false` | Sự kiện cả ngày                                                                               |
| `date`            | `int`     |                 | Ngày cụ thể trong tháng (1-31)                                                                |
| `month`           | `int`     |                 | Tháng cụ thể (0-11)                                                                           |
| `year`            | `int`     |                 | Năm cụ thể                                                                                    |
| `day_of_week`     | `int`     |                 | Thứ trong tuần (1: Thứ hai - 7: Chủ nhật)                                                     |
| `start_recur`     | `bigint`  |                 | Timestamp bắt đầu lặp sự kiện                                                                 |
| `end_recur`       | `bigint`  |                 | Timestamp kết thúc lặp sự kiện                                                                |
| `color_class`     | `text`    |                 | CSS Class màu nền hiển thị sự kiện                                                            |
| `dot_color_class` | `text`    |                 | CSS Class màu dấu chấm sự kiện trên lịch                                                      |
| `type`            | `text`    |                 | Loại chính: 'class', 'community', 'other'                                                     |
| `event_type`      | `text`    |                 | Phân loại: 'kick-off', 'office-hour', 'live-class', 'onboarding', 'capstone', 'class-bonding' |
| `details`         | `text`    |                 | Chi tiết nội dung/link mô tả sự kiện                                                          |

---

## 5. HelpDesk (Hỏi đáp & Hỗ trợ)

### `help_desk_faqs` (Câu hỏi thường gặp)

| Column Name     | Type          | Constraints     | Description |
| :-------------- | :------------ | :-------------- | :---------- |
| `id`            | `uuid`        | PK              | |
| `category`      | `text`        | NOT NULL        | Nhóm chủ đề câu hỏi (VD: "Bài tập", "Tài khoản") |
| `question`      | `text`        | NOT NULL        | Câu hỏi |
| `description`   | `text`        |                 | Tóm tắt ngắn |
| `sections`      | `jsonb`       |                 | Nội dung chi tiết dạng `[{ "id": "uuid", "title": "...", "content": "markdown" }]` |
| `order_index`   | `int`         | DEFAULT 0       | Thứ tự hiển thị |
| `last_updated`  | `timestamptz` | DEFAULT `now()` | Lần cập nhật cuối |

---

## 6. Static Content (Nội dung Tĩnh có thể chỉnh sửa)

### `about_content` (Nội dung trang Giới thiệu)

Bảng lưu nội dung trang **Giới thiệu** (About) cho phép Admin chỉnh sửa thông tin khóa học trực tiếp trên giao diện. Chỉ có **1 bản ghi duy nhất** với `id = 'default'`.

| Column Name        | Type    | Description |
| :----------------- | :------ | :---------- |
| `id`               | `text`  | PK — luôn là `'default'` |
| `overview_text`    | `text`  | Nội dung phần Tổng quan |
| `schedule_text`    | `text`  | Nội dung phần Lịch học |
| `benefits_text`    | `text`  | Nội dung phần Lợi ích |
| `video_url`        | `text`  | Link video giới thiệu |
| `platform_buttons` | `jsonb` | Danh sách nút platform `[{ "icon", "title", "subtitle", "url" }]` |
| `benefit_clubs`    | `jsonb` | Danh sách club lợi ích `[{ "icon", "name", "desc", "links" }]` |
| `quote`            | `text`  | Câu trích dẫn nổi bật |
| `gach_dau_dong`    | `jsonb` | Danh sách gạch đầu dòng highlight |
| `tru_cot_1`        | `jsonb` | Trụ cột 1 `{ "title", "subtitle", "desc" }` |
| `tru_cot_2`        | `jsonb` | Trụ cột 2 |
| `tru_cot_3`        | `jsonb` | Trụ cột 3 |
| `outro`            | `text`  | Đoạn kết |
| `sdt_note`         | `text`  | Lưu ý số điện thoại |
| `office_hour_desc` | `text`  | Mô tả Office Hour |
| `luu_y_gold`       | `text`  | Thông điệp nổi bật (gold highlight) |
